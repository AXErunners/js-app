const enrichContractWithBaseDocument = require('./enrichContractWithBaseDocument');
const validateDocumentFactory = require('./validateDocumentFactory');

const DocumentFactory = require('./DocumentFactory');

const MissingOptionError = require('../errors/MissingOptionError');

class DocumentFacade {
  /**
   *
   * @param {AxePlatformProtocol} app
   * @param {JsonSchemaValidator} validator
   */
  constructor(app, validator) {
    this.app = app;

    this.validateDocument = validateDocumentFactory(
      validator,
      enrichContractWithBaseDocument,
    );

    this.factory = new DocumentFactory(
      app.getUserId(),
      app.getContract(),
      this.validateDocument,
    );
  }

  /**
   * Create Document
   *
   * @param {string} type
   * @param {Object} [data]
   * @return {Document}
   */
  create(type, data = {}) {
    return this.getFactory().create(type, data);
  }

  /**
   * Create Document from plain object
   *
   * @param {RawDocument} rawDocument
   * @param {Object} options
   * @param {boolean} [options.skipValidation=false]
   * @return {Document}
   */
  createFromObject(rawDocument, options = { skipValidation: false }) {
    return this.getFactory().createFromObject(rawDocument, options);
  }

  /**
   * Create Document from string/buffer
   *
   * @param {Buffer|string} payload
   * @param {Object} options
   * @param {boolean} [options.skipValidation=false]
   * @return {Document}
   */
  createFromSerialized(payload, options = { skipValidation: false }) {
    return this.getFactory().createFromSerialized(payload, options);
  }

  /**
   * Validate document
   *
   * @param {Document|RawDocument} document
   * @return {ValidationResult}
   */
  validate(document) {
    return this.validateDocument(document, this.app.getContract());
  }

  /**
   * @private
   * @return {DocumentFactory}
   */
  getFactory() {
    if (!this.app.getUserId()) {
      throw new MissingOptionError(
        'userId',
        'Can\'t create packet because User ID is not set, use setUserId method',
      );
    }

    if (!this.app.getContract()) {
      throw new MissingOptionError(
        'contract',
        'Can\'t create Document because Contract is not set, use setContract method',
      );
    }

    this.factory.setUserId(this.app.getUserId());
    this.factory.setContract(this.app.getContract());

    return this.factory;
  }
}

module.exports = DocumentFacade;
