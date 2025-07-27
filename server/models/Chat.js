const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  title: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
