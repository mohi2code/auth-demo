import validator from 'validator';
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
    return validator.isEmail(email);
}

export function isValidPassword(password) {
    return passwordSchema.validate(password);
}
