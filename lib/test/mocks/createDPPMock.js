/**
 * @param {Sandbox} sinonSandbox
 *
 * @returns {AxePlatformProtocol}
 */
module.exports = function createAPPMock(sinonSandbox) {
  const contract = {
    create: sinonSandbox.stub(),
    createFromObject: sinonSandbox.stub(),
    createFromSerialized: sinonSandbox.stub(),
    validate: sinonSandbox.stub(),
  };

  const document = {
    create: sinonSandbox.stub(),
    createFromObject: sinonSandbox.stub(),
    createFromSerialized: sinonSandbox.stub(),
    validate: sinonSandbox.stub(),
  };

  const packet = {
    create: sinonSandbox.stub(),
    createFromObject: sinonSandbox.stub(),
    createFromSerialized: sinonSandbox.stub(),
    validate: sinonSandbox.stub(),
    verify: sinonSandbox.stub(),
  };

  const packetHeader = {
    create: sinonSandbox.stub(),
    createFromObject: sinonSandbox.stub(),
    createFromSerialized: sinonSandbox.stub(),
    validate: sinonSandbox.stub(),
  };

  return {
    contract,
    document,
    packet,
    packetHeader,
    getUserId: sinonSandbox.stub(),
    setUserId: sinonSandbox.stub(),
    getContract: sinonSandbox.stub(),
    setContract: sinonSandbox.stub(),
    getDataProvider: sinonSandbox.stub(),
    setDataProvider: sinonSandbox.stub(),
  };
};
