const _ = require('lodash');
const helper = require('./helper');
const node = require('./node');

module.exports = {

  one(schema, doc, next, driver) {
    const neo_doc = node.convertToNeoModel(schema, doc);

    const ids = _.map(neo_doc.subdocs, subdoc => subdoc.properties.m_id.toString());
    ids.push(neo_doc.props.m_id.toString());

    let neo_query = `MATCH (doc) WHERE doc.m_id IN ${JSON.stringify(ids)} DETACH DELETE doc`;

    const session = driver.session();
    session.run(neo_query).catch((err) => {
      helper.endMiddleware(next, session, err);
    }).then(() => helper.endMiddleware(next, session));

  }

};
