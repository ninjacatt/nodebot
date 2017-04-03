const KnownSources = {
  'abc-news-au': 'Abc News Au',
  'ars-technica': 'Ars Technica',
  'associated-press': 'Associated Press (AP)',
  'bbc-news': 'BBC News',
  'bloomberg': 'Bloomberg',
  'breitbart-news': 'Breitbart News ',
  'business-insider': 'Business Insider',
  'cnbc': 'CNBC',
  'cnn': 'CNN',
  'engadget': 'Engadget',
  'entertainment-weekly': 'Entertainment Weekly',
  'espn': 'ESPN',
  'financial-times': 'Financial Times',
  'fortune': 'Fortune',
  'hacker-news': 'Hacker News',
  'independent': 'Independent',
  'mashable': 'Mashable',
  'national-geographic': 'National Geographic',
  'new-scientist': 'New Scientist',
  'newsweek': 'Newsweek',
  'new-york-magazine': 'New York Magazine (NYM)',
  'reddit-r-all': 'Reddit',
  'recode': 'Recode',
  'reuters': 'Reuters',
  'techcrunch': 'Techcrunch',
  'techradar': 'Techradar',
  'the-economist': 'The Economist',
  'the-guardian-uk': 'The Guardian UK',
  'the-huffington-post': 'The Huffington Post',
  'the-new-york-times': 'The New York Times (NYT)',
  'the-next-web': 'The Next Web',
  'the-verge': 'The Verge',
  'the-wall-street-journal': 'The Wall Street Journal (WSJ)',
  'the-washington-post': 'The Washington Post',
  'time': 'Time',
  'usa-today': 'USA Today',
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

  getAllSources: () => {
    let sources = '';
    for (const key in KnownSources) {
      if (KnownSources.hasOwnProperty(key)) {
        sources += `${KnownSources[key]}, `;
      }
    }

    return sources.slice(0, sources.length - 2);
  },
};

