const fetch = require('node-fetch');
const builder = require('botbuilder');
const newsSource = require('../resources/newsapi');

const env = process.env;

function init(app) {
  // Create chat bot and binding
  const connector = new builder.ChatConnector({
    appId: env.BOT_APP_ID,
    appPassword: env.BOT_APP_PASSWORD,
  });
  app.post('/api/news', connector.listen());

  const bot = new builder.UniversalBot(connector, (session) => {
    session.send('Sorry, I did not understand \'%s\'. Send \'help\' if you need assistance.', session.message.text);
  });

  // Create LUIS recognizer that points at our model
  const recognizer = new builder.LuisRecognizer(env.LUIS_MODEL);
  bot.recognizer(recognizer);

  bot.dialog('GetNews', [
    (session, args, next) => {
      session.send('Welcome to the Keep Me Updated! We are analyzing your message: \'%s\'', session.message.text);

      // try extracting entities
      const cityEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.geography.city');
      if (cityEntity) {
        // city entity detected, continue to next step
        session.dialogData.searchType = 'city';
        next({ response: cityEntity.entity });
      } else {
        // no entities detected, get news everywhere
        session.dialogData.searchType = 'world';
        next({ response: 'everywhere' });
      }
    },
    (session, results) => {
      // Send initial replied message
      const location = results.response;
      let message = 'Looking for news';
      if (session.dialogData.searchType === 'city') {
        message += ' around %s for you...'; // around Seattle...
      } else {
        message += ' %s for you...'; // everywhere...
      }
      session.send(message, location);

      // Get news
      // GET https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=<key>
      fetch(`https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=${env.NEWS_API_KEY}`)
      .then(res => res.json())
      .then((json) => {
        session.send('I found %d articles:', json.articles.length);

        const responseMessage = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(json.articles.map(newsAsAttachment));

        session.send(responseMessage);
        session.endDialog();
      });
    },
  ]).triggerAction({
    matches: 'GetNews',
    onInterrupted: (session) => {
      session.send('Please try again');
    },
  });

  bot.dialog('GetNewsFromSource', (session, args) => {
    session.send('Welcome to the Keep Me Updated! We are analyzing your message: \'%s\'', session.message.text);

    // try extracting entities
    const customNewsOrgEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'NewsOrg');

    if (customNewsOrgEntity && customNewsOrgEntity.entity) {
      // Okay, seems like we detect a legit new knownOrganization
      session.send('Looking for news at \'%s\'...', customNewsOrgEntity.entity);

      // Check with our eixsting set of supported new org
      const formattedNewSource = newsSource.getFormattedSourceNews(customNewsOrgEntity.entity);

      // Get news
      fetch(`https://newsapi.org/v1/articles?source=${formattedNewSource}&sortBy=latest&apiKey=${env.NEWS_API_KEY}`)
      .then(res => res.json())
      .then((json) => {
        const responseMessage = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(json.articles.map(newsAsAttachment));
        session.send(responseMessage);
        session.endDialog();
      });
    } else {
      session.send('Hmm we don\'t have that source, but here\'s google news...');
      fetch(`https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=${env.NEWS_API_KEY}`)
      .then(res => res.json())
      .then((json) => {
        session.send('I found %d articles:', json.articles.length);

        const responseMessage = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(json.articles.map(newsAsAttachment));

        session.send(responseMessage);
        session.endDialog();
      });
    }
  }).triggerAction({
    matches: 'GetNewsFromSource'
  });

  bot.dialog('Help', (session) => {
    session.endDialog('Hi! Try asking me things like \'get news from Times\', \'show me news today\' or \'show me techcrunch news\'');
  }).triggerAction({
    matches: 'Help',
  });
}

// Helpers
function newsAsAttachment(news) {
  return new builder.HeroCard()
      .title(news.title)
      .subtitle(news.description)
      .images([new builder.CardImage().url(news.urlToImage)])
      .buttons([
        new builder.CardAction()
            .title('More details')
            .type('openUrl')
            .value(news.url),
      ]);
}

module.exports.init = init;
