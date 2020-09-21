const epxress = require('express');
const router = epxress.Router();
const { registerSchema, loginSchema } = require('../services/validation');
const bcrypt = require('bcrypt');
const db = require('monk')('localhost/auth-demo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');

const users = db.get('users');

passport.use(new GoogleStrategy({
    clientID: '1053675835113-528ojs68fsqnptf7jn5heu6r7bfb5p2s.apps.googleusercontent.com',
    clientSecret: 'UKNN8y4H5YcnDbhjtPOrLt04',
    callbackURL: "/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        const email = profile.email;
        try {
            const user = await users.findOne({ email });
            if (!user) {
                const doc = await users.insert({ email });
                return done(null, doc);
            }
            return done(null, user);
        } catch (error) {
            return (error);
        }
    }
));

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
            res.redirect('/auth/login');
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
                res.cookie('auth', { email: doc.email });
                res.redirect(`/`);
            } else {
                throw new Error('Email or password incorrect !');
            }
        } else {
            throw new Error('Email or password incorrect !');
        }
    } catch (error) {
        res.render('login', { err: error.message });
    }
});

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        if (!req.user)
            res.redirect('/auth/login');

        res.cookie('auth', { email: req.user.email });
        res.redirect(`/`);
    });

router.get('/login', (req, res, next) => {
    res.render('login', { err: '' });
});

router.post('/logout', (req, res) => {
    res.cookie('auth', null, { maxAge: 0 });
    res.redirect(`/auth/login`);
});

module.exports = router;