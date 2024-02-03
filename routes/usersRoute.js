const express = require("express");

const multer = require('multer');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`; 
        cb(null, fileName);
      }
})
const fileFilter = (req , file ,cb)=>{
    const imageType = file.mimetype.split('/')[0];
    if(imageType == 'image'){
        cb(null, true);
    }else{
        cb(appError.create('file must be an image',400), false);
    }
}
const upload = multer({ storage: diskStorage,
    fileFilter: fileFilter });

const router = express.Router();

const usersControllers = require('../controllers/usersController');
const verifyToken = require("../middleware/verifyToken");
const appError = require("../utils/appError");

router.get('/', verifyToken, usersControllers.getAllUsers);

router.post('/register', upload.single('avatar'), usersControllers.register);

router.get('/login', usersControllers.login);

module.exports = router;

