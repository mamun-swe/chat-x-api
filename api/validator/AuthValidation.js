const validator = require('validator')

// Register validation
const RegisterValidation = user => {
    let error = {}

    if (!user.userName) {
        error.userName = "Username is required"
    } else if (user.userName.length < 5) {
        error.userName = "Username must be greater than 5 character"
    }

    if (!user.email) {
        error.email = "E-mail is required"
    } else if (!validator.isEmail(user.email)) {
        error.email = "Address isn't valid"
    }

    if (!user.password) {
        error.password = "Password is required"
    } else if (user.password.length < 8) {
        error.password = "Password must be greater than 5 character"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


// Login validation
const LoginValidation = user => {
    let error = {}

    if (!user.email) {
        error.email = "E-mail is required"
    } else if (!validator.isEmail(user.email)) {
        error.email = "Address isn't valid"
    }

    if (!user.password) {
        error.password = "Password is required"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


module.exports = {
    LoginValidation,
    RegisterValidation
}