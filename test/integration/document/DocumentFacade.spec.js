const AxePlatformProtocol = require('../../../lib/AxePlatformProtocol');

const Document = require('../../../lib/document/Document');

const ValidationResult = require('../../../lib/validation/ValidationResult');

const getDocumentsFixture = require('../../../lib/test/fixtures/getDocumentsFixture');
const getContractFixture = require('../../../lib/test/fixtures/getContractFixture');

const MissingOptionError = require('../../../lib/errors/MissingOptionError');

describe('DocumentFacade', () => {
  let app;
  let document;
  let contract;

  beforeEach(() => {
    contract = getContractFixture();

    app = new AxePlatformProtocol({
      userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      contract,
    });

    ([document] = getDocumentsFixture());
  });

  describe('create', () => {
    it('should create Document', () => {
      const result = app.document.create(
        document.getType(),
        document.getData(),
      );

      expect(result).to.be.an.instanceOf(Document);

      expect(result.getType()).to.equal(document.getType());
      expect(result.getData()).to.deep.equal(document.getData());
    });

    it('should throw an error if User ID is not defined', () => {
      app = new AxePlatformProtocol({
        contract,
      });

      let error;
      try {
        app.document.create(
          document.getType(),
          document.getData(),
        );
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('userId');
    });

    it('should throw an error if Contract is not defined', () => {
      app = new AxePlatformProtocol({
        userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      });

      let error;
      try {
        app.document.create(
          document.getType(),
          document.getData(),
        );
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('contract');
    });
  });

  describe('createFromObject', () => {
    it('should create Document from plain object', () => {
      const result = app.document.createFromObject(document.toJSON());

      expect(result).to.be.an.instanceOf(Document);

      expect(result.toJSON()).to.deep.equal(document.toJSON());
    });

    it('should throw an error if User ID is not defined', () => {
      app = new AxePlatformProtocol({
        contract,
      });

      let error;
      try {
        app.document.createFromObject(document.toJSON());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('userId');
    });

    it('should throw an error if Contract is not defined', () => {
      app = new AxePlatformProtocol({
        userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      });

      let error;
      try {
        app.document.createFromObject(document.toJSON());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('contract');
    });
  });

  describe('createFromSerialized', () => {
    it('should create Document from string', () => {
      const result = app.document.createFromSerialized(document.serialize());

      expect(result).to.be.an.instanceOf(Document);

      expect(result.toJSON()).to.deep.equal(document.toJSON());
    });

    it('should throw an error if User ID is not defined', () => {
      app = new AxePlatformProtocol({
        contract,
      });

      let error;
      try {
        app.document.createFromSerialized(document.serialize());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('userId');
    });

    it('should throw an error if Contract is not defined', () => {
      app = new AxePlatformProtocol({
        userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      });

      let error;
      try {
        app.document.createFromSerialized(document.serialize());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('contract');
    });
  });

  describe('validate', () => {
    it('should validate Document', () => {
      const result = app.document.validate(document.toJSON());

      expect(result).to.be.an.instanceOf(ValidationResult);
    });
  });
});
