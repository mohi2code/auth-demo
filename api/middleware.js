const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const isAuthorized = asyncHandler(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization)
        throw errorMaker(
            {
                msg: 'Authorizatoin header missing',
                name: 'AuthenticationError',
            }
        );

    const token = authorization.split(' ')[1];
    if (!token)
        throw errorMaker(
            {
                msg: 'Token missing',
                name: 'AuthenticationError',
            }
        );

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
});

function errorMaker({ msg, name, status }) {
    const error = new Error(msg);
    name ? error.name = name : 'Error';
    status ? error.status = status : error.status = undefined;

    return error;
}

module.exports = { isAuthorized }
 