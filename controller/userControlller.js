const asyncHandler = require('express-async-handler');
const User = require('../models/User');



const changeProfileImg = asyncHandler(async (req, res) => {
  
    const userId = JSON.parse(req.body.userId)


    if (!userId) return res.status(500).json('user Id not defined')

    if (!req.file) {
        return res.status(500).json('no images to update')
    }


    const updateProfile = await User.updateOne({ _id: userId }, { profilePic: req.file.filename })
    
    return res.status(200).json({status:'profile updated',filename :req.file.filename})
})



module.exports = {
    changeProfileImg
}