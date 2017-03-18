const pomodoro = require('../models/pomodoro');
const textMessage = require('../models/textMessage');

const env = process.env;

function authorized(req, res, next) {
  if (!env.enableAuth) {
    next();
  } else {
    res.redirect('/login');
  }
}

function init(app) {
  app.get('/login', (req, res) => {
    res.json('login page here.');
  });

  app.get('/env', (req, res) => {
    textMessage.send('Testing');
    res.send(process.env);
  });

  app.get('/current', authorized, (req, res) => {
    res.json(pomodoro.currentTask());
  });

  app.get('/break', authorized, (req, res) => {
    res.json(pomodoro.currentBreak());
  });

  app.post('/text', (req, res) => {
    let message = req.body.Body;
    let fromNumber = req.body.From;
    let result = { };

    if (message.match(/^\s*status\s*$/i)) {
      if (pomodoro.isWorkingOnTask()) {
        let currentTask = pomodoro.currentTask();
        result.message = `${currentTask.title} - ${currentTask.minutesLeft.toFixed(2)} minute(s) left.`;
        textMessage.send(result.message);
      } else if (pomodoro.isOnBreak()) {
        let currentTask = pomodoro.currentBreak();
        result.message = `yay! you're on a break - ${currentTask.minutesLeft.toFixed(2)} minute(s) left.`;
        textMessage.send(result.message);
      } else {
        result.message = 'no pomodoro is currently running, reply to me to start one, or be lazy and do nothing';
        textMessage.send(result.message);
      }
    } else if (message.match(/^\s*break\s*$/i)) {
      pomodoro.startBreak();
      result.message = 'break started';
    } else if (message.match(/^\s*clear\s*$/i)) {
      pomodoro.clearAll();
      result.message = 'cleared';
    } else if (message.match(/^\s*$/i)) {
      pomodoro.clearAll();
      result.message = 'cleared';
    } else {
      pomodoro.startTask(message);
      result.message = `${message} started at ${new Date()}`;
    }

    console.log(message);
    console.log(fromNumber);
    console.log(result);
    res.json(result);
  });
}

module.exports.init = init;
