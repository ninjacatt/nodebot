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

  // bot dialog
  bot.dialog('/', (session) => {
    session.send('Hi there');
  });
}

module.exports.init = init;
