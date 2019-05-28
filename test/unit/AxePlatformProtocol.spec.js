const AxePlatformProtocol = require('../../lib/AxePlatformProtocol');

const getContractFixture = require('../../lib/test/fixtures/getContractFixture');

const createDataProviderMock = require('../../lib/test/mocks/createDataProviderMock');

describe('AxePlatformProtocol', () => {
  let app;
  let userId;
  let contract;
  let dataProvider;

  beforeEach(function beforeEach() {
    userId = '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288';
    contract = getContractFixture();
    dataProvider = createDataProviderMock(this.sinonSandbox);

    app = new AxePlatformProtocol();
  });

  describe('setUserId', () => {
    it('should set User ID', () => {
      const result = app.setUserId(userId);

      expect(result).to.be.an.instanceOf(AxePlatformProtocol);

      expect(app.getUserId()).to.equal(userId);
    });
  });

  describe('getUserId', () => {
    it('should return User ID', () => {
      app.setUserId(userId);

      const result = app.getUserId();

      expect(result).to.equal(userId);
    });
  });

  describe('setContract', () => {
    it('should set User ID', () => {
      const result = app.setContract(contract);

      expect(result).to.be.an.instanceOf(AxePlatformProtocol);

      expect(app.getContract()).to.equal(contract);
    });
  });

  describe('getContract', () => {
    it('should return Contract', () => {
      app.setContract(contract);

      const result = app.getContract();

      expect(result).to.equal(contract);
    });
  });

  describe('setDataProvider', () => {
    it('should set Data Provider', () => {
      const result = app.setDataProvider(dataProvider);

      expect(result).to.be.an.instanceOf(AxePlatformProtocol);

      expect(app.getDataProvider()).to.equal(dataProvider);
    });
  });

  describe('getDataProvider', () => {
    it('should return Data Provider', () => {
      app.setDataProvider(dataProvider);

      const result = app.getDataProvider();

      expect(result).to.equal(dataProvider);
    });
  });
});
