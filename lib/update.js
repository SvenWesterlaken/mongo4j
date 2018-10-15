const _ = require('lodash');
const helper = require('./helper');
const node = require('./node');

module.exports = {

  updateFull(schema, driver, criteria, doc, options, cb) {

    const updates = _.merge(_.pick(doc, _.keys(criteria)), criteria);

    let match_clause = `MERGE (doc:${helper.getLabel(doc)} {m_id: '${doc._id}'})`;
    let set_clause = '';

    const neo_updates = node.convertToNeoUpdates(schema, updates, doc);

    set_clause += this.writePropertiesToCypher(neo_updates.props, '', false);

    const subdocs_query = this.writeSubDocumentsToCypher(neo_updates.subdocs, doc);
    match_clause += subdocs_query.match_clause;
    set_clause += subdocs_query.set_clause;

    set_clause = set_clause === '' ? ' ' : ' SET' + set_clause.substring(1);

    const doc_query = match_clause + set_clause;

    const relationships_query = this.writeRelationshipsToCypher(neo_updates.rels);

    const neo_query = doc_query + relationships_query;

    console.log(neo_query);

    const session = driver.session();

    return Promise.all([doc.update(criteria, options, cb), session.run(neo_query)]).then((results) => {
      session.close();
      return results;
    });
  },

  writePropertiesToCypher(properties, doc_identifier, is_subdoc) {
    let neo_query = "";
    let i = 0;

    const prefix = is_subdoc ? 'sub' : '';

    _.forEach(properties, (value, key) => {
      if(key == 'm_id') {
        return;
      } else {
        neo_query += `, ${prefix}doc${doc_identifier}.${key} = ${helper.valueToPlainString(value)}`;
      }
      i++;
    });

    return neo_query;
  },

  writeSubDocumentsToCypher(subdocs, doc) {
    let match_clause = "";
    let set_clause = "";

    _.forEach(subdocs, (subdoc, index) => {
      const doc_identifier = helper.romanize(index+1);

      match_clause += ` MERGE (subdoc${doc_identifier}:${subdoc.label} {m_id: '${subdoc.properties.m_id}'})`;
      set_clause += this.writePropertiesToCypher(subdoc.properties, doc_identifier, true);

    });

    return { match_clause, set_clause };
  },

  writeRelationshipsToCypher(relationships) {
    let neo_query = '';
    let relationLabels = [];

    _.forEach(relationships, (rel, index) => {
      const properties = rel.rel_props ? ` ${helper.toPlainString(rel.rel_props)}` : '';
      relationLabels.push(rel.rel_name);

      neo_query += `WITH doc `;
      neo_query += `MATCH (rel_doc:${rel.rel_label}) WHERE rel_doc.m_id = '${rel.m_id}' `;
      neo_query += `CREATE (doc)-[:${rel.rel_name}${properties}]->(rel_doc) `;

    });

    console.log(relationLabels);

    if(!_.isEmpty(relationships)) {
      relationLabels = JSON.stringify(_.uniq(relationLabels));

      let delete_clause =   `WITH doc `;
          delete_clause +=  `MATCH (doc)-[r]->() `;
          delete_clause +=  `WHERE type(r) IN ${relationLabels} `;
          delete_clause +=  `DELETE r `;

      neo_query = delete_clause + neo_query;
    }

    return neo_query;
  }

};
