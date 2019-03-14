const AxePlatformProtocol = require('../../../lib/AxePlatformProtocol');

const DPContract = require('../../../lib/contract/DPContract');

const ValidationResult = require('../../../lib/validation/ValidationResult');

const getDPContractFixture = require('../../../lib/test/fixtures/getDPContractFixture');

describe('DPContractFacade', () => {
  let app;
  let dpContract;

  beforeEach(() => {
    app = new AxePlatformProtocol();

    dpContract = getDPContractFixture();
  });

  describe('create', () => {
    it('should create DP Contract', () => {
      const result = app.contract.create(
        dpContract.getName(),
        dpContract.getDPObjectsDefinition(),
      );

      expect(result).to.be.an.instanceOf(DPContract);

      expect(result.getName()).to.equal(dpContract.getName());
      expect(result.getDPObjectsDefinition()).to.equal(dpContract.getDPObjectsDefinition());
    });
  });

  describe('createFromObject', () => {
    it('should create DP Contract from plain object', () => {
      const result = app.contract.createFromObject(dpContract.toJSON());

      expect(result).to.be.an.instanceOf(DPContract);

      expect(result.toJSON()).to.deep.equal(dpContract.toJSON());
    });
  });

  describe('createFromSerialized', () => {
    it('should create DP Contract from string', () => {
      const result = app.contract.createFromSerialized(dpContract.serialize());

      expect(result).to.be.an.instanceOf(DPContract);

      expect(result.toJSON()).to.deep.equal(dpContract.toJSON());
    });
  });

  describe('validate', () => {
    it('should validate DP Contract', () => {
      const result = app.contract.validate(dpContract.toJSON());

      expect(result).to.be.an.instanceOf(ValidationResult);
    });
  });
});
