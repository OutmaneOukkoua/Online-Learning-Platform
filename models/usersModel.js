const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');

const usersSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email: {
        type : String,  
        unique : true,
        validate : [validator.isEmail,['feild !, must be a valid emeil adress']]
    },
    password : {
        type : String,
        required : true

    },
    token : {
        type :String
    },
    role : {
        type:String, 
        enum : [userRoles.USER,userRoles.ADMIN,userRoles.MANAGER],
        default : userRoles.USER
    },
    avatar : {
        type : String,
        default : 'uploads/avatar.png'
    }
  });


module.exports = mongoose.model('User',usersSchema);