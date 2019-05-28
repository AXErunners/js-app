const AxePlatformProtocol = require('../../../lib/AxePlatformProtocol');

const Contract = require('../../../lib/contract/Contract');

const ValidationResult = require('../../../lib/validation/ValidationResult');

const getContractFixture = require('../../../lib/test/fixtures/getContractFixture');

describe('ContractFacade', () => {
  let app;
  let contract;

  beforeEach(() => {
    app = new AxePlatformProtocol();

    contract = getContractFixture();
  });

  describe('create', () => {
    it('should create Contract', () => {
      const result = app.contract.create(
        contract.getName(),
        contract.getDocuments(),
      );

      expect(result).to.be.an.instanceOf(Contract);

      expect(result.getName()).to.equal(contract.getName());
      expect(result.getDocuments()).to.equal(contract.getDocuments());
    });
  });

  describe('createFromObject', () => {
    it('should create Contract from plain object', () => {
      const result = app.contract.createFromObject(contract.toJSON());

      expect(result).to.be.an.instanceOf(Contract);

      expect(result.toJSON()).to.deep.equal(contract.toJSON());
    });
  });

  describe('createFromSerialized', () => {
    it('should create Contract from string', () => {
      const result = app.contract.createFromSerialized(contract.serialize());

      expect(result).to.be.an.instanceOf(Contract);

      expect(result.toJSON()).to.deep.equal(contract.toJSON());
    });
  });

  describe('validate', () => {
    it('should validate Contract', () => {
      const result = app.contract.validate(contract.toJSON());

      expect(result).to.be.an.instanceOf(ValidationResult);
    });
  });
});
