const enrichDPContractWithBaseDPObject = require('./enrichDPContractWithBaseDPObject');
const validateDPObjectFactory = require('./validateDPObjectFactory');

const DPObjectFactory = require('./DPObjectFactory');

const MissingOptionError = require('../errors/MissingOptionError');

class DPObjectFacade {
  /**
   *
   * @param {AxePlatformProtocol} app
   * @param {JsonSchemaValidator} validator
   */
  constructor(app, validator) {
    this.app = app;

    this.validateDPObject = validateDPObjectFactory(
      validator,
      enrichDPContractWithBaseDPObject,
    );

    this.factory = new DPObjectFactory(
      app.getUserId(),
      app.getDPContract(),
      this.validateDPObject,
    );
  }

  /**
   * Create DPObject
   *
   * @param {string} type
   * @param {Object} [data]
   * @return {DPObject}
   */
  create(type, data = {}) {
    return this.getFactory().create(type, data);
  }

  /**
   * Create DPObject from plain object
   *
   * @param {Object} rawDPObject
   * @param {Object} options
   * @param {boolean} [options.skipValidation=false]
   * @return {DPObject}
   */
  createFromObject(rawDPObject, options = { skipValidation: false }) {
    return this.getFactory().createFromObject(rawDPObject, options);
  }

  /**
   * Create DPObject from string/buffer
   *
   * @param {Buffer|string} payload
   * @param {Object} options
   * @param {boolean} [options.skipValidation=false]
   * @return {DPObject}
   */
  createFromSerialized(payload, options = { skipValidation: false }) {
    return this.getFactory().createFromSerialized(payload, options);
  }

  /**
   *
   * @param {Object|DPObject} dpObject
   * @return {ValidationResult}
   */
  validate(dpObject) {
    return this.validateDPObject(dpObject, this.app.getDPContract());
  }

  /**
   * @private
   * @return {DPObjectFactory}
   */
  getFactory() {
    if (!this.app.getUserId()) {
      throw new MissingOptionError(
        'userId',
        'Can\'t create packet because User ID is not set, use setUserId method',
      );
    }

    if (!this.app.getDPContract()) {
      throw new MissingOptionError(
        'dpContract',
        'Can\'t create DP Object because DP Contract is not set, use setDPContract method',
      );
    }

    this.factory.setUserId(this.app.getUserId());
    this.factory.setDPContract(this.app.getDPContract());

    return this.factory;
  }
}

module.exports = DPObjectFacade;
