const JWT = require('jsonwebtoken');
const appError = require('../utils/appError');
const httpStatus = require('../utils/httpStatus');

const verifyToken = (req,res,next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json('token is required');
    }
    const token = authHeader.split(' ')[1];
    try{
        const curretToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
        // console.log('curretToken =>',curretToken)
        req.userData= curretToken;        
        next();
    } catch(err){
        const errs = appError.create('invalid token',400,httpStatus.ERROR);
            return next(errs)
    }
}
module.exports =  verifyToken;