const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization 
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, decoded) => {
            if (err) {
               
                return res.status(403).json('token is not valid')
            } else {
                const user = await User.findOne({_id:decoded.userId})
                req.user = user
                next()
            }
        })
    } else {

        res.json('not authenticated')
    }
}

module.exports = verifyToken