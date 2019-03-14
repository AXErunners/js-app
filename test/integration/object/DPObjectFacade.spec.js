const AxePlatformProtocol = require('../../../lib/AxePlatformProtocol');

const DPObject = require('../../../lib/object/DPObject');

const ValidationResult = require('../../../lib/validation/ValidationResult');

const getDPObjectsFixture = require('../../../lib/test/fixtures/getDPObjectsFixture');
const getDPContractFixture = require('../../../lib/test/fixtures/getDPContractFixture');

const MissingOptionError = require('../../../lib/errors/MissingOptionError');

describe('DPObjectFacade', () => {
  let app;
  let dpObject;
  let dpContract;

  beforeEach(() => {
    dpContract = getDPContractFixture();

    app = new AxePlatformProtocol({
      userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      dpContract,
    });

    ([dpObject] = getDPObjectsFixture());
  });

  describe('create', () => {
    it('should create DP Object', () => {
      const result = app.object.create(
        dpObject.getType(),
        dpObject.getData(),
      );

      expect(result).to.be.an.instanceOf(DPObject);

      expect(result.getType()).to.equal(dpObject.getType());
      expect(result.getData()).to.deep.equal(dpObject.getData());
    });

    it('should throw an error if User ID is not defined', () => {
      app = new AxePlatformProtocol({
        dpContract,
      });

      let error;
      try {
        app.object.create(
          dpObject.getType(),
          dpObject.getData(),
        );
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('userId');
    });

    it('should throw an error if DP Contract is not defined', () => {
      app = new AxePlatformProtocol({
        userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      });

      let error;
      try {
        app.object.create(
          dpObject.getType(),
          dpObject.getData(),
        );
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('dpContract');
    });
  });

  describe('createFromObject', () => {
    it('should create DP Object from plain object', () => {
      const result = app.object.createFromObject(dpObject.toJSON());

      expect(result).to.be.an.instanceOf(DPObject);

      expect(result.toJSON()).to.deep.equal(dpObject.toJSON());
    });

    it('should throw an error if User ID is not defined', () => {
      app = new AxePlatformProtocol({
        dpContract,
      });

      let error;
      try {
        app.object.createFromObject(dpObject.toJSON());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('userId');
    });

    it('should throw an error if DP Contract is not defined', () => {
      app = new AxePlatformProtocol({
        userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      });

      let error;
      try {
        app.object.createFromObject(dpObject.toJSON());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('dpContract');
    });
  });

  describe('createFromSerialized', () => {
    it('should create DP Object from string', () => {
      const result = app.object.createFromSerialized(dpObject.serialize());

      expect(result).to.be.an.instanceOf(DPObject);

      expect(result.toJSON()).to.deep.equal(dpObject.toJSON());
    });

    it('should throw an error if User ID is not defined', () => {
      app = new AxePlatformProtocol({
        dpContract,
      });

      let error;
      try {
        app.object.createFromSerialized(dpObject.serialize());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('userId');
    });

    it('should throw an error if DP Contract is not defined', () => {
      app = new AxePlatformProtocol({
        userId: '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288',
      });

      let error;
      try {
        app.object.createFromSerialized(dpObject.serialize());
      } catch (e) {
        error = e;
      }

      expect(error).to.be.an.instanceOf(MissingOptionError);
      expect(error.getOptionName()).to.equal('dpContract');
    });
  });

  describe('validate', () => {
    it('should validate DP Object', () => {
      const result = app.object.validate(dpObject.toJSON());

      expect(result).to.be.an.instanceOf(ValidationResult);
    });
  });
});
