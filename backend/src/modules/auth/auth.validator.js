const Joi = require('joi')
const registerDataDTO = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name should not be empty"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-])[A-Za-z\d!@#$%&*_-]{8,15}$/).required().messages({
        "string.empty": "Password should not be empty",
        "string.pattern.base": "Password should be at least 8 characters, at least one uppercase letter one digit and a special Character"
    }),
    confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
        "string.empty": "Confirm Password Should not be empty",
        "any.only": "Confirm Password should be same as password"
    }),
    role: Joi.string().regex(/^(user|official)$/).default("user"),


})

const loginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const activationDTO = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(6).max(6).required()
})
const forgotDTO = Joi.object({
    email: Joi.string().email().required()
})

const resetPassDTO = Joi.object({
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-])[A-Za-z\d!@#$%&*_-]{8,15}$/).required().messages({
        "string.empty": "Password should not be empty",
        "string.pattern.base": "Password should be at least 8 characters, at least one uppercase letter one digit and a special Character"
    }),
    confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
        "string.empty": "Confirm Password Should not be empty",
        "any.only": "Confirm Password should be same as password"
    }),
})

const ProfileUpdateDTO = Joi.object({
    name: Joi.string().min(2).max(50).messages({
        "string.empty": "Name should not be empty"
    }),
    email: Joi.string().email().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-])[A-Za-z\d!@#$%&*_-]{8,15}$/).messages({
        "string.empty": "Password should not be empty",
        "string.pattern.base": "Password should be at least 8 characters, at least one uppercase letter one digit and a special Character"
    }),
    confirmPassword: Joi.string().equal(Joi.ref('password')).messages({
        "string.empty": "Confirm Password Should not be empty",
        "any.only": "Confirm Password should be same as password"
    }),
    role: Joi.string().regex(/^(user|host)$/),
})

module.exports = {
    registerDataDTO,
    loginDTO,
    activationDTO,
    forgotDTO,
    ProfileUpdateDTO,
    resetPassDTO
}