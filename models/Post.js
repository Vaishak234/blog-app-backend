const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    category: {
        type: String,
        required: true,
    },
    content: {
        type: String,

    },
    images:[]
}, { timestamps: true })

module.exports = mongoose.model('posts',PostSchema)