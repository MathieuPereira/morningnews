const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
})

const articleModel = mongoose.model('articles', articleSchema)

module.exports = articleModel