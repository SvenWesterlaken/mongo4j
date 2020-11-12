const _ = require('lodash');
const pluralize = require('pluralize');
const mongoose = require('mongoose');
const neo4j = require('neo4j-driver');

module.exports = {

  toPlainString(object) {
    let object_string = '{';

    _.forEach(object, (value, key) => {
      value = this.valueToPlainString(value);
      object_string += `${key}:${value}, `;
    });

    // Remove last comma & close with '}'
    return `${object_string.slice(0, -2)}}`;
  },

  toSetString(props, doc_name) {
    let str = '';

    _.forEach(props, (value, key) => {
      value = this.valueToPlainString(value);
      str += `${doc_name}.${key} = ${value}, `;
    });

    // Remove last comma
    return str.slice(0, -2);
  },

  valueToPlainString(value) {
    if(_.isDate(value)) {
      return neo4j.int(value.getTime());
    } else if (_.isString(value) || (_.isObject(value) && this.isObjectId(value))){
      return `'${value}'`;
    } else if (_.isNumber(value)) {
      return neo4j.int(value);
    } else {
      return value;
    }
  },

  romanize(num) {
    const lookup = { M:1000, CM:900, D:500, CD:400, C:100, XC:90, L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1 };
    let roman = '';
    let i;

    for ( i in lookup ) {
      while ( num >= lookup[i] ) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  },

  singuralize(word) {
    return pluralize.isPlural(word) ? pluralize.singular(word) : word;
  },

  isObjectId(property) {
    return mongoose.Types.ObjectId.isValid(property.toString());
  },

  renameKey(key) {
    return key == '_id' ? `m_id` : _.snakeCase(key);
  },

  getLabel(doc) {
    return _.capitalize(doc.constructor.modelName);
  },

  getSubDocLabel(type, name) {
    return _.isNil(type.options.neo_subdoc_name) ? this.singuralize(_.capitalize(name)) : _.capitalize(type.options.neo_subdoc_name);
  },

  getRelName(rel_name, doc, ref, subdoc_name) {
    if(!_.isNil(rel_name)) {
      return this.normalizeRelationship(rel_name);

    } else if (_.isUndefined(subdoc_name)) {
      return this.normalizeRelationship(`${doc.constructor.modelName}_${this.singuralize(ref)}`);

    } else {
      return this.normalizeRelationship(`${subdoc_name}_${doc.constructor.modelName}_${ref}`);
    }
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

  isSubDocument(name, type) {
    return this.hasTreeProperty(type.options.type) && this.isAllowedSubdocument(type);
  },

  isSubDocumentArray(name, type) {
    return _.isArray(type.options.type) && this.hasTreeProperty(_.first(type.options.type)) && this.isAllowedSubdocument(type);
  },

  isAllowedNeoProp(name, type) {
    return type.options.neo_prop || name == '_id';
  },

  isAllowedRelationship(type) {
    return !type.options.neo_omit_rel;
  },

  isAllowedSubdocument(type) {
    return !type.options.neo_omit_subdoc;
  },

  isNestedProperty(name) {
    return _.split(`${name}`, '.', 2).length > 1;
  },

  hasNestedRef(type) {
    return !_.isEmpty(_.filter(_.values(_.first(type.options.type)), (v) => !_.isNil(v.ref)));
  },

  hasTreeProperty(type) {
    return !_.isNil(type.tree);
  },

  endMiddleware(next, session, err) {
    session.close().then(() => {
      if (_.isNil(err)) {
        next();
      } else {
        console.log(err);
        next(err);
      }
    });
  }

};
