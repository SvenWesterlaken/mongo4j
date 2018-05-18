const _ = require('lodash');

module.exports = {

  renameKey(key) {
    return key == '_id' ? `m_id` : _.snakeCase(key);
  },

  getLabel(doc) {
    return _.capitalize(doc.constructor.modelName);
  },

  getAltRefName(doc, type, name) {
    return this.normalizeRelationship(`${name}_${doc.constructor.modelName}_${type}`);
  },

  getPathName(name) {
    return _.first(_.split(`${name}`, '.', 1));
  },

  getPropertyName(name) {
    return _.last(_.split(`${name}`, '.'));
  },

  normalizeRelationship(value) {
    return _.toUpper(_.snakeCase(value));
  },

  isSimpleRef(name, type) {
    return type.options.ref && this.isAllowedRelationship(type) && !this.isNestedProperty(name);
  },

  isArrayRef(name, type) {
    return _.isArray(type.options.type) && _.first(type.options.type).ref && this.isAllowedRelationship(type);
  },

  isNestedRef(name, type) {
    return type.options.ref && this.isAllowedRelationship(type) && this.isNestedProperty(name);
  },

  isArrayNestedRef(name, type) {
    return _.isArray(type.options.type) && this.isAllowedRelationship(type) && this.hasNestedRef(type);
  },

  isSubdocument(name, type) {
    return this.hasTreeProperty(type);
  },

  isAllowedNeoProp(name, type) {
    return type.options.neo_prop || name == '_id';
  },

  isAllowedRelationship(type) {
    return !type.options.neo_omit_rel;
  },

  isNestedProperty(name) {
    return _.split(`${name}`, '.', 2).length > 1;
  },

  hasNestedRef(type) {
    return !_.isEmpty(_.filter(_.values(_.first(type.options.type)), (v) => !_.isNil(v.ref)));
  },

  hasTreeProperty(type) {
    return !_.isNil(type.options.type.tree);
  }

}
