const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const crypto = require('crypto')
const sendEmail = require('../utils/sendVerificationEmail');
const { ObjectId } = require('mongodb');

const signUp = asyncHandler(async (req, res) => {
    const { username, email, mobile, password } = req.body
    console.log(req.body);
    if (!mobile || !email || !password) return res.status(500).json('all fields required')
    const userExist = await User.findOne({email})
    if (userExist) return res.status(500).json('user with email exist')
    if(username === userExist?.username) return res.status(500).json('username exist')
    const hashedPassword = await bcrypt.hash(password,10)
    const createUser = await User.create({
        email,
        mobile,
        username,
        password:hashedPassword
    })
  //  if (!createUser) return res.json('cannot register please try again')
    res.status(200).json('User registered successfull')
})

const login = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body
    console.log(req.body);
    if (!mobile || !password) return res.status(500).json('all fields required')
    const userExist = await User.findOne({mobile})
    if (!userExist) return res.status(500).json('user  not registered')
    const comparePassword = await bcrypt.compare(password,userExist.password)
    if (!comparePassword) return res.status(500).json('password doesnt match')
    
    const accessToken = jwt.sign({userId:userExist._id},process.env.ACCESS_SECRET_KEY,{expiresIn:'1m'})
    const refreshToken = jwt.sign({userId: userExist._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '10m' })
    
    return  res.cookie('jwt', refreshToken,
                 {
                     // httpOnly: true,
                     // secure:true,
                     //sameSite: 'none',
                     maxAge:7*24*60*60*1000
                 }
                ).json({ accessToken, userExist })

    

})

const changeProfilePic = asyncHandler(async (req, res) => {
    const { profilePic } = req.body
    console.log(req.body);

    const userExist = await User.findOne({ mobile })
    if (!userExist) return res.status(500).json('user  not registered')

    const profileExist = userExist.profilePic
    if (profileExist) return res.status(500).json('profile already exist')
    
    await User.updateOne({mobile},{profilePic:profilePic})
    return res.status(200).json('profile added on login')
   

    

})
const getFn = asyncHandler(async (req, res) => {
    let users = await User.find()
    console.log(users);
    return res.json(users)

})


const googleLogin = asyncHandler(async (req, res) => {
    
    const { userInfo } = req.body
    console.log(req.body);
    const { email } = userInfo?.data
    console.log(req.body);
    const userExist = await User.findOne({email})
    console.log(userExist);
    if (!userExist) return res.status(500).json('user  not registered')
    
    const accessToken = jwt.sign({ userId: userExist._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '1m' })
    const refreshToken = jwt.sign({userId: userExist._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '10m' })
    
    return  res.cookie('jwt', refreshToken,
                 {
                     // httpOnly: true,
                     // secure:true,
                     //sameSite: 'none',
                     maxAge:7*24*60*60*1000
                 }
                ).json({ accessToken, userExist })


    
})

const logout = asyncHandler(async(req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {
            // httpOnly: true,
            // secure:true,
            //sameSite: none,
    })
    res.json({message:'Cookie cleared'})
    
})

const refresh = asyncHandler(async(req,res) => {
    
    const cookies = req.cookies
    console.log(cookies);
   
    if (!cookies?.jwt) return res.json('unauthorized')
    
    const refreshToken = cookies.jwt
    
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {
        if (decoded) {
            console.log(decoded);
           const userExist = await User.findOne({ _id: decoded.userId })
           if (!userExist) return res.json('not authorized')
        
           const accessToken = jwt.sign({ id: userExist._id ,roles:userExist.roles}, process.env.ACCESS_SECRET_KEY, { expiresIn: '1m' })

           res.json({accessToken})
        } else {
            return res.json('expired')
        }
    })
    
  
})
    
const emailLogin = asyncHandler(async (req, res) => {
      
    const { email } = req.body
    console.log(req.body);
    if (!email ) return res.status(500).json('please enter your email address')
    const userExist = await User.findOne({ email })
    if (!userExist) return res.status(401).json('email not registered ')
    console.log(userExist);
    
    const token = await new Token({
        userId: userExist._id,
        token:crypto.randomBytes(32).toString()
    }).save()

    const url = `${process.env.BASE_URL}/${userExist._id}/verify/${token.token}`
    await sendEmail(userExist.email, "verify email", url)
    
    return res.status(201).send('an email send to your email address please verify')
})

const verifyEmailToken = asyncHandler(async (req, res) => {
    const { id } = req.params
    
    const user = await User.findOne({ _id: id })
    if (!user) return res.status(401).json('invalid  link cant find user')
    console.log(user);
    
    const token = await Token.findOne({ userId :user._id })
    if (!token) return res.status(401).json('invalid link')
    console.log(token);
    
    
    const deleteToken = setTimeout(async() => {
        await Token.deleteOne({ userId: user._id })
    }, 3000)
    
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '1m' })
    const refreshToken = jwt.sign({userId: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '10m' })
    
    return  res.cookie('jwt', refreshToken,
                 {
                     // httpOnly: true,
                     // secure:true,
                     //sameSite: 'none',
                     maxAge:7*24*60*60*1000
                 }
                ).json({msg:'email verified',user,accessToken})

    

})


module.exports = {
    googleLogin,
    signUp,
    login,
    refresh,
    getFn,
    logout,
    emailLogin,
    verifyEmailToken,
    changeProfilePic
}