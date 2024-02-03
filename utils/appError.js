class appError extends Error {
    constructor(){
        super();
    }
    create(message,statusCode,statusTesxt){
        this.message = message;
        this.statusCode= statusCode;
        this.statusTesxt = statusTesxt;
        return this ; // return a value of createError;
    }
}

module.exports = new appError;