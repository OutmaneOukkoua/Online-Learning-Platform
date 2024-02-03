// let { courses } = require('../data/courses');

const {validationResult} = require("express-validator");
const Course = require('../models/coursesModel');
const httpStatus = require('../utils/httpStatus');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');


const getAllCourses = async (req, res) => {
    const query = req.query;
    console.log(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    // get all courses from the database using Course Model 
    const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({status : httpStatus.SUCCESS ,data : {courses}});
}

// high order function -- take other function as a parametre
const getCours = asyncWrapper(
        async (req,res,next)=>{
        const course = await Course.findById(req.params.coursId);
        if(!course){
            const errs = appError.createError('cours not found',404,httpStatus.FAIL)
            return next(errs)
            // return res.status(404).json({status : httpStatus.FAIL , data : {course : 'cours not found'}})
        }
        res.json({status : httpStatus.SUCCESS ,data : {course}})
    //    try{ }catch (err){
    //         return res.status(400).json({status : httpStatus.ERROR ,data : null , message : err.message ,code :400 })
    //     }   
    }
)

const addCours = asyncWrapper(
    async (req,res,next)=>{

        const error = validationResult(req);
    
        if(!error.isEmpty()){
            const errs = appError.createError(error.array(),400,httpStatus.FAIL);
            return next(errs);
            // return res.status(400).json({status : httpStatus.FAIL ,data : error.array()});
        }
        const newCours = new Course(req.body);
    
        await newCours.save();
    
        res.status(201).json({status : httpStatus.SUCCESS ,data : {course : newCours}});
    }
) 

const updateCours = asyncWrapper (
    async (req,res)=>{
    const coursId= req.params.coursId;
    
    // findByIdAndUpdate() : return the found document
    let updatedCours = await Course.updateOne({_id :coursId},{$set:{...req.body}});
    return res.status(200).json({status : httpStatus.SUCCESS ,data : {course : updatedCours}});
    // try{} catch(err){
    //     return res.status(400).json({status : httpStatus.ERROR , message : err.message})   }
    
} )

const deleteCours = asyncWrapper (async (req,res)=>{
    
    const coursId = req.params.coursId;
    await Course.deleteOne({_id : coursId});
    return res.status(200).json({status : httpStatus.SUCCESS , data : null});
//    try{ }catch(err){
//         return res.status(400).json({msg : err});
//     }
}
)

module.exports = {
    getAllCourses,
    getCours,
    addCours,
    updateCours,
    deleteCours
}