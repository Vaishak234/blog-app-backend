const router = require('express').Router()
const { verify } = require('jsonwebtoken')
const { googleLogin, signUp, login, refresh,getFn, logout, emailLogin, verifyEmailToken, changeProfilePic } = require('../controller/authController')
const User = require('../models/User')
const verifyToken = require('../middleware/verifyJwtToken')



router.post('/signup', signUp)
router.get('/get',verifyToken , getFn)
router.post('/login', login)
router.post('/login/change-profilePic',changeProfilePic )

router.get('/logout', logout)
router.post('/google-login', googleLogin)
router.get('/refresh',refresh)

router.post('/login-email',emailLogin )
router.get('/:id/verify/:token',  verifyEmailToken )






module.exports = router

