const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    bookmark: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "post",
    },
  
   
}, { timestamps: true })

module.exports = mongoose.model('bookmark',bookmarkSchema)