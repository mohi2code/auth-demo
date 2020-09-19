const jwt = require('jsonwebtoken');
const db = require('monk')('localhost/auth-demo');

const users = db.get('users');

async function isLoggedIn(req, res, next) {
    try {
        if (req.cookies.auth) {
            const email = req.cookies.auth.email;

            if (!email)
                throw new Error('Unauthorized 🔒');

            const doc = await users.findOne({ email });

            if (!doc)
                throw new Error('Unauthorized 🔒');

            next();

        } else {
            throw new Error('Unauthorized 🔒');
        }
    } catch (error) {
        error.status = 401;
        next(error);
    }
}

module.exports = {
    isLoggedIn
}
