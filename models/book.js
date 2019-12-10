const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    price: { type: String, required: true },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'author'}
});

module.exports = mongoose.model('book', bookSchema);