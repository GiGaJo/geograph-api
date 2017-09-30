const config = require("./config");
const jsonfile = require("jsonfile");

module.exports = new Promise((resolve, reject) => {
  jsonfile.readFile(config.file, (err, obj) => {
    if (err) reject(err);
    resolve(obj);
  });
});
