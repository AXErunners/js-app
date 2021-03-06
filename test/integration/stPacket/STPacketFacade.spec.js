const { Transaction } = require('@axerunners/axecore-lib');

const AxePlatformProtocol = require('../../../lib/AxePlatformProtocol');

const STPacket = require('../../../lib/stPacket/STPacket');

const ValidationResult = require('../../../lib/validation/ValidationResult');

const getSTPacketFixture = require('../../../lib/test/fixtures/getSTPacketFixture');
const getContractFixture = require('../../../lib/test/fixtures/getContractFixture');

const createDataProviderMock = require('../../../lib/test/mocks/createDataProviderMock');

const MissingOptionError = require('../../../lib/errors/MissingOptionError');

describe('STPacketFacade', () => {
  let app;
  let stPacket;
  let contract;
  let dataProviderMock;

  beforeEach(function beforeEach() {
    contract = getContractFixture();

    dataProviderMock = createDataProviderMock(this.sinonSandbox);

    dataProviderMock.fetchContract.resolves(contract);
    dataProviderMock.fetchTransaction.resolves(null);
    dataProviderMock.fetchDocuments.resolves([]);

    stPacket = getSTPacketFixture();

    app = new AxePlatformProtocol({
      userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      contract,
      dataProvider: dataProviderMock,
    });
  });

  describe('create', () => {
    it('should create ST Packet', () => {
      const result = app.packet.create(stPacket.getDocuments());

      expect(result).to.be.an.instanceOf(STPacket);

      expect(result.getContractId()).to.equal(stPacket.getContractId());
      expect(result.getDocuments()).to.deep.equal(stPacket.getDocuments());
    });

    it('should throw an error if Contract is not defined', () => {
      app = new AxePlatformProtocol();

      let error;
      try {
        app.packet.create(stPacket.documents);
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('contract');
    });
  });

  describe('createFromObject', () => {
    it('should create ST Packet from plain object', async () => {
      const result = await app.packet.createFromObject(stPacket.toJSON());

      expect(result).to.be.an.instanceOf(STPacket);

      expect(result.toJSON()).to.deep.equal(stPacket.toJSON());
    });

    it('should throw an error if DataProvider is not defined', async () => {
      app = new AxePlatformProtocol();

      let error;
      try {
        await app.packet.createFromObject(stPacket.toJSON());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('dataProvider');
    });
  });

  describe('createFromSerialized', () => {
    it('should create ST Packet from string', async () => {
      const result = await app.packet.createFromSerialized(stPacket.serialize());

      expect(result).to.be.an.instanceOf(STPacket);

      expect(result.toJSON()).to.deep.equal(stPacket.toJSON());
    });

    it('should throw an error if DataProvider is not defined', async () => {
      app = new AxePlatformProtocol();

      let error;
      try {
        await app.packet.createFromSerialized(stPacket.serialize());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('dataProvider');
    });
  });

  describe('validate', () => {
    it('should validate ST Packet', () => {
      const result = app.packet.validate(stPacket);

      expect(result).to.be.an.instanceOf(ValidationResult);
    });

    it('should throw an error if Contract is not defined', () => {
      app = new AxePlatformProtocol();

      let error;
      try {
        app.packet.validate(stPacket);
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('contract');
    });
  });

  describe('verify', () => {
    let stateTransition;

    beforeEach(() => {
      const payload = new Transaction.Payload.SubTxTransitionPayload()
        .setRegTxId('6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288')
        .setHashPrevSubTx('6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288')
        .setHashSTPacket(stPacket.hash())
        .setCreditFee(1001);

      stateTransition = new Transaction({
        type: Transaction.TYPES.TRANSACTION_SUBTX_TRANSITION,
        extraPayload: payload.toString(),
      });
    });

    it('should verify ST Packet', async () => {
      const result = await app.packet.verify(stPacket, stateTransition);

      expect(result).to.be.an.instanceOf(ValidationResult);
    });

    it('should throw an error if DataProvider is not defined', async () => {
      app = new AxePlatformProtocol();

      let error;
      try {
        await app.packet.verify(stPacket, stateTransition);
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('dataProvider');
    });
  });
});
