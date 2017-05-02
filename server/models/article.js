/**
 * article.js
 * Class to represent article and help with news bot
 */
const fetch = require('node-fetch');

const env = process.env;

function tryToSummarize(articleLink) {
  let link = `http://api.smmry.com/?SM_API_KEY=${env.SMMRY_KEY}&SM_URL=${articleLink}`;
  fetch(link)
  .then((res) => {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res.json().then((json) => {
      console.log(json);
      return json.sm_api_content;
    });
  })
  .catch((err) => {
    console.log(err);
  });
}

class Article {
  constructor(title, link, imageUrl) {
    this.link = link;
    this.imageUrl = imageUrl;
    this.title = title;
  }

  getSummaryContent() {
    return tryToSummarize(this.link);
  }
}

module.exports = Article;
