require('dotenv').config();

const express = require("express");

const cors = require('cors');
const path = require('path');

const app = express();

app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use(cors());

const mongoose = require("mongoose");

const httpStatus = require('./utils/httpStatus');

// Connect to Enligne Server **MongoDB ATLAS** database using Mongoose.
const URL = process.env.MONGOATLAS_URL;

mongoose.connect(URL).then(()=>{
    console.log("connected successfuly");
})

app.use(express.json()); // parse requests of content-type - application/json (bodyParser)

const coursesRouter = require("./routes/cousesRoute");
app.use('/api/courses',coursesRouter);


// users
const usersRouter = require("./routes/usersRoute");
app.use('/api/users',usersRouter);

//global middleware for not found router
app.all('*',(req,res)=>{
    res.json({status : httpStatus.ERROR , message : 'Router NOT FOUND !'});
})

//global error handler
app.use((error,req,res,next)=>{
    res.status(error.statusCode || 400).json(
        {status : error.statusTesxt || httpStatus.ERROR ,data : null , message : error.message ,code : error.statusCode || 400 })
})




app.listen(process.env.PORT || 5000,()=>{
    console.log("listening on port : 5000")
})