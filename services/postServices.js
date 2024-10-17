const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');



const getAllPosts = asyncHandler(async (req, res) => {
  
    const posts = await Post.find()

    if (!posts) return res.status(500).json('error in fetching all posts')
    
    return res.status(200).json(posts)

})

const getPost = asyncHandler(async (req, res) => {
    const {postId} = req.params
    const post = await Post.findOne({_id:postId})

    if (!post) return res.status(500).json('error in fetching all posts')
    
    return res.status(200).json(post)

})






module.exports = {
    getAllPosts,
    getPost,
}