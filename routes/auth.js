const epxress = require('express');
const router = epxress.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const db = require('monk')('localhost/auth-demo');

const users = db.get('users');

const schema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"))
        .required(),

    password_repeat: Joi.ref('password'),

})
    .with('password', 'password_repeat');

router.post('/register', async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body);
        const doc = await users.findOne({ email: value.email });
        if (!doc) {
            const password_hash = bcrypt.hashSync(value.password, 10);
            const user = await users.insert({
                email: value.email,
                password: password_hash
            });
            res.json(user);
        } else {
            throw new Error('User Already Exists !');
        }
    }
    catch (err) {
        res.json(err.message);
    }
});

router.get('/register', (req, res, next) => {
    res.render('register')
});

router.get('/login', (req, res, next) => {
    res.render('login')
});

module.exports = router;