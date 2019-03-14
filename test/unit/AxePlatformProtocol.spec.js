const AxePlatformProtocol = require('../../lib/AxePlatformProtocol');

const getDPContractFixture = require('../../lib/test/fixtures/getDPContractFixture');

const createDataProviderMock = require('../../lib/test/mocks/createDataProviderMock');

describe('AxePlatformProtocol', () => {
  let app;
  let userId;
  let dpContract;
  let dataProvider;

  beforeEach(function beforeEach() {
    userId = '6b74011f5d2ad1a8d45b71b9702f54205ce75253593c3cfbba3fdadeca278288';
    dpContract = getDPContractFixture();
    dataProvider = createDataProviderMock(this.sinonSandbox);

    app = new AxePlatformProtocol();
  });

  describe('setUserId', () => {
    it('should set User ID', () => {
      const result = app.setUserId(userId);

      expect(result).to.be.an.instanceOf(AxePlatformProtocol);

      expect(app.userId).to.equal(userId);
    });
  });

  describe('getUserId', () => {
    it('should return User ID', () => {
      app.userId = userId;

      const result = app.getUserId();

      expect(result).to.equal(userId);
    });
  });

  describe('setDPContract', () => {
    it('should set User ID', () => {
      const result = app.setDPContract(dpContract);

      expect(result).to.be.an.instanceOf(AxePlatformProtocol);

      expect(app.dpContract).to.equal(dpContract);
    });
  });

  describe('getDPContract', () => {
    it('should return DP Contract', () => {
      app.dpContract = dpContract;

      const result = app.getDPContract();

      expect(result).to.equal(dpContract);
    });
  });

  describe('setDataProvider', () => {
    it('should set Data Provider', () => {
      const result = app.setDataProvider(dataProvider);

      expect(result).to.be.an.instanceOf(AxePlatformProtocol);

      expect(app.dataProvider).to.equal(dataProvider);
    });
  });

  describe('getDataProvider', () => {
    it('should return Data Provider', () => {
      app.dataProvider = dataProvider;

      const result = app.getDataProvider();

      expect(result).to.equal(dataProvider);
    });
  });
});
