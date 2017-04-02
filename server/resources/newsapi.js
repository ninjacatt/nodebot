const KnownSources = {
  'abc-news-au': 'abc news au',
  'ars-technica': 'ars technica',
  'associated-press': 'Associated Press (AP)',
  'bbc-news': 'BBC News',
  'bloomberg': 'bloomberg',
  'breitbart-news': 'Breitbart News ',
  'business-insider': 'business insider',
  'cnbc': 'cnbc',
  'cnn': 'cnn',
  'engadget': 'engadget',
  'entertainment-weekly': 'entertainment weekly',
  'espn': 'espn',
  'financial-times': 'financial times',
  'fortune': 'fortune',
  'hacker-news': 'hacker news',
  'independent': 'independent',
  'mashable': 'mashable',
  'national-geographic': 'national geographic',
  'new-scientist': 'new scientist',
  'newsweek': 'newsweek',
  'new-york-magazine': 'new york magazine (NYC)',
  'reddit-r-all': 'reddit',
  'recode': 'recode',
  'reuters': 'reuters',
  'techcrunch': 'techcrunch',
  'techradar': 'techradar',
  'the-economist': 'the economist',
  'the-guardian-uk': 'the guardian uk',
  'the-huffington-post': 'the huffington post',
  'the-new-york-times': 'the new york times (NYT)',
  'the-next-web': 'the next web',
  'the-verge': 'the verge',
  'the-wall-street-journal': 'the wall street journal (WSJ)',
  'the-washington-post': 'the washington post',
  'time': 'time',
  'usa-today': 'usa today',
};

function isSimilar(val1, val2) {
  const isEqual = val1.toUpperCase() === val2.toUpperCase();
  const isContainVal1 = val2.toUpperCase().includes(val1.toUpperCase());
  const isContainVal2 = val1.toUpperCase().includes(val2.toUpperCase());
  return isEqual || isContainVal1 || isContainVal2;
}

module.exports = {
  getFormattedSourceNews: (source) => {
    for (const key in KnownSources) {
      if (KnownSources.hasOwnProperty(key)
      && isSimilar(source, KnownSources[key])) {
        return key;
      }
    }
    return 'google-news'; // if found nothing, default to google news
  },
};

