module.exports = (err, req, res, next) => {
    switch (err.name) {
        case 'ValidationError':
            err.status = 400;
            next(err)
            break;
    
        default:
            next(err);
            break;
    }
}