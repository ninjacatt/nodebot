// Contain actions which control the flow of data into and from our database
const User = require('../models/user');
const assert = require('assert');

function saveUser(newUser, res) {
  console.log(newUser);
  newUser.save((errSave) => {
    if (errSave) {
      res.status(500).send('There was a problem adding user to the database.');
    } else {
      res.status(200).send(newUser);
    }
  });
}

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
    assert(req.body.phone, 'You need to input phone number');
    assert(req.body.password, 'You need to input password');
    assert(typeof (req.body.name), 'string');
    assert(typeof (req.body.phone), 'string');
    assert(typeof (req.body.password), 'string');

    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
    });
    newUser.hashPassword((err, password) => {
      if (err) {
        res.status(500).send('There was a problem adding user to the database.');
      } else {
        this.saveUser(newUser, res);
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
module.exports.saveUser = saveUser;
