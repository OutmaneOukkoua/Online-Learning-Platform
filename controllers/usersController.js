const asyncWrapper = require("../middleware/asyncWrapper");
const User = require('../models/usersModel')
const httpStatus = require('../utils/httpStatus');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const GWT = require('jsonwebtoken');
const generateGWT = require("../utils/generateGWT");

const getAllUsers = asyncWrapper( async (req, res) => {

    const query = req.query;
    console.log(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    // get all users from the database using User Model 
    const users = await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
    res.json({status : httpStatus.SUCCESS ,data : {users}});
})

const register = asyncWrapper( async (req, res, next) => {
    const {firstName,lastName,email ,password,role}  = req.body;
    // console.log(req.file);
    const oldUser = await User.findOne({email : email});
    if(oldUser){
        const errs = appError.create('user already exists',400,httpStatus.FAIL)
            return next(errs)
    }
    // hash password before saving it to the database
    const passwordHashed = await bcrypt.hash(password,10);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password:passwordHashed,
        role,
        avatar : req.file.filename
    })

    // generate GWT token
    const token = await generateGWT({email:newUser.email, id:newUser.id, role:newUser.role} ) ;
    newUser.token = token;

    await newUser.save();
    res.status(201).json({status : httpStatus.SUCCESS ,data : {user : newUser}});

})

const login = asyncWrapper( async (req,res,next) => {

    const {email,password} = req.body;

    if(!email && !password){
        const errs = appError.create('email and password are required',400,httpStatus.FAIL)
            return next(errs);
    }

    const  user = await User.findOne({email:email});

    if(!user){
        const errs = appError.create("user not found",400,httpStatus.FAIL);
        return next(errs);
    }

    const matchedPassword =  await bcrypt.compare(password,user.password);

    if(user && matchedPassword){
        // generate GWT token
        const token = await generateGWT({email:user.email, id:user.id, role:user.role} ) ;

        return res.json({status : httpStatus.SUCCESS ,data : {token : token}});
    }
    else{
        const errs = appError.create("Login Invalid",500,httpStatus.ERROR);
        return next(errs);
    }

})

module.exports = {
    getAllUsers,
    register,
    login
}