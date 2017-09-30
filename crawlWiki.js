const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");
const pipe = require("pipe-functions");
const wiki = require("wikijs").default();

const urlAC = "List of country names in various languages (A–C)";
const urlDI = "List of country names in various languages (D–I)";
const urlJP = "List of country names in various languages (J–P)";
const urlQZ = "List of country names in various languages (Q–Z)";

const queryFromPage = (title, data) =>
  wiki
    .page(title)
    .then(r => r.html())
    .then(r => cheerio.load(r))
    .then($ => {
      const pageData = {};
      Object.keys(data).forEach(k => {
        pageData[k] = {};
        $(`.mw-parser-output ${data[k]}`).each(function(i, elem) {
          cheerioTableparser($);
          tableData = $(this).parsetable(false, false, true);
          //console.log(tableData);
          pageData[k][i] = tableData;
        });
      });
      return pageData;
    });

getCountriesFromPage = title =>
  queryFromPage(title, {
    tables: "table"
  }).then(response => {
    const strings = response.tables;
    return Object.keys(strings)
      .map(i => strings[i])
      .filter(table => {
        return table[0][0] === "English Name";
      })
      .map(removeFirstRow)
      .map(extractRowsAsObject);
  });

const removeFirstRow = table => table.map(column => column.slice(1));
const extractRowsAsObject = table => {
  const rows = {};
  table[0].forEach((row, rowIndex) => {
    const value = table[1][rowIndex];
    rows[row] = value;
  });
  return rows;
};

const getAll = Promise.all([
  getCountriesFromPage(urlAC),
  getCountriesFromPage(urlDI),
  getCountriesFromPage(urlJP),
  getCountriesFromPage(urlQZ)
]).then(r => {
  // get all part into one array
  let all = [];
  let result = {};
  r.forEach(part => {
    all = all.concat(_toConsumableArray(part));
  });
  // get all parts into one object
  all.forEach(part => {
    result = _extends(result, part);
  });
  return result;
});

module.exports = new Promise((resolve, reject) => {
  getAll.then(r => resolve(r)).catch(e => reject(e));
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
const _toConsumableArray = arr => {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
};
