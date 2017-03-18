// Contain actions which control the flow of data into and from our database
const User = require('../models/user');
const assert = require('assert');

function init(app) {
  /**
   * POST users method
   * take json of name, email and password
   * name: a string representing user name
   * email: a string representing email
   * password: a string representing password
   * This could fail due to:
   * fail to connect to DB or add new value to DB
   */
  app.post('/users', (req, res) => {
    assert(req.body, 'Invalid request. Body has no value');
    assert(req.body.name, 'You need to input name');
    assert(req.body.email, 'You need to input email');
    assert(req.body.password, 'You need to input password');
    assert(typeof (req.body.name), 'string');
    assert(typeof (req.body.email), 'string');
    assert(typeof (req.body.password), 'string');

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }, (err, user) => {
      if (err) {
        res.status(500).send('There was a problem adding user to the database.');
      } else {
        res.status(200).send(user);
      }
    });
  });

  // get all users
  app.get('/users', (req, res) => {
    User.find({}, (err, user) => {
      if (err) {
        res.status(500).send('There was a problem getting users.');
      } else {
        res.status(200).send(user);
      }
    });
  });
}

module.exports.init = init;
