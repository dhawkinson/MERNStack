// db.js -- server side
// db connection logic -- separated to this file to keep thing lean and mean

const mongoose  = require('mongoose');      // require mongoose ODM library
const config    = require('config');        // require the config module for connection details
const db        = config.get('mongoURI');   // get the mongo connection string from config

// declare the connection function with async / await which will resolve the promise returned
const connectDB = async () => {
    // success block
    try {
        await mongoose.connect(db, { 
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        });
        //  Connect is successful
        console.log('MongoDB Connected...');
      // error block
    } catch(err) {
        console.error(err.message);
        //  Exit process with failure
        process.exit(1);
    }
}

// export the resolved connection
module.exports = connectDB;