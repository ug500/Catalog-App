const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: { type: String, unique: true, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  birth_date: { type: Date, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  Preferences: {
    Page_size: { type: Number, default: 12 },
  },
});

module.exports = mongoose.model('User', userSchema);