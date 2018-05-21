const _ = require('lodash');
const helper = require('./helper');
const node = require('./node');

module.exports = {

  one(schema, doc, next, driver) {
    const neo_doc = node.convertToNeoModel(schema, doc);

    let neo_query = `MERGE (doc:${helper.getLabel(doc)} ${helper.toPlainString(neo_doc.props)}) \n`;

    _.forEach(neo_doc.subdocs, (subdoc, index) => {
        neo_query += `MERGE (doc)-[:${subdoc.rel_name}]->(:${subdoc.label} ${helper.toPlainString(subdoc.properties)}) \n`;
    });

    _.forEach(neo_doc.rels, (rel, index) => {
        const identifier = helper.romanize(index+1);
        const properties = rel.rel_props ? ` ${helper.toPlainString(rel.rel_props)}` : '';

        neo_query += `WITH doc \n`
        neo_query += `MATCH (${identifier}:${rel.rel_label}) WHERE ${identifier}.m_id = '${rel.m_id}' \n`
        neo_query += `MERGE (doc)-[:${rel.rel_name}${properties}]->(${identifier}) \n`;
    });

    const session = driver.session();
    session.run(neo_query).catch((err) => helper.endMiddleware(next, session, err)).then(helper.endMiddleware(next, session));
  },

  multiple(schema, docs, next) {
    // console.log(docs);
    next();
  },

}

// { props:
//    { first_name: 'Neil',
//      last_name: 'Young',
//      m_id: 5b02c7e93d2b6f4aa42c9197 },
//   rels: [],
//
//   subdocs:
//    [ { properties: [Object],
//        label: 'Address',
//        rel_name: 'PERSON_ADDRESS' } ] }
// { props: { title: 'Chemistry', m_id: 5b02c7e93d2b6f4aa42c919d },
//   rels:
//    [ { name: 'TAUGHT_BY', m_id: 5b02c7e93d2b6f4aa42c9197 },
//      { name: 'SUPERVISOR_CLASS_PERSON',
//        m_id: 5b02c7e93d2b6f4aa42c9198,
//        properties: [Object] },
//      { name: 'TEACHES', m_id: 5b02c7e93d2b6f4aa42c9199 },
//      { name: 'TEACHES', m_id: 5b02c7e93d2b6f4aa42c919a } ],
//   subdocs:
//    [ { properties: [Object], label: 'Book', rel_name: 'CLASS_BOOKS' },
//      { properties: [Object], label: 'Book', rel_name: 'CLASS_BOOKS' } ] }
// { props:
//    { first_name: 'Jack',
//      last_name: 'Dockster',
//      m_id: 5b02c7e93d2b6f4aa42c919f },
//   rels:
//    [ { name: 'TAKES_CLASS',
//        m_id: 5b02c7e93d2b6f4aa42c919d,
//        properties: [Object] } ],
//   subdocs: [] }
