const { buildSchema } = require("graphql");
const server = require("express-graphql");

const schema = require("./schema");

const rootValue = {
  hello: () => "Hello Earth"
};

module.exports = server({ schema, rootValue, graphiql: true });
