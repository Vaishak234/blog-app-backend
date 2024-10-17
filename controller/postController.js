const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');



const createPost = asyncHandler(async (req, res) => {

  const post = JSON.parse(req.body.post)
  const { title, summary, content, userId, category } = post
  const images = req.files.map((file) => file.filename)
  

    if (!title || !summary || !content || !category ||!userId || images.length == 0) return res.status(500).json('all fields required')
   

    const newPost = await Post.create({
        title,
        summary,
        content,
        images,
        userId,
        category
    })


    if (!newPost) return res.status(500).json('error in creating post')
    
    return res.status(200).json('post created')

})

const updatePost = asyncHandler(async (req, res) => {
    
  const post = JSON.parse(req.body.post)
  const { title, summary, content, userId, category } = post
  const { postId } = req.params
  const images = req.files.map((file)=>file.filename)


  if (!userId) return res.status(500).json('all fields required')

  if (images.length == 0) {
   
    const updatePost = await Post.updateOne(
      {_id:postId},
      {
        title,
        summary,
        content,
        category,
      })
  } else {

    updatePost = await Post.updateOne(
      {_id:postId},
      {
        title,
        summary,
        content,
        category,
        images
      })
  }
    

    if (!updatePost) return res.status(500).json('error in updating post')
    
    return res.status(200).json('post updated')


})

const getAllPosts = asyncHandler(async (req, res) => {
    

    
     let allPosts = await Post.aggregate([
            {
               $lookup: {
                  from: 'users',
                  localField: "userId",
                  foreignField: "_id",
                  as: "allPosts"
               }
            },
            {
               $unwind: '$allPosts'
            },
            {
              $project: {
                title: 1,
                updatedAt: 1,
                createdAt:1,
                summary: 1,
                content: 1,
                category: 1,
                userId: 1,
                images:1,
                  email: "$allPosts.email",
                  mobile: "$allPosts.mobile",
                  username: "$allPosts.username",
                  profilePic: "$allPosts.profilePic"
               }
            }
            
     ]).sort( { 'updatedAt': -1 } )
  

  if (!allPosts) return res.status(500).json('error in fetching post')
  
    return res.status(200).json(allPosts)


})

const getPost = asyncHandler(async (req, res) => {
    
  console.log(req.params.id);
   const postId = new mongoose.Types.ObjectId(req.params.id)

    
  let post = await Post.aggregate([
    {
       $match:{_id: postId}
    },
      {
               $lookup: {
                  from: 'users',
                  localField: "userId",
                  foreignField: "_id",
                  as: "allPosts"
               }
            },
            {
               $unwind: '$allPosts'
            },
            {
              $project: {
                title: 1,
                updatedAt: 1,
                createdAt:1,
                summary: 1,
                content: 1,
                category: 1,
                userId: 1,
                images:1,
                  email: "$allPosts.email",
                  mobile: "$allPosts.mobile",
                  username: "$allPosts.username",
                  profilePic: "$allPosts.profilePic"
               }
            }
            
     ])
  
  if (!post) return res.status(500).json('error in fetching post')
  return res.status(200).json(post[0])


})

const getUserPosts = asyncHandler(async (req, res) => {
    

  let userPosts = await Post.find({userId:req.params.id}).sort( { 'updatedAt': -1 } )
  
  if (!userPosts) return res.status(500).json('error in fetching post')
  
    return res.status(200).json(userPosts)


})
const deletePost = asyncHandler(async (req, res) => {
   
    const { id } = req.params
    console.log(id);
    const deletePost = await Post.deleteOne(
      { _id: id }
    )

    if(!deletePost) return res.status(500).json('error in deleting post')
    
    return res.status(200).json('post deleted')

})



module.exports = {

    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getUserPosts,
    getPost,
}