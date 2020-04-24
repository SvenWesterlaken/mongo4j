const _ = require('lodash');
const helper = require('./helper');
const node = require('./node');

module.exports = {

  one(schema, doc, next, driver) {
    const neo_doc = node.convertToNeoModel(schema, doc);

    let neo_query = `CREATE (doc:${helper.getLabel(doc)} ${helper.toPlainString(neo_doc.props)}) `;
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

      neo_query += `CREATE (doc${doc_identifier}:${helper.getLabel(doc)} ${helper.toPlainString(neo_doc.props)}) `;
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

    _.forEach(subdocs, (subdoc, index) => {
        neo_query += `CREATE (doc${doc_identifier})-[:${subdoc.rel_name}]->(:${subdoc.label} ${helper.toPlainString(subdoc.properties)}) `;
    });

    return neo_query;
  },

  writeRelationshipsToCypher(relationships, doc_identifier) {
    let neo_query = '';

    _.forEach(relationships, (rel, index) => {
        const identifier = helper.romanize(index+1);
        const properties = rel.rel_props ? ` ${helper.toPlainString(rel.rel_props)}` : '';

        neo_query += `WITH doc${doc_identifier} `;
        neo_query += `MATCH (${identifier}:${rel.rel_label}) WHERE ${identifier}.m_id = '${rel.m_id}' `;
        neo_query += `CREATE (doc${doc_identifier})-[:${rel.rel_name}${properties}]->(${identifier}) `;
    });

    return neo_query;
  }

};
