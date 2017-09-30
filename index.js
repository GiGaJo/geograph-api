const CORS = require("micro-cors")();
const server = require("./server");

module.exports = CORS(server);
