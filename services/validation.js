const Joi = require('joi');

module.exports.registerSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
        .required()
        .error(() => {
            return new Error('Password must be at least 8 characters long, containing letters, capital letters, numbers and special characters');
        }),

    password_repeat: Joi.ref('password'),

})
    .with('password', 'password_repeat');

module.exports.loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
        .required()
        .error(() => {
            return new Error('Password must be at least 8 characters long, containing letters, capital letters, numbers and special characters');
        }),
})
    .with('email', 'password');