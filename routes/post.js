const { createPost, getAllPosts, getUserPosts ,getPost,deletePost, updatePost} = require('../controller/postController')
const { upload} = require('../middleware/multer')
const router = require('express').Router()



router.post('/add', upload.array('files', 1), createPost)


router.get('/all', getAllPosts)

router.get('/all/:id', getUserPosts)

router.get('/:id', getPost)
router.delete('/:id', deletePost)

router.put('/edit/:postId',upload.array('files', 1), updatePost)




module.exports = router
