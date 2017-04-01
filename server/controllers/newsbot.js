const builder = require('botbuilder');

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
        message += ' around %s...'; // around Seattle...
      } else {
        message += '%s...'; // everywhere...
      }
      session.send(message, location);

      // Get news
      // GET https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=983a473c77c541fbb2f0fcb380093f10

    },
  ]).triggerAction({
    matches: 'GetNews',
    onInterrupted: (session) => {
      session.send('Please try again');
    },
  });

  bot.dialog('Help', (session) => {
    session.endDialog('Hi! Try asking me things like \'get latest news in Seattle\', \'show me news today\' or \'get me latest news today\'');
  }).triggerAction({
    matches: 'Help',
  });
}

// Helpers
function newsAsAttachment(hotel) {
  return new builder.HeroCard()
      .title(hotel.name)
      .subtitle('%d stars. %d reviews. From $%d per night.', hotel.rating, hotel.numberOfReviews, hotel.priceStarting)
      .images([new builder.CardImage().url(hotel.image)])
      .buttons([
        new builder.CardAction()
            .title('More details')
            .type('openUrl')
            .value('https://www.bing.com/search?q=hotels+in+' + encodeURIComponent(hotel.location)),
      ]);
}

module.exports.init = init;
