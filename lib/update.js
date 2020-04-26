const _ = require('lodash');
const helper = require('./helper');
const node = require('./node');

module.exports = {

  one(schema, driver, criteria, doc, options, cb) {

    const updates = _.merge(_.pick(doc, _.keys(criteria)), criteria);

    let match_clause = `MATCH (doc:${helper.getLabel(doc)} {m_id: '${doc._id}'})`;
    let set_clause = '';

    const neo_updates = node.convertToNeoUpdates(schema, updates, doc);

    set_clause += this.writePropertiesToCypher(neo_updates.props, '', false);

    const subdocs_query = this.writeSubDocumentsToCypher(neo_updates.subdocs, doc);
    match_clause += subdocs_query.match_clause;
    set_clause += subdocs_query.set_clause;

    set_clause = set_clause === '' ? '' : ' SET' + set_clause.substring(1);

    const { relationships_query, relationships_del_query } = this.writeRelationshipsToCypher(neo_updates.rels);

    const neo_query = match_clause + relationships_query + set_clause;

    const session = driver.session();

    if (relationships_del_query !== '') {

      return session.run(relationships_del_query).then((del_result) => {
        return Promise.all([
          doc.updateOne(criteria, options, cb),
          session.run(neo_query),
          del_result
        ]);
      }).then((results) => {
        return session.close().then(() => results);
      });

    } else {
      return Promise.all([
        doc.updateOne(criteria, options, cb),
        session.run(neo_query)
      ]).then((results) => {
        return session.close().then(() => results);
      });
    }
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

  writeSubDocumentsToCypher(subdocs) {
    let match_clause = "";
    let set_clause = "";

    _.forEach(subdocs, (subdoc, index) => {
      const doc_identifier = helper.romanize(index+1);

      match_clause += ` MATCH (subdoc${doc_identifier}:${subdoc.label} {m_id: '${subdoc.properties.m_id}'})`;
      set_clause += this.writePropertiesToCypher(subdoc.properties, doc_identifier, true);

    });

    return { match_clause, set_clause };
  },

  writeRelationshipsToCypher(relationships) {
    let relationships_query = '';
    let relationships_del_query = '';

    if(!_.isEmpty(relationships)) {
      let relationLabels = [];

      let match_clause = [];
      let create_clause = [];

      _.forEach(relationships, (rel, index) => {
        const identifier = helper.romanize(index+1);
        const properties = rel.rel_props ? ` ${helper.toPlainString(rel.rel_props)}` : '';
        relationLabels.push(rel.rel_name);

        match_clause.push(`(${identifier}:${rel.rel_label} {m_id: '${rel.m_id}'})`);
        create_clause.push(`(doc)-[:${rel.rel_name}${properties}]->(${identifier})`);

      });

      relationships_query = `, ${_.join(match_clause, ', ')} CREATE ${_.join(create_clause, ', ')} `;

      relationLabels = JSON.stringify(_.uniq(relationLabels));

      relationships_del_query = `MATCH (doc)-[r]->(n) WHERE type(r) IN ${relationLabels} DELETE r`;


    }

    return { relationships_query, relationships_del_query };
  }

};
