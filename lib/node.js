const _ = require('lodash');
const helper = require('./helper');

module.exports = {

  convertToNeoModel(schema, doc) {
    let relationships = [];
    let properties = {};
    let subdocs = [];

    schema.eachPath((name, type) => {
      if(_.hasIn(doc, name)) {

        // Check if property is an allowed neo prop (no relation)
        if(helper.isAllowedNeoProp(name, type)) {
          _.assign(properties ,this.getRenamedProperty(doc, name));

        // Check if property is a subdocument
        } else if (helper.isSubDocument(name, type)) {
          const subdoc = this.getSubDocument(doc, name, type);
          if(!_.isNil(subdoc)) subdocs.push(subdoc);

        // Check if property is an array of subdocuments
        } else if (helper.isSubDocumentArray(name, type)) {
          subdocs = _.concat(subdocs, this.getSubDocumentArray(doc, name, type));

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
        }
      }
    });

    // Return relationships and doc information
    return {
      props: properties,
      rels: relationships,
      subdocs
    };
  },

  convertToNeoUpdates(schema, updates, doc) {
    //Set modelname to use for automatic relationship name (if not set)
    updates.constructor.modelName = doc.constructor.modelName;
    return this.convertToNeoModel(schema, updates);

  },

  getRenamedProperty(doc, name) {
    return {[helper.renameKey(name)] : _.get(doc, name)};
  },

  getSimpleRef(doc, name, type) {
    const m_id = _.get(doc, name);
    const rel_name = helper.getRelName(type.options.neo_rel_name, doc, type.options.ref, name);
    const rel_label = _.capitalize(type.options.ref);

    return { rel_name, m_id, rel_label };
  },

  getArrayRefs(doc, name, type) {
    const options_type = _.first(type.options.type);
    const rel_name = helper.getRelName(options_type.neo_rel_name, doc, options_type.ref, name);
    const rel_label = _.capitalize(options_type.ref);

    return _.map(_.get(doc, name), (m_id) => { return {rel_name, m_id, rel_label}; });
  },

  getNestedRef(doc, name, type) {
    const basepath = helper.getPathName(name);
    const prop_name = helper.getPropertyName(name);
    const subdoc = _.get(doc, basepath);

    const rel_name = helper.getRelName(type.options.neo_rel_name, doc, type.options.ref, basepath);
    const rel_props = _.omit(subdoc.toObject(), [prop_name]);
    const rel_label = _.capitalize(type.options.ref);
    const m_id = _.get(subdoc, prop_name);

    return { rel_name, m_id, rel_label, rel_props };
  },

  getArrayNestedRef(doc, name, type) {
    const options_type = _.first(type.options.type);

    let rel_name;
    let rel_doc;
    let rel_label;

    _.some(options_type, (value, key) => {
      if(!_.isNil(value.ref)) {
        rel_name = helper.getRelName(value.neo_rel_name, doc, value.ref, name);
        rel_label = _.capitalize(value.ref);
        rel_doc = key;
      }
    });

    return _.map(_.get(doc, name), (subdoc) => {
      const rel_props = _.omit(subdoc.toObject(), [rel_doc, '_id']);
      const m_id = _.get(subdoc, rel_doc);

      return { rel_name, m_id, rel_label, rel_props };
    });
  },

  getSubDocument(doc, name, type) {
    const subdoc = _.get(doc, name);
    if(_.isNil(subdoc)) return;

    let properties = {};
    const label = helper.getSubDocLabel(type, name);
    const rel_name = helper.getRelName(type.options.neo_rel_name, doc, name);

    type.schema.eachPath((name, type) => {
      if(helper.isAllowedNeoProp(name, type)) {
        _.assign(properties ,this.getRenamedProperty(subdoc, name, type));
      }
    });

    return { properties, label, rel_name };
  },

  getSubDocumentArray(doc, name, type) {
    const options_type = _.first(type.options.type);
    const label = helper.getSubDocLabel(options_type, name);
    const rel_name = helper.getRelName(options_type.neo_rel_name, doc, name);


    return _.map(_.get(doc, name), (subdoc) => {
      let properties = {};

      type.schema.eachPath((name, type) => {
        if(helper.isAllowedNeoProp(name, type)) {
          _.assign(properties ,this.getRenamedProperty(subdoc, name, type));
        }
      });

      return {properties, label, rel_name};
    });
  }

};
