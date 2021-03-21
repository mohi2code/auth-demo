import validator from 'validator';
import Joi from 'joi';
import passwordValidator from 'password-validator';
 
export const passwordSchema = new passwordValidator();
 
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
   
export function isValidEmail(email) {
    return Joi.object({
        email: Joi.string()
            .custom((value, helpers) => {
                if (!validator.isEmail(value))
                    return helpers.message('Please enter a valid email address')

                return value
            })
            .required()
    }).validate({ email })
}

export function isValidPassword(password) {
    return passwordSchema.validate(password);
}

export function isValidName(name) {
    return Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .custom((value, helpers) => {
                if (!validator.isAlpha(value))
                    return helpers.message('Name should only contain letters and no spaces')

                return value
            })
            .required()
    }).validate({ name })
}

export function isValidBio(bio) {
    return Joi.object({
        bio: Joi.string()
            .allow(null, '')
            .max(300)
            .custom((value, helpers) => {
                return validator.blacklist(value, '\\[\\]')
            })
            .required()
    }).validate({ bio })
}

export function isValidPhone(phone) {
    return Joi.object({
        phone: Joi.string()
            .custom((value, helpers) => {
                if (!validator.isMobilePhone(value))
                    return helpers.message('Please enter a valid phone number')

                return value
            })
            .required()
    }).validate({ phone })
}
