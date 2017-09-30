const crawlWiki = require("./crawlWiki");
const jsonFile = require("jsonfile");

const parseLanguageString = (string = "") => {
  if (string === undefined) return [];
  const translations = string.split("),");
  const translation = translations.map(getTranslation);
  const languages = translations.map(getLanguages);
  const r = {};
  translations.forEach((trans, i) => {
    languages[i].forEach(lang => {
      r[lang] = translation[i];
    });
  });
  return r;
};

const getTranslation = (s = "") => {
  const t = s.split("(")[0];
  const str = t.includes(" - ") ? getOriginalCharacters(t) : t;
  return str.trim();
};
const getOriginalCharacters = (s = "") => {
  const p = s.split(" - ");
  return p[p.length - 1];
};
const getLanguages = (s = "") => {
  const part = s.split("(")[1];
  if (part === undefined) return [];
  const languages = part.split(",");
  return languages.map(l => l.trim()).map(removeBracket);
};

const removeBracket = s => (s[s.length - 1] === ")" ? s.slice(0, -1) : s);

const prepareResponse = raw => {
  const byCountry = {};
  const byLanguage = {};
  Object.keys(raw).forEach(englishName => {
    const translationsString = raw[englishName];
    const translations = parseLanguageString(translationsString);
    byCountry[englishName] = translations;
    Object.keys(translations).forEach((language, i) => {
      const old = byLanguage[language] || {};
      const newEntry = Object.assign({}, old);
      newEntry[englishName] = translations[language];
      byLanguage[language] = Object.assign({}, newEntry);
    });
  });
  return {
    byCountry,
    byLanguage
  };
};

module.exports = crawlWiki.then(prepareResponse);
