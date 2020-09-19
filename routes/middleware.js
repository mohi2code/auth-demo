const jwt = require('jsonwebtoken');
const db = require('monk')('localhost/auth-demo');

const users = db.get('users');

async function isLoggedIn(req, res, next) {
    try {
        console.log(req.locals);
        if (req.headers['authorization']) {
            const token = req.headers['authorization'].split(' ')[1];
            if (!token)
                throw new Error('Unauthorized 🔒');
            await jwt.verify(token, 'key', async (err, token) => {
                if (err)
                    throw new Error('Invalid Token');
                const user = await users.findOne({ email: token.email });
                if (!user)
                    throw new Error('Unauthorized 🔒');
                next();
            });
        } else {
            throw new Error('Unauthorized no token specified 🔒');
        }
    } catch (error) {
        error.status = 401;
        next(error);
    }
}

module.exports = {
    isLoggedIn
}
