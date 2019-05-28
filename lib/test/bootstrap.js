const dotenv = require('dotenv');
const { expect, use } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');

const DriveApiOptions = require('@axerunners/dp-services-ctl/lib/services/driveApi/DriveApiOptions');
const DriveSyncOptions = require('@axerunners/dp-services-ctl/lib/services/driveSync/DriveSyncOptions');
const AxeCoreOptions = require('@axerunners/dp-services-ctl/lib/services/axeCore/AxeCoreOptions');

use(sinonChai);
use(chaiAsPromised);
use(dirtyChai);

dotenv.config();

if (process.env.SERVICE_IMAGE_DRIVE) {
  DriveApiOptions.setDefaultCustomOptions({
    container: {
      image: process.env.SERVICE_IMAGE_DRIVE,
      volumes: [
        `${process.cwd()}:/node_modules/@axerunners/app:ro`,
        `${process.cwd()}:/usr/src/app/node_modules/@axerunners/app:ro`,
      ],
    },
  });

  DriveSyncOptions.setDefaultCustomOptions({
    container: {
      image: process.env.SERVICE_IMAGE_DRIVE,
    },
  });
}

if (process.env.SERVICE_IMAGE_CORE) {
  AxeCoreOptions.setDefaultCustomOptions({
    container: {
      image: process.env.SERVICE_IMAGE_CORE,
    },
  });
}

beforeEach(function beforeEach() {
  if (!this.sinonSandbox) {
    this.sinonSandbox = sinon.createSandbox();
  } else {
    this.sinonSandbox.restore();
  }
});

afterEach(function afterEach() {
  this.sinonSandbox.restore();
});

global.expect = expect;
