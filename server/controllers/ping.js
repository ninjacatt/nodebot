function init(app) {
  // get all users
  app.get('/ping', (req, res) => {
    res.status(200).send('Up and running');
  });
}

module.exports.init = init;
