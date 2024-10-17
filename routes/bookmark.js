const { addBookmark } = require('../controller/bookmarkController')
const router = require('express').Router()



router.post('/add',addBookmark)





module.exports = router
