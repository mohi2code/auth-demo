const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { registerSchema, profileUpdateSchema } = require('./schemas');
const db    = require('../db/connection');
const users = db.get('users');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { isAuthorized } = require('./middleware');

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

router.post('/test', isAuthorized, asyncHandler(async (req, res) => {
    res.json({
        message: 'Yep you are in',
        email: req.user.email
    });
}));

module.exports = router;
