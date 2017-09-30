const parse = require("./parseWiki");
const jsonFile = require("jsonfile");
const config = require("./config");

parse.then(r => {
  jsonFile.writeFile(config.file, r, err => {
    console.error("fehler", err);
  });
  return r;
});
