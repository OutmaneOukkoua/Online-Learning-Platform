const appError = require("../utils/appError");

module.exports = (...roules) => {
    // ...roules : return a table ['ADMIN', 'MANAGER']
    console.log(roules);
    return (req,res,next) => {
        if(!roules.includes(req.userData.role)){
            next(appError.create('this role is not authorized',401))
        }
        next();
    }
}