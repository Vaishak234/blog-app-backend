const asyncHandler = require('express-async-handler');
const Bookmark = require('../models/Bookmark');
const { default: mongoose } = require('mongoose');



const addBookmark = asyncHandler(async (req, res) => {

  
    const postId = new mongoose.Types.ObjectId(req.body.postId)
    const userId = new mongoose.Types.ObjectId(req.body.userId)
    
    if (!userId) return res.status(500).json('userId required')
 
    const bookmarkExist = await Bookmark.findOne({ userId: req.body.userId })
    console.log(bookmarkExist);
    if (bookmarkExist) {
        // await Bookmark.updateOne({ userId: req.body.userId }, {
        //  $push: { bookmark: postId }
        // })
        
          return res.status(200).json('bookmark updated')
    } else {
          await Bookmark.create({ userId: req.body.userId }, {
           bookmark:[{postId}]
          })
        
          return res.status(200).json('bookmark added')
    }

  
})



module.exports = {
    addBookmark
}