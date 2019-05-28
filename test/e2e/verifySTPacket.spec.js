const { startDrive } = require('@axerunners/dp-services-ctl');

const AxePlatformProtocol = require('../../lib/AxePlatformProtocol');

const registerUser = require('../../lib/test/e2e/registerUser');
const sendSTPacket = require('../../lib/test/e2e/sendSTPacket');
const createStateTransition = require('../../lib/test/e2e/createStateTransition');
const isDriveSynced = require('../../lib/test/e2e/isDriveSynced');

describe('verifySTPacket', function main() {
  this.timeout(90000);

  let app;
  let drive;

  before(async () => {
    app = new AxePlatformProtocol();

    drive = await startDrive();

    // Activate Special Transactions
    await drive.axeCore.getApi().generate(1000);
  });

  it('should verify DP object uniqueness by indices by submitting correct queries to Drive', async () => {
    // Register a user
    const user = await registerUser(
      'simpleBlockchainUser',
      drive.axeCore.getApi(),
    );

    // Create the data contract
    const contract = app.contract.create('IndexedContract', {
      profile: {
        indices: [
          {
            properties: [
              { $userId: 'asc' },
              { firstName: 'desc' },
            ],
            unique: true,
          },
          {
            properties: [
              { $userId: 'asc' },
              { email: 'asc' },
            ],
            unique: true,
          },
        ],
        properties: {
          firstName: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
        },
        required: ['firstName', 'email'],
        additionalProperties: false,
      },
    });

    app.setContract(contract);

    const contractPacket = app.packet.create(contract);

    const contractTransaction = createStateTransition(
      user,
      contractPacket,
    );

    const contractTsId = await sendSTPacket(
      contractPacket,
      contractTransaction,
      drive.driveApi.getApi(),
      drive.axeCore.getApi(),
    );

    await isDriveSynced(drive.driveApi.getApi());

    // Create first user object
    app.setUserId(user.getId());

    const firstUserDocument = app.document.create('profile', {
      firstName: 'William',
      email: 'w.birkin@umbrella.co',
    });

    firstUserDocument.removeMetadata();

    const firstUserPacket = app.packet.create([firstUserDocument]);
    const firstUserTransaction = createStateTransition(
      user,
      firstUserPacket,
      contractTsId,
    );

    const firstUserTsId = await sendSTPacket(
      firstUserPacket,
      firstUserTransaction,
      drive.driveApi.getApi(),
      drive.axeCore.getApi(),
    );

    await isDriveSynced(drive.driveApi.getApi());

    // Create second user object
    const secondUserDocument = app.document.create('profile', {
      firstName: 'Annette',
      email: 'a.birkin@umbrella.co',
    });

    secondUserDocument.removeMetadata();

    const secondUserPacket = app.packet.create([secondUserDocument]);
    const secondUserTransaction = createStateTransition(
      user,
      secondUserPacket,
      firstUserTsId,
    );

    const secondUserTsId = await sendSTPacket(
      secondUserPacket,
      secondUserTransaction,
      drive.driveApi.getApi(),
      drive.axeCore.getApi(),
    );

    await isDriveSynced(drive.driveApi.getApi());

    // Create third user object violating unique indices
    const thirdUserDocument = app.document.create('profile', {
      firstName: 'Leon',
      email: 'a.birkin@umbrella.co',
    });

    thirdUserDocument.removeMetadata();

    const thirdUserPacket = app.packet.create([thirdUserDocument]);
    const thirdUserTransaction = createStateTransition(
      user,
      thirdUserPacket,
      secondUserTsId,
    );

    try {
      await sendSTPacket(
        thirdUserPacket,
        thirdUserTransaction,
        drive.driveApi.getApi(),
        drive.axeCore.getApi(),
      );

      expect.fail('Duplicate object was successfully sent');
    } catch (e) {
      const error = e.originalError;
      expect(error.data[0].name).to.equal('DuplicateDocumentError');
      expect(error.data[0].document).to.deep.equal(thirdUserDocument.toJSON());
      expect(error.data[0].indexDefinition).to.deep.equal({
        unique: true,
        properties: [
          { $userId: 'asc' },
          { email: 'asc' },
        ],
      });
    }
  });

  after(async () => {
    await drive.remove();
  });
});
