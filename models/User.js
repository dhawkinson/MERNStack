// User.js  -- server side model
// The data model for users

const mongoose   = require('mongoose');   //  this is the ODM that allows us to interface with Mongo

// the schema holds the data model for a User
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// export the User model
module.exports = User = mongoose.model('user', UserSchema);
