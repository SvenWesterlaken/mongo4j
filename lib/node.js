const neo4j = require('./neo4j');
const _ = require('lodash');
const helper = require('./helper');

module.exports = {

  convertToNeoModel(schema, doc) {
    const label = helper.getLabel(doc);

    let relationships = [];
    let neo_properties = {};
    let neo_docs = [];

    //console.log(schema);

    schema.eachPath((name, type) => {
      // Check if property is an allowed neo prop (no relation)
      if(helper.isAllowedNeoProp(name, type)) {
        _.assign(neo_properties ,this.getRenamedProperty(doc, name, type));

      // Check if property contains a simple ref
      } else if (helper.isSimpleRef(name, type)){
        const ref = this.getSimpleRef(doc, name, type);
        if(!_.isNil(ref.m_id)) relationships.push(ref);

      // Check if property contain a array of refs
      } else if (helper.isArrayRef(name, type)) {
        relationships = _.concat(relationships, this.getArrayRefs(doc, name, type));

      // Check if property contains a nested simple ref
      } else if (helper.isNestedRef(name, type)){

        const ref = this.getNestedRef(doc, name, type);
        if(!_.isNil(ref.m_id)) relationships.push(ref);

      // Check if property contains a nested ref in an array
      } else if (helper.isArrayNestedRef(name, type)) {
        relationships = _.concat(relationships, this.getArrayNestedRef(doc, name, type));

      } else if (helper.isSubdocument(name, type)) {

        const subdoc = this.getSubDocument(doc, name, type);
        console.log(subdoc);
      }
    });

    // Return relationships and doc information
    return {
      props: neo_properties,
      rels: relationships
    }
  },

  getRenamedProperty(doc, name, type) {
    return {[helper.renameKey(name)] : _.get(doc, name)};
  },

  getSimpleRef(doc, name, type) {
    const value = _.get(doc, name);
    const rel_name = type.options.neo_rel_name ? helper.normalizeRelationship(type.options.neo_rel_name) : helper.getAltRefName(doc, type.options.ref, name);

    return { name: rel_name, m_id: value };
  },

  getArrayRefs(doc, name, type) {
    const options_type = _.first(type.options.type);
    const rel_name = options_type.neo_rel_name ? helper.normalizeRelationship(options_type.neo_rel_name) : helper.getAltRefName(doc, options_type.ref, name);

    return _.map(_.get(doc, name), (id) => { return {name: rel_name, m_id: id} });
  },

  getNestedRef(doc, name, type) {
    const basepath = helper.getPathName(name);
    const prop_name = helper.getPropertyName(name);
    const subdoc = _.get(doc, basepath);

    const rel_name = type.options.neo_rel_name ? helper.normalizeRelationship(type.options.neo_rel_name) : helper.getAltRefName(doc, type.options.ref, basepath);
    const rel_props = _.omit(subdoc.toObject(), [prop_name]);
    const id = _.get(subdoc, prop_name);

    return { name: rel_name, m_id: id, properties: rel_props };
  },

  getArrayNestedRef(doc, name, type) {
    const options_type = _.first(type.options.type);

    let rel_name;
    let relDoc;

    _.some(options_type, (value, key) => {
      if(!_.isNil(value.ref)) {
        rel_name = value.neo_rel_name ? helper.normalizeRelationship(value.neo_rel_name) : helper.getAltRefName(doc, value.ref, name);
        relDoc = key;
      }
    });

    return _.map(_.get(doc, name), (subdoc) => {
      const rel_props = _.omit(subdoc.toObject(), [relDoc, '_id']);
      const id = _.get(subdoc, relDoc);
      return { name: rel_name, m_id: id, properties: rel_props };
    });
  },

  getSubDocument(doc, name, type) {
    const subdoc = _.get(doc, name);

    if(_.isNil(subdoc)) return;

    return this.convertToNeoModel(type.schema, subdoc);
  }

}
