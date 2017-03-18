// User model. Blueprint to show what all users in our DB will look like
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
