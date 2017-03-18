require('use-strict');

const express = require('express');
const _ = require('underscore');
const http = require('http');
const bodyParser= require('body-parser');

const app = express();
const db = require('./server/controllers/db');
const server = require('http').createServer(app);
const homeController = require('./server/controllers/homeController');
const userController = require('./server/controllers/userController');
const botController = require('./server/controllers/bot');
const pomodoro = require('./server/models/pomodoro');

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));
app.use('/public', express.static('bower_components'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session data, is stored server side and not being stored in cookie
// app.use(express.session({ secret: process.env.twilioAccountSid }));

homeController.init(app);
userController.init(app);
botController.init(app);

// middleware error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  return res.status(500).json({ message: err.message });
});

server.listen(process.env.PORT || 3000);

setInterval(() => {
  pomodoro.tick();
}, 1000);
