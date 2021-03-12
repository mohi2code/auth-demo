const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { registerSchema } = require('./schemas');
const db    = require('../db/connection');
const users = db.get('users');
const bcrypt = require('bcrypt');

router.post('/', asyncHandler(async (req, res) => {
    const validated = await registerSchema.validateAsync(req.body);
    const tmp = await users.findOne({ email: validated.email });
    if (tmp) 
        throw new Error('User already exists');

    const hashedPassword = bcrypt.hashSync(validated.password, parseInt(process.env.SALT_ROUNDS));
    const user = await users.insert({
        email: validated.email,
        hashedPassword
    });
    res.json(user);
}));

module.exports = router;