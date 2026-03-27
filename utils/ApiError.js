class ApiError extends Error{
    constructor (
        statusCode,
        message="something went worng",
        errors = [],
        stact = ""
    ){
        super(message)
        this.statusCode= statusCode
        this.errors  = errors
        this.data = null
        this.message = message
        if (this.stack) {
            this.stack = stact;
        }else{
Error.captureStackTrace(this , this.contructor)
        }
    }
}

export{ApiError}