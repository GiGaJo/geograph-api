const cachedData = require("./readCache");

module.exports = new Promise((resolve, reject) => {
  cachedData.then(r => resolve(r)).catch(e => {
    const parse = require("./parseAndCache");
    parse.then(resolve);
  });
});
