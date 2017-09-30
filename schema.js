const parsedData = require("./parseWiki");

parsedData.then(r => {
  const byLanguage = r.byLanguage;
  const byCountry = r.byCountry;
  Object.keys(byLanguage).forEach(language => {
    if (language[0] === "A") {
      const translations = byLanguage[language];
      console.log(language);
      console.log(translations);
    }
  });
});
