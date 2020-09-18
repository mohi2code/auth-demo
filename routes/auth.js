const epxress = require('express');
const router = epxress.Router();

router.post('/register', (req, res, next) => {
    res.json({
        message: "Registering 🔑"
    });
});

module.exports = router;