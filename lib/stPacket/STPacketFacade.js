const validateSTPacketFactory = require('./validation/validateSTPacketFactory');

const validateSTPacketDPContractsFactory = require('./validation/validateSTPacketDPContractsFactory');
const validateSTPacketDPObjectsFactory = require('./validation/validateSTPacketDPObjectsFactory');

const findDuplicatedDPObjects = require('./validation/findDuplicatedDPObjects');
const findDuplicateDPObjectsByIndices = require('./validation/findDuplicateDPObjectsByIndices');
const createDPContract = require('../contract/createDPContract');

const verifySTPacketFactory = require('./verification/verifySTPacketFactory');
const verifyDPContract = require('./verification/verifyDPContract');
const verifyDPObjectsFactory = require('./verification/verifyDPObjectsFactory');
const verifyDPObjectsUniquenessByIndicesFactory = require('./verification/verifyDPObjectsUniquenessByIndicesFactory');
const fetchDPObjectsByObjectsFactory = require('./verification/fetchDPObjectsByObjectsFactory');

const STPacketFactory = require('./STPacketFactory');

const MissingOptionError = require('../errors/MissingOptionError');

class STPacketFacade {
  /**
   * @param {AxePlatformProtocol} app
   * @param {JsonSchemaValidator} validator
   */
  constructor(app, validator) {
    this.app = app;

    const validateSTPacketDPContracts = validateSTPacketDPContractsFactory(
      app.contract.validateDPContract,
    );

    const validateSTPacketDPObjects = validateSTPacketDPObjectsFactory(
      app.object.validateDPObject,
      findDuplicatedDPObjects,
      findDuplicateDPObjectsByIndices,
    );

    this.validateSTPacket = validateSTPacketFactory(
      validator,
      validateSTPacketDPContracts,
      validateSTPacketDPObjects,
    );

    this.factory = new STPacketFactory(
      app.getDataProvider(),
      this.validateSTPacket,
      createDPContract,
    );
  }

  /**
   * Create ST Packet
   *
   * @param {DPContract|Array} items
   * @return {STPacket}
   */
  create(items) {
    const dpContract = this.app.getDPContract();

    if (!dpContract) {
      throw new MissingOptionError(
        'dpContract',
        'Can\'t create ST Packet because DP Contract is not set, use setDPContract method',
      );
    }

    return this.factory.create(dpContract.getId(), items);
  }

  /**
   *
   * @param {Object} rawSTPacket
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
   *
   * @param {STPacket|Object} stPacket
   * @return {ValidationResult}
   */
  validate(stPacket) {
    const dpContract = this.app.getDPContract();

    if (!dpContract) {
      throw new MissingOptionError(
        'dpContract',
        'Can\'t validate ST Packet because DP Contract is not set, use setDPContract method',
      );
    }

    return this.validateSTPacket(stPacket, dpContract);
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
    const fetchDPObjectsByObjects = fetchDPObjectsByObjectsFactory(
      this.app.getDataProvider(),
    );

    const verifyDPObjectsUniquenessByIndices = verifyDPObjectsUniquenessByIndicesFactory(
      fetchDPObjectsByObjects,
      this.app.getDataProvider(),
    );

    const verifyDPObjects = verifyDPObjectsFactory(
      fetchDPObjectsByObjects,
      verifyDPObjectsUniquenessByIndices,
    );

    return verifySTPacketFactory(
      verifyDPContract,
      verifyDPObjects,
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
