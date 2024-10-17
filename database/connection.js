const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);


const connectDB = async () => {
  
    try {
         
        let connection = await mongoose.connect(process.env.MONGO_URL,{
             useNewUrlParser: true,
             useUnifiedTopology: true
        });
       
        if (connection) {
            console.log('MOngoDb is connected to server');
        }
      
    } catch (error) {
         console.log(error);
    }
}



module.exports = connectDB