const _ = require('lodash');
const helper = require('./helper');
const node = require('./node');

module.exports = {

  one(schema, doc, next, driver) {
    const neo_doc = node.convertToNeoModel(schema, doc);

    let neo_query = `MERGE (doc:${helper.getLabel(doc)} { m_id: '${neo_doc.props.m_id}' }) `;

    const neo_properties = helper.toSetString(neo_doc.props, 'doc');
    neo_query += `ON CREATE SET ${neo_properties} `;
    neo_query += `ON MATCH SET ${neo_properties} `;
    neo_query += this.writeSubDocumentsToCypher(neo_doc.subdocs, '');
    neo_query += this.writeRelationshipsToCypher(neo_doc.rels, '');

    const session = driver.session();
    session.run(neo_query).catch((err) => {
      helper.endMiddleware(next, session, err);
    }).then(() => helper.endMiddleware(next, session));
  },

  multiple(schema, docs, next, driver) {
    let neo_query = '';

    _.forEach(docs, (doc, index) => {
      const neo_doc = node.convertToNeoModel(schema, doc);
      const doc_identifier = helper.romanize(index+1);
      const doc_name = `doc${doc_identifier}`;

      neo_query += `MERGE (${doc_name}:${helper.getLabel(doc)} { m_id: '${neo_doc.props.m_id}' }) `;

      const neo_properties = helper.toSetString(neo_doc.props, doc_name);
      neo_query += `ON CREATE SET ${neo_properties} `;
      neo_query += `ON MATCH SET ${neo_properties} `;
      neo_query += this.writeSubDocumentsToCypher(neo_doc.subdocs, doc_identifier);
      neo_query += this.writeRelationshipsToCypher(neo_doc.rels, doc_identifier);

    });

    const session = driver.session();
    session.run(neo_query).catch((err) => {
      helper.endMiddleware(next, session, err);
    }).then(() => helper.endMiddleware(next, session));
  },

  writeSubDocumentsToCypher(subdocs, doc_identifier) {
    let neo_query = '';

    _.forEach(subdocs, (subdoc) => {
        neo_query += `CREATE (doc${doc_identifier})-[:${subdoc.rel_name}]->(:${subdoc.label} ${helper.toPlainString(subdoc.properties)}) `;
    });

    return neo_query;
  },

  writeRelationshipsToCypher(relationships, doc_identifier) {
    let neo_query = '';

    _.forEach(relationships, (rel, index) => {
        const identifier = helper.romanize(index+1);
        const rel_identifier = `rel${identifier}`;
        const properties = helper.toSetString(rel.rel_props, rel_identifier);

        neo_query += `WITH doc${doc_identifier} `;
        neo_query += `MATCH (${identifier}:${rel.rel_label}) WHERE ${identifier}.m_id = '${rel.m_id}' `;

        if (rel.rel_props) {
          neo_query += `MERGE (doc${doc_identifier})-[${rel_identifier}:${rel.rel_name}]->(${identifier}) `;
          neo_query += `ON CREATE SET ${properties} `;
          neo_query += `ON MATCH SET ${properties} ` ;
        } else {
          neo_query += `MERGE (doc${doc_identifier})-[:${rel.rel_name}]->(${identifier}) `;
        }
        
    });

    return neo_query;
  }

};
