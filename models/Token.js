const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    token: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('token',TokenSchema)