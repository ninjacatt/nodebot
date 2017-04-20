// User model. Blueprint to show what all users in our DB will look like
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, require: true, unique: true },
  meta: {
    age: Number,
    location: String,
  },
  created_at: Date,
  updated_at: Date,
});

UserSchema.plugin(uniqueValidator);


UserSchema.methods.hashPassword = function hashPassword (callback) {
  const passwordStr = this.password;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      callback(err);
    } else {
      bcrypt.hash(passwordStr, salt, (errHash, hash) => {
        if (!errHash) {
          this.password = hash;
          callback(null, this.password);
        } else {
          callback(errHash);
        }
      });
    }
  });
  // to compare password
  // bcrypt.compare(inputPassword, hash).then((res) => {
  //    // res === true
  // });
};

// Before every save, we update the date information
UserSchema.pre('save', (next) => {
  const currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

// Create a model using this schema
const User = mongoose.model('User', UserSchema);

// Make this available for Node app
module.exports = User;
