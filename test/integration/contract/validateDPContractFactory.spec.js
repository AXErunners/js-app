const Ajv = require('ajv');

const JsonSchemaValidator = require('../../../lib/validation/JsonSchemaValidator');

const ValidationResult = require('../../../lib/validation/ValidationResult');

const validateDPContractFactory = require('../../../lib/contract/validateDPContractFactory');

const getDPContractFixture = require('../../../lib/test/fixtures/getDPContractFixture');

const { expectJsonSchemaError, expectValidationError } = require('../../../lib/test/expect/expectError');

const DuplicateIndexError = require('../../../lib/errors/DuplicateIndexError');
const UniqueIndexMustHaveUserIdPrefixError = require('../../../lib/errors/UniqueIndexMustHaveUserIdPrefixError');
const UndefinedIndexPropertyError = require('../../../lib/errors/UndefinedIndexPropertyError');

describe('validateDPContractFactory', () => {
  let rawDPContract;
  let validateDPContract;

  beforeEach(() => {
    rawDPContract = getDPContractFixture().toJSON();

    const ajv = new Ajv();
    const validator = new JsonSchemaValidator(ajv);

    validateDPContract = validateDPContractFactory(validator);
  });

  describe('$schema', () => {
    it('should be present', () => {
      delete rawDPContract.$schema;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.keyword).to.equal('required');
      expect(error.params.missingProperty).to.equal('$schema');
    });

    it('should be a string', () => {
      rawDPContract.$schema = 1;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.$schema');
      expect(error.keyword).to.equal('type');
    });

    it('should be a particular url', () => {
      rawDPContract.$schema = 'wrong';

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('const');
      expect(error.dataPath).to.equal('.$schema');
    });
  });

  describe('name', () => {
    it('should be present', () => {
      delete rawDPContract.name;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.keyword).to.equal('required');
      expect(error.params.missingProperty).to.equal('name');
    });

    it('should be a string', () => {
      rawDPContract.name = 1;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.name');
      expect(error.keyword).to.equal('type');
    });

    it('should be greater or equal to 3', () => {
      rawDPContract.name = 'a'.repeat(2);

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.name');
      expect(error.keyword).to.equal('minLength');
    });

    it('should be less or equal to 24', () => {
      rawDPContract.name = 'a'.repeat(25);

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.name');
      expect(error.keyword).to.equal('maxLength');
    });

    it('should be an alphanumeric string', () => {
      rawDPContract.name = '*(*&^';

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.name');
      expect(error.keyword).to.equal('pattern');
    });
  });

  describe('version', () => {
    it('should be present', () => {
      delete rawDPContract.version;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.keyword).to.equal('required');
      expect(error.params.missingProperty).to.equal('version');
    });

    it('should be a number', () => {
      rawDPContract.version = 'wrong';

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.version');
      expect(error.keyword).to.equal('type');
    });

    it('should be an integer', () => {
      rawDPContract.version = 1.2;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.version');
      expect(error.keyword).to.equal('multipleOf');
    });

    it('should be greater or equal to one', () => {
      rawDPContract.version = 0;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.version');
      expect(error.keyword).to.equal('minimum');
    });
  });

  describe('definitions', () => {
    it('may not be present', () => {
      delete rawDPContract.definitions;

      const result = validateDPContract(rawDPContract);

      expect(result).to.be.an.instanceOf(ValidationResult);
      expect(result.isValid()).to.be.true();
    });

    it('should be an object', () => {
      rawDPContract.definitions = 1;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.definitions');
      expect(error.keyword).to.equal('type');
    });

    it('should not be empty', () => {
      rawDPContract.definitions = {};

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.definitions');
      expect(error.keyword).to.equal('minProperties');
    });

    it('should have no non-alphanumeric properties', () => {
      rawDPContract.definitions = {
        $subSchema: {},
      };

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result, 2);

      const [patternError, propertyNamesError] = result.getErrors();

      expect(patternError.dataPath).to.equal('.definitions');
      expect(patternError.keyword).to.equal('pattern');

      expect(propertyNamesError.dataPath).to.equal('.definitions');
      expect(propertyNamesError.keyword).to.equal('propertyNames');
    });

    it('should have no more than 100 properties', () => {
      rawDPContract.definitions = {};

      Array(101).fill({}).forEach((item, i) => {
        rawDPContract.definitions[i] = item;
      });

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.definitions');
      expect(error.keyword).to.equal('maxProperties');
    });
  });

  describe('dpObjectsDefinition', () => {
    it('should be present', () => {
      delete rawDPContract.dpObjectsDefinition;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.keyword).to.equal('required');
      expect(error.params.missingProperty).to.equal('dpObjectsDefinition');
    });

    it('should be an object', () => {
      rawDPContract.dpObjectsDefinition = 1;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.dpObjectsDefinition');
      expect(error.keyword).to.equal('type');
    });

    it('should not be empty', () => {
      rawDPContract.dpObjectsDefinition = {};

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.dpObjectsDefinition');
      expect(error.keyword).to.equal('minProperties');
    });

    it('should have no non-alphanumeric properties', () => {
      rawDPContract.dpObjectsDefinition['(*&^'] = rawDPContract.dpObjectsDefinition.niceObject;

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.dpObjectsDefinition');
      expect(error.keyword).to.equal('additionalProperties');
    });

    it('should have no more than 100 properties', () => {
      const niceObjectDefinition = rawDPContract.dpObjectsDefinition.niceObject;

      rawDPContract.dpObjectsDefinition = {};

      Array(101).fill(niceObjectDefinition).forEach((item, i) => {
        rawDPContract.dpObjectsDefinition[i] = item;
      });

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.dpObjectsDefinition');
      expect(error.keyword).to.equal('maxProperties');
    });

    describe('DPObject schema', () => {
      it('should not be empty', () => {
        rawDPContract.dpObjectsDefinition.niceObject.properties = {};

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'niceObject\'].properties');
        expect(error.keyword).to.equal('minProperties');
      });

      it('should have type "object" if defined', () => {
        delete rawDPContract.dpObjectsDefinition.niceObject.properties;

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'niceObject\']');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('properties');
      });

      it('should have "properties"', () => {
        delete rawDPContract.dpObjectsDefinition.niceObject.properties;

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'niceObject\']');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('properties');
      });

      it('should have no non-alphanumeric properties', () => {
        rawDPContract.dpObjectsDefinition.niceObject.properties['(*&^'] = {};

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result, 2);

        const errors = result.getErrors();

        expect(errors[0].dataPath).to.equal('.dpObjectsDefinition[\'niceObject\'].properties');
        expect(errors[0].keyword).to.equal('pattern');
        expect(errors[1].dataPath).to.equal('.dpObjectsDefinition[\'niceObject\'].properties');
        expect(errors[1].keyword).to.equal('propertyNames');
      });

      it('should have "additionalProperties" defined', () => {
        delete rawDPContract.dpObjectsDefinition.niceObject.additionalProperties;

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'niceObject\']');
        expect(error.keyword).to.equal('required');
        expect(error.params.missingProperty).to.equal('additionalProperties');
      });

      it('should have "additionalProperties" defined to false', () => {
        rawDPContract.dpObjectsDefinition.niceObject.additionalProperties = true;

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'niceObject\'].additionalProperties');
        expect(error.keyword).to.equal('const');
      });

      it('should have no more than 100 properties', () => {
        const propertyDefinition = { };

        rawDPContract.dpObjectsDefinition.niceObject.properties = {};

        Array(101).fill(propertyDefinition).forEach((item, i) => {
          rawDPContract.dpObjectsDefinition.niceObject.properties[i] = item;
        });

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'niceObject\'].properties');
        expect(error.keyword).to.equal('maxProperties');
      });
    });
  });

  describe('indices', () => {
    it('should be an array', () => {
      rawDPContract.dpObjectsDefinition.indexedObject.indices = 'definetely not an array';

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.dpObjectsDefinition[\'indexedObject\'].indices');
      expect(error.keyword).to.equal('type');
    });

    it('should have at least one item', () => {
      rawDPContract.dpObjectsDefinition.indexedObject.indices = [];

      const result = validateDPContract(rawDPContract);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.dpObjectsDefinition[\'indexedObject\'].indices');
      expect(error.keyword).to.equal('minItems');
    });

    describe('index', () => {
      it('should be an object', () => {
        rawDPContract.dpObjectsDefinition.indexedObject.indices = ['something else'];

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'indexedObject\'].indices[0]');
        expect(error.keyword).to.equal('type');
      });

      it('should have property definitions', () => {
        rawDPContract.dpObjectsDefinition.indexedObject.indices = [{}];

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'indexedObject\'].indices[0]');
        expect(error.params.missingProperty).to.equal('properties');
        expect(error.keyword).to.equal('required');
      });

      describe('property definition', () => {
        it('should have at least one property', () => {
          rawDPContract.dpObjectsDefinition.indexedObject.indices[0]
            .properties = {};

          const result = validateDPContract(rawDPContract);

          expectJsonSchemaError(result);

          const [error] = result.getErrors();

          expect(error.dataPath).to.equal(
            '.dpObjectsDefinition[\'indexedObject\'].indices[0].properties',
          );
          expect(error.keyword).to.equal('minProperties');
        });

        it('should have property values only "asc" or "desc"', () => {
          rawDPContract.dpObjectsDefinition.indexedObject.indices[0]
            .properties.firstName = 'wrong';

          const result = validateDPContract(rawDPContract);

          expectJsonSchemaError(result);

          const [error] = result.getErrors();

          expect(error.dataPath).to.equal('.dpObjectsDefinition[\'indexedObject\'].indices[0].properties[\'firstName\']');
          expect(error.keyword).to.equal('enum');
        });
      });

      it('should have "unique" flag', () => {
        rawDPContract.dpObjectsDefinition.indexedObject.indices[0].unique = undefined;

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'indexedObject\'].indices[0]');
        expect(error.params.missingProperty).to.equal('unique');
        expect(error.keyword).to.equal('required');
      });

      it('should have "unqiue" flag equal "true"', () => {
        rawDPContract.dpObjectsDefinition.indexedObject.indices[0].unique = false;

        const result = validateDPContract(rawDPContract);

        expectJsonSchemaError(result);

        const [error] = result.getErrors();

        expect(error.dataPath).to.equal('.dpObjectsDefinition[\'indexedObject\'].indices[0].unique');
        expect(error.keyword).to.equal('const');
      });
    });
  });

  it('should return invalid result if there are additional properties', () => {
    rawDPContract.additionalProperty = { };

    const result = validateDPContract(rawDPContract);

    expectJsonSchemaError(result);

    const [error] = result.getErrors();

    expect(error.dataPath).to.equal('');
    expect(error.keyword).to.equal('additionalProperties');
  });

  it('should return invalid result if there are duplicated indices', () => {
    const indexDefinition = Object.assign({},
      rawDPContract.dpObjectsDefinition.indexedObject.indices[0]);

    rawDPContract.dpObjectsDefinition.indexedObject.indices.push(indexDefinition);

    const result = validateDPContract(rawDPContract);

    expectValidationError(result, DuplicateIndexError);

    const [error] = result.getErrors();

    expect(error.getIndexDefinition()).to.deep.equal(indexDefinition);
    expect(error.getRawDPContract()).to.deep.equal(rawDPContract);
    expect(error.getDPObjectType()).to.deep.equal('indexedObject');
  });

  it('should return invalid result if indices don\'t have $userId prefix', () => {
    const indexDefinition = rawDPContract.dpObjectsDefinition.indexedObject.indices[0];

    delete indexDefinition.properties.$userId;

    const result = validateDPContract(rawDPContract);

    expectValidationError(result, UniqueIndexMustHaveUserIdPrefixError);

    const [error] = result.getErrors();

    expect(error.getIndexDefinition()).to.deep.equal(indexDefinition);
    expect(error.getRawDPContract()).to.deep.equal(rawDPContract);
    expect(error.getDPObjectType()).to.deep.equal('indexedObject');
  });

  it('should return invalid result if indices don\'t have $userId prefix as a first field', () => {
    const indexDefinition = rawDPContract.dpObjectsDefinition.indexedObject.indices[0];

    delete indexDefinition.properties.$userId;

    indexDefinition.properties.$userId = 'asc';

    const result = validateDPContract(rawDPContract);

    expectValidationError(result, UniqueIndexMustHaveUserIdPrefixError);

    const [error] = result.getErrors();

    expect(error.getIndexDefinition()).to.deep.equal(indexDefinition);
  });

  it('should return invalid result if indices has undefined property', () => {
    const indexDefinition = rawDPContract.dpObjectsDefinition.indexedObject.indices[0];

    indexDefinition.properties.missingProperty = 'asc';

    const result = validateDPContract(rawDPContract);

    expectValidationError(result, UndefinedIndexPropertyError);

    const [error] = result.getErrors();

    expect(error.getPropertyName()).to.equal('missingProperty');
    expect(error.getRawDPContract()).to.deep.equal(rawDPContract);
    expect(error.getDPObjectType()).to.deep.equal('indexedObject');
    expect(error.getIndexDefinition()).to.deep.equal(indexDefinition);
  });

  it('should return valid result if contract is valid', () => {
    const result = validateDPContract(rawDPContract);

    expect(result).to.be.an.instanceOf(ValidationResult);
    expect(result.isValid()).to.be.true();
  });
});