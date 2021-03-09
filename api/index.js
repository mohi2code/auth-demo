const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { registerSchema } = require('./schemas');

router.post('/', asyncHandler(async (req, res) => {
    const value = await registerSchema.validateAsync(req.body);
    res.json(value);
}));

module.exports = router;