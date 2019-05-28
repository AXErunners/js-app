const axeSchema = require('../../schema/meta/axe-schema');
const contractMetaSchema = require('../../schema/meta/contract');
const stPacketHeaderSchema = require('../../schema/st-packet-header');

const ValidationResult = require('./ValidationResult');
const JsonSchemaError = require('../errors/JsonSchemaError');

class JsonSchemaValidator {
  constructor(ajv) {
    this.ajv = ajv;

    // TODO Validator shouldn't know about schemas

    this.ajv.addMetaSchema(axeSchema);

    this.ajv.addSchema(stPacketHeaderSchema);

    this.ajv.addMetaSchema(contractMetaSchema);
  }

  /**
   * @param {object} schema
   * @param {object} object
   * @param {array|Object} additionalSchemas
   * @return {ValidationResult}
   */
  validate(schema, object, additionalSchemas = {}) {
    // TODO Keep cached/compiled additional schemas

    Object.keys(additionalSchemas).forEach((schemaId) => {
      this.ajv.addSchema(additionalSchemas[schemaId], schemaId);
    });

    this.ajv.validate(schema, object);

    Object.keys(additionalSchemas).forEach((schemaId) => {
      this.ajv.removeSchema(schemaId);
    });

    return new ValidationResult(
      (this.ajv.errors || []).map(error => new JsonSchemaError(error)),
    );
  }
}

JsonSchemaValidator.SCHEMAS = {
  META: {
    CONTRACT: 'https://schema.axe.org/app-0-4-0/meta/contract',
  },
  BASE: {
    DP_OBJECT: 'https://schema.axe.org/app-0-4-0/base/document',
    ST_PACKET: 'https://schema.axe.org/app-0-4-0/base/st-packet',
  },
  ST_PACKET_HEADER: 'https://schema.axe.org/app-0-4-0/st-packet-header',
};

module.exports = JsonSchemaValidator;
