const express = require('express')
const ejs = require('ejs')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./database/connection')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')
const bookmarkRouer = require('./routes/bookmark')
const app = express()
const PORT = process.env.PORT || 4000

dotenv.config()


app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(errorHandler)
app.use(cors({origin:true,credentials:true}))
app.use(session({
  secret: 'this is the secret key',
  resave: false,
  saveUninitialized: true,
}))
app.use(cookieParser())
app.use(express.static('public'));


connectDB()


app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)
app.use('/api/user',userRouter)
app.use('/api/bookmark',bookmarkRouer)


app.listen(PORT, () => {
    console.log('server is running on port',PORT)
})