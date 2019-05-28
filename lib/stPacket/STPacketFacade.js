const validateSTPacketFactory = require('./validation/validateSTPacketFactory');

const validateSTPacketContractsFactory = require('./validation/validateSTPacketContractsFactory');
const validateSTPacketDocumentsFactory = require('./validation/validateSTPacketDocumentsFactory');

const findDuplicateDocuments = require('./validation/findDuplicateDocuments');
const findDuplicateDocumentsByIndices = require('./validation/findDuplicateDocumentsByIndices');
const createContract = require('../contract/createContract');

const verifySTPacketFactory = require('./verification/verifySTPacketFactory');
const verifyContract = require('./verification/verifyContract');
const verifyDocumentsFactory = require('./verification/verifyDocumentsFactory');
const verifyDocumentsUniquenessByIndicesFactory = require('./verification/verifyDocumentsUniquenessByIndicesFactory');
const fetchDocumentsByDocumentsFactory = require('./verification/fetchDocumentsByDocumentsFactory');

const STPacketFactory = require('./STPacketFactory');

const MissingOptionError = require('../errors/MissingOptionError');

class STPacketFacade {
  /**
   * @param {AxePlatformProtocol} app
   * @param {JsonSchemaValidator} validator
   */
  constructor(app, validator) {
    this.app = app;

    const validateSTPacketContracts = validateSTPacketContractsFactory(
      app.contract.validateContract,
    );

    const validateSTPacketDocuments = validateSTPacketDocumentsFactory(
      app.document.validateDocument,
      findDuplicateDocuments,
      findDuplicateDocumentsByIndices,
    );

    this.validateSTPacket = validateSTPacketFactory(
      validator,
      validateSTPacketContracts,
      validateSTPacketDocuments,
    );

    this.factory = new STPacketFactory(
      app.getDataProvider(),
      this.validateSTPacket,
      createContract,
    );
  }

  /**
   * Create ST Packet
   *
   * @param {Contract|Array} items
   * @return {STPacket}
   */
  create(items) {
    const contract = this.app.getContract();

    if (!contract) {
      throw new MissingOptionError(
        'contract',
        'Can\'t create ST Packet because Contract is not set, use setContract method',
      );
    }

    return this.factory.create(contract.getId(), items);
  }

  /**
   *
   * @param {RawSTPacket} rawSTPacket
   * @param {Object} options
   * @param {boolean} [options.skipValidation=false]
   * @return {Promise<STPacket>}
   */
  async createFromObject(rawSTPacket, options = { skipValidation: false }) {
    return this.getFactory().createFromObject(rawSTPacket, options);
  }

  /**
   * Unserialize ST Packet
   *
   * @param {Buffer|string} payload
   * @param {Object} options
   * @param {boolean} [options.skipValidation=false]
   * @return {Promise<STPacket>}
   */
  async createFromSerialized(payload, options = { skipValidation: false }) {
    return this.getFactory().createFromSerialized(payload, options);
  }

  /**
   * Validate ST Packet
   *
   * @param {STPacket|RawSTPacket} stPacket
   * @return {ValidationResult}
   */
  validate(stPacket) {
    const contract = this.app.getContract();

    if (!contract) {
      throw new MissingOptionError(
        'contract',
        'Can\'t validate ST Packet because Contract is not set, use setContract method',
      );
    }

    return this.validateSTPacket(stPacket, contract);
  }

  /**
   * @param {STPacket} stPacket
   * @param {Transaction} stateTransition
   * @return {Promise<ValidationResult>}
   */
  async verify(stPacket, stateTransition) {
    if (!this.app.getDataProvider()) {
      throw new MissingOptionError(
        'dataProvider',
        'Can\'t verify ST Packer because Data Provider is not set, use setDataProvider method',
      );
    }

    const verifySTPacket = this.createVerifySTPacket();

    return verifySTPacket(stPacket, stateTransition);
  }

  /**
   * @private
   * @return {verifySTPacket}
   */
  createVerifySTPacket() {
    const fetchDocumentsByDocuments = fetchDocumentsByDocumentsFactory(
      this.app.getDataProvider(),
    );

    const verifyDocumentsUniquenessByIndices = verifyDocumentsUniquenessByIndicesFactory(
      fetchDocumentsByDocuments,
      this.app.getDataProvider(),
    );

    const verifyDocuments = verifyDocumentsFactory(
      fetchDocumentsByDocuments,
      verifyDocumentsUniquenessByIndices,
    );

    return verifySTPacketFactory(
      verifyContract,
      verifyDocuments,
      this.app.getDataProvider(),
    );
  }

  /**
   * @private
   * @return {STPacketFactory}
   */
  getFactory() {
    if (!this.app.getDataProvider()) {
      throw new MissingOptionError(
        'dataProvider',
        'Can\'t create ST Packer because Data Provider is not set, use setDataProvider method',
      );
    }

    this.factory.setDataProvider(this.app.getDataProvider());

    return this.factory;
  }
}

module.exports = STPacketFacade;
