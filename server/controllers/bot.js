const builder = require('botbuilder');

const env = process.env;

function init(app) {
  const id = env.BOT_APP_ID;
  const pass = env.BOT_APP_PASSWORD;
  // Create chat bot
  const connector = new builder.ChatConnector({
    appId: env.BOT_APP_ID,
    appPassword: env.BOT_APP_PASSWORD,
  });

  const bot = new builder.UniversalBot(connector);
  app.post('/api/messages', connector.listen());

  // Start bot by guessing user intents from first command
  const intents = new builder.IntentDialog();
  bot.dialog('/', intents);

  // If user want to change name
  intents.matches(/^change name/i, [
    function (session) {
      session.beginDialog('/profile');
    },
    function (session, results) {
      if (results.response) {
        session.send('Ok... Changed your name to %s', session.userData.userName);
      } else {
        session.send('Hmm... Couldn\'t change your name to %s', session.userData.userName);
      }
    },
  ]);

  intents.onDefault([
    function (session, args, next) {
      if (!session.userData.name) {
        session.beginDialog('/profile');
      } else {
        next();
      }
    },
    function (session, results) {
      session.send('Hello %s!', session.userData.userName);
    },
  ]);

  // deal with user information
  bot.dialog('/profile', [
    function (session) {
      builder.Prompts.text(session, 'whats your name?');
    },
    function (session, results) {
      const currentSession = session;
      currentSession.userData.userName = results.response;
      session.endDialog();
    },
  ]);
}

module.exports.init = init;
