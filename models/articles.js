const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    title: String,
    description: String,
    content: String,
    image: String
})

const articleModel = mongoose.model('articles', articleSchema)

module.exports = articleModel;