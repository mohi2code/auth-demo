const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const cloudinary = require('cloudinary');
const asyncHandler = require('express-async-handler');
const db    = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { isAuthorized } = require('./middleware');
const {
    registerSchema,
    profileUpdateSchema,
    passwordUpdateSchema
} = require('./schemas');

const router = express.Router();
const users = db.get('users');
cloudinary.config({
    URL: process.env.CLOUDINARY_URL
});
passport.use(new GoogleStrategy({
    clientID: '1053675835113-528ojs68fsqnptf7jn5heu6r7bfb5p2s.apps.googleusercontent.com',
    clientSecret: 'UKNN8y4H5YcnDbhjtPOrLt04',
    callbackURL: process.env.NODE_ENV == "production" ? "https://auth-local-oauth.herokuapp.com/auth/google/callback" : "/api/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const { email, given_name } = profile;
            const user = await users.findOne({ email });
            if (!user) {
                const doc = await users.insert({ email, name: given_name });
                return done(null, doc);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    async (req, res) => {
        const token = await jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.redirect(`/?token=${token}`)
    }
);

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }),
    (err, user, next) => {
        if (err)
            next(err)
    }
);

router.post('/register', asyncHandler(async (req, res) => {
    const validated = await registerSchema.validateAsync(req.body);
    const tmp = await users.findOne({ email: validated.email });
    if (tmp) 
        throw new Error('User already exists');

    const hashedPassword = bcrypt.hashSync(validated.password, parseInt(process.env.SALT_ROUNDS));
    const user = await users.insert({
        email: validated.email,
        hashedPassword
    });
    res.json({ email: user.email });
}));

router.post('/login', asyncHandler(async (req, res) => {
    const validated = await registerSchema.validateAsync(req.body);
    const user = await users.findOne({ email: validated.email });
    if (!user || !bcrypt.compareSync(validated.password, user.hashedPassword)) 
        throw new Error('Invalid username or password');

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    res.json({ token });
}));

router.get('/profile', isAuthorized, asyncHandler(async (req, res) => {
    const user = await users.findOne({ _id: req.user.id });
    res.json({ ...user, _id: undefined, hashedPassword: undefined });
}));

router.put('/profile', isAuthorized, asyncHandler(async (req, res) => {
    const validated = await profileUpdateSchema.validateAsync(req.body);
    if (validated.email) {
        const user = await users.findOne({ email: validated.email });
        if (user && user._id != req.user.id)
            throw new Error('Email already in use');
    }

    const updated = await users.findOneAndUpdate(
        { _id: req.user.id },
        { $set: {...req.body} }
    );
    res.json({ ...updated, _id: undefined, hashedPassword: undefined });
}));

router.put('/profile/password', isAuthorized, asyncHandler(async (req, res) => {
    const validated = await passwordUpdateSchema.validateAsync(req.body);
    const user = await users.findOne({ _id: req.user.id });
    if (!bcrypt.compareSync(validated.oldPassword, user.hashedPassword))
        throw new Error('Old password incorrect');

    const hashedPassword = bcrypt.hashSync(validated.newPassword, parseInt(process.env.SALT_ROUNDS));
    const updated = await users.findOneAndUpdate(
        { _id: req.user.id },
        { $set: {hashedPassword} }
    );    
    res.json({ old: validated.oldPassword, newPass: validated.newPassword });
    // res.json({ ...updated, _id: undefined, hashedPassword: undefined });
}));

router.post('/profile/image', isAuthorized, asyncHandler(async (req, res) => {
    const file = req.body.imageUrlEncoded;
    const result = await cloudinary.v2.uploader.upload(file, { folder: 'auth-demo' });
    if (result) {
        const updated = await users.findOneAndUpdate(
            { _id: req.user.id },
            { $set: { avatar: result.url } }
        );
        
        if (updated)
            res.json({ imageURL: result.url });

        console.log(updated);
    } else {
        res.end();
    }
}));

router.post('/test', isAuthorized, asyncHandler(async (req, res) => {
    res.json({
        message: 'Yep you are in',
        email: req.user.email
    });
}));

module.exports = router;
