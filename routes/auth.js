const epxress = require('express');
const router = epxress.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('monk')('localhost/auth-demo');

const users = db.get('users');

const registerSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"))
        .required(),

    password_repeat: Joi.ref('password'),

})
    .with('password', 'password_repeat');

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"))
        .required(),
})
    .with('email', 'password');

router.post('/register', async (req, res, next) => {
    try {
        const value = await registerSchema.validateAsync(req.body);
        const doc = await users.findOne({ email: value.email });
        if (!doc) {
            const password_hash = bcrypt.hashSync(value.password, 10);
            const user = await users.insert({
                email: value.email,
                password: password_hash
            });
            res.render('login', { email: '', password: '', err: '' });
        } else {
            throw new Error('User Already Exists !');
        }
    }
    catch (err) {
        res.render('register', { err: err.message });
    }
});

router.get('/register', (req, res, next) => {
    res.render('register', { err: '' });
});

router.post('/login', async (req, res, next) => {
    try {
        const value = await loginSchema.validateAsync(req.body);
        const doc = await users.findOne({ email: value.email });
        if (doc) {
            const match = bcrypt.compareSync(value.password, doc.password);
            if (match) {
                const token = jwt.sign({ email: doc.email }, 'key');
                res.redirect(`/?token=${token}`);
            } else {
                throw new Error('Email or password incorrect !');
            }
        } else {
            throw new Error('Email or password incorrect !');
        }
    } catch (error) {
        res.render('login', { email: '', password: '', err: error.message });
    }
});

router.get('/login', (req, res, next) => {
    res.render('login', { email: '', password: '', err: '' });
});

module.exports = router;