const { PrivateKey, Networks, Address } = require('@axerunners/axecore-lib');

module.exports = {
  generate() {
    const privateKey = new PrivateKey();
    const publicKey = privateKey.toPublicKey();
    return publicKey.toAddress(Networks.testnet).toString();
  },
  validate(string) {
    return Address.isValid(string, Networks.testnet, Address.PayToPublicKeyHash);
  },
};
