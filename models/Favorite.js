// models/Favorite.js
const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: String,
    imdbID: { type: String, required: true, unique: true },
    poster: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, { timestamps: true });
  

module.exports = mongoose.model('Favorite', FavoriteSchema);
