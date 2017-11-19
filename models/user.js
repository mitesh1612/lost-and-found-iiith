var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});
UserSchema.statics.authenticate = (email,password,callback) => {
  User.findOne({email: email})
    .exec((err,user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        var err = new Error('User not Found.');
        err.status = 401;
        return callback(err);
      }
      if(password==user.password) {
        return callback(null,user);
      } else {
        return callback();
      }
    });
}
var User = mongoose.model('User', UserSchema);
module.exports = User;
