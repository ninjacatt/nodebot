/**
 * article.js
 * Class to represent article and help with news bot
 */
const fetch = require('node-fetch');

const env = process.env;

const Article = {
  tryToSummarizeAsync(articleLink) {
    const link = `http://api.smmry.com/?SM_API_KEY=${env.SMMRY_KEY}&SM_URL=${articleLink}`;
    return fetch(link)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then(json => json)
    .catch((err) => {
      console.log(err);
    });
  },
};

module.exports = Article;
