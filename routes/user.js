const { changeProfileImg } = require('../controller/userControlller')
const { profileImgUpload } = require('../middleware/multer')

const router = require('express').Router()



router.post('/profileImg',profileImgUpload.single('file'), changeProfileImg)


module.exports = router
