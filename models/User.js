const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    username: {
        type: String,
        required: true,
      
    },
    password: {
        type: String,
        required: true,
    },
   profilePic: {
        type: String,
        default:""
    },
}, { timestamps: true })

module.exports = mongoose.model('user',UserSchema)