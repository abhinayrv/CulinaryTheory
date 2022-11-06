const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum : ['user', 'admin'],
    default: 'user'
  }
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.salt;
    delete ret._id;
    return ret;
  }
});

UserSchema.pre('save', function(next) {
  console.log("Pre method of user");
  if (!this.isModified('password')){
     return next();
  }

  var salt = crypto.randomBytes(16).toString("hex");
  this.salt = salt;
  this.password = crypto.pbkdf2Sync(this.password, salt, 310000, 32, 'sha256').toString('hex');
  return next();
});

UserSchema.methods.getSessionData = function() {
  return {
    user_id: this.user_id,
    role: this.role
  }
};

UserSchema.methods.verifyPassword = function(candidatePassword, next) {
  console.log("In verify password");

    var hashedPassword = crypto.pbkdf2Sync(candidatePassword, this.salt, 310000, 32, 'sha256').toString("hex")
    
    if (this.password == hashedPassword){
        return next(null, true);
    } else {
        return next(null, false);
    }
};

UserSchema.methods.equals = function(user) {
  return this.user_id == user.user_id;
};

module.exports = mongoose.model('User', UserSchema);
