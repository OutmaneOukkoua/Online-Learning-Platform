const express = require("express");

const router = express.Router();

const coursControllers = require('../controllers/coursControllers');

const {validation} = require('../middleware/validation');
const verifyToken = require("../middleware/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middleware/allowedTo");

router.get('/',coursControllers.getAllCourses)

router.get('/:coursId',coursControllers.getCours)

router.post('/',verifyToken,allowedTo(userRoles.MANAGER),validation(),coursControllers.addCours)

router.patch('/:coursId',coursControllers.updateCours)

router.delete('/:coursId',verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),coursControllers.deleteCours)


module.exports = router;
