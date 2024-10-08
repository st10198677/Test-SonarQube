const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Signup route
router.post('/signup', [
    check('name').isAlpha().withMessage('Name must contain only letters'),
    check('surname').isAlpha().withMessage('Surname must contain only letters'),
    check('idNumber').isLength({ min: 6 }).withMessage('ID Number must be at least 6 characters long'),
    check('accountNumber').isNumeric().withMessage('Account Number must be numeric'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Your logic for creating a new user, saving to the database, etc.
    res.status(201).json({ message: 'User signed up successfully' });
});

module.exports = router;
