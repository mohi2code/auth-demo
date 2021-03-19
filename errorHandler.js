module.exports = (err, req, res, next) => {
    switch (err.name) {
        case 'ValidationError':
            err.status = 400;
            next(err)
            break;

        case 'TokenExpiredError':
            err.status = 401;
            next(err);
            break;

        case 'AuthenticationError':
        case 'JsonWebTokenError':    
            err.status = 403;
            next(err);
            break;
    
        default:
            next(err);
            break;
    }
}
