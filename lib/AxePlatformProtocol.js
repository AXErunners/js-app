const Ajv = require('ajv');

const JsonSchemaValidator = require('./validation/JsonSchemaValidator');

const DPContractFacade = require('./contract/DPContractFacade');
const DPObjectFacade = require('./object/DPObjectFacade');
const STPacketFacade = require('./stPacket/STPacketFacade');
const STPacketHeaderFacade = require('./stPacketHeader/STPacketHeaderFacade');

/**
 * @classdesc DataProvider interface definition
 *
 * @async
 * @name DataProvider
 * @class
 */

/**
 * Fetch DP Contract by ID
 *
 * @async
 * @method
 * @name DataProvider#fetchDPContract
 * @param {string} id
 * @returns {Promise<DPContract|null>}
 */

/**
 * Fetch DP Objects by contract ID and type
 *
 * @async
 * @method
 * @name DataProvider#fetchDPObjects
 * @param {string} dpContractId
 * @param {string} type
 * @param {{ where: Object }} [options]
 * @returns {Promise<DPObject[]>}
 */

/**
 * Fetch transaction by ID
 *
 * @async
 * @method
 * @name DataProvider#fetchTransaction
 * @param {string} id
 * @returns {Promise<{ confirmations: number }|null>}
 */

/**
 * @class AxePlatformProtocol
 */
class AxePlatformProtocol {
  /**
   * @param {string} [options.userId]
   * @param {DPContract} [options.dpContract]
   * @param {DataProvider} [options.dataProvider]
   */
  constructor(options = {}) {
    this.userId = options.userId;
    this.dpContract = options.dpContract;
    this.dataProvider = options.dataProvider;

    const validator = new JsonSchemaValidator(new Ajv());

    this.initializeFacades(validator);
  }

  /**
   * @private
   * @param {JsonSchemaValidator} validator
   */
  initializeFacades(validator) {
    this.contract = new DPContractFacade(validator);

    this.object = new DPObjectFacade(this, validator);

    this.packet = new STPacketFacade(this, validator);

    this.packetHeader = new STPacketHeaderFacade(validator);
  }

  /**
   * Set User ID
   *
   * @param {string} userId
   * @return {AxePlatformProtocol}
   */
  setUserId(userId) {
    this.userId = userId;

    return this;
  }

  /**
   * Get User ID
   *
   * @return {string}
   */
  getUserId() {
    return this.userId;
  }

  /**
   * Set DP Contract
   *
   * @param {DPContract} dpContract
   * @return {AxePlatformProtocol}
   */
  setDPContract(dpContract) {
    this.dpContract = dpContract;

    return this;
  }

  /**
   * Get DP Contract
   *
   * @return {DPContract}
   */
  getDPContract() {
    return this.dpContract;
  }

  /**
   * Set Data Provider
   *
   * @param {DataProvider} dataProvider
   * @return {AxePlatformProtocol}
   */
  setDataProvider(dataProvider) {
    this.dataProvider = dataProvider;

    return this;
  }

  /**
   * Get Data Provider
   *
   * @return {DataProvider}
   */
  getDataProvider() {
    return this.dataProvider;
  }
}

module.exports = AxePlatformProtocol;
