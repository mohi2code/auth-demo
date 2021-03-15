const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { registerSchema } = require('./schemas');
const db    = require('../db/connection');
const users = db.get('users');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

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

    const token = await jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1s'
    });
    res.json({ token });
}));

router.post('/test', asyncHandler(async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
}));

module.exports = router;
