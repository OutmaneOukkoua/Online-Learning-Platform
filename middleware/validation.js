const {body} = require("express-validator");
const validation = () =>{
    return [
        body("title")
            .notEmpty()
            .withMessage("title is not require")
            .isLength({min:2})
            .withMessage("title is at list 2 char"),
        body("price")
            .notEmpty()
            .withMessage("price is not require")
        ]
        
}

module.exports = {validation} ;