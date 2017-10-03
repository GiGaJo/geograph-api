const loadData = require("./wikiData");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require("graphql");

const translationsByCountry = country => r => ({
  translations: Object.keys(r.byLanguage)
    .map(language => {
      return {
        language: language,
        translation: r.byCountry[country][language],
        name: country
      };
    })
    .filter(t => t.translation)
});

const translationsByLanguage = language => r => ({
  translations: Object.keys(r.byCountry)
    .map(country => {
      return {
        language: language,
        translation: r.byCountry[country][language],
        name: country
      };
    })
    .filter(t => t.translation)
});

const TranslationListType = new GraphQLObjectType({
  name: "TranslationList",
  description: "List of translations for a given country",
  fields: () => ({
    translations: {
      type: new GraphQLList(TranslationType)
    }
  })
});

const TranslationType = new GraphQLObjectType({
  name: "Translation",
  description:
    "Single translation object consisting of origininal English name, language and the translated name",
  fields: () => ({
    name: {
      type: GraphQLString
    },
    language: {
      type: GraphQLString
    },
    translation: {
      type: GraphQLString
    }
  })
});

const RootType = new GraphQLObjectType({
  name: "Translations",
  description: "Get country names in different languages",
  fields: () => ({
    byCountry: {
      name: "Translations for one country",
      description: "All translated names for given country (in English)",
      type: TranslationListType,
      args: {
        country: { type: GraphQLString }
      },
      resolve: (root, { country }) =>
        loadData.then(translationsByCountry(country))
    },
    byLanguage: {
      name: "All translated countries in one language",
      description: "All countries in ",
      type: TranslationListType,
      args: {
        language: { type: GraphQLString }
      },
      resolve: (root, { language }) =>
        loadData.then(translationsByLanguage(language))
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootType
});
