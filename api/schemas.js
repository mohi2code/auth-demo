const Joi = require('joi');
const passwordValidator = require('password-validator');
 
const schema = new passwordValidator();
 
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const registerSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
        .custom((value, helpers) => {
            if (!schema.validate(value))
                return helpers.message('password must be at least 8 characters containing lower ,uppercase letters and numbers');

            return value;
        })
        .required()
})
    .with('email', 'password');

module.exports = {
    registerSchema
}    
