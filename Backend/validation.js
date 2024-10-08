const Joi = require('joi');

// Define schemas
const customerSignupSchema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    surname: Joi.string().min(1).max(30).required(),
    idNumber: Joi.string().regex(/^\d+$/).min(10).max(14).required(),
    accountNumber: Joi.string().regex(/^\d+$/).min(8).max(12).required(),
    password: Joi.string().min(8).required()
});

const customerLoginSchema = Joi.object({
    fullName: Joi.string().min(3).required(),
    accountNumber: Joi.string().regex(/^\d+$/).min(8).max(14).required(),
    password: Joi.string().min(8).required()
});

const paymentSchema = Joi.object({
    fullName: Joi.string().min(3).required(),
    idNumber: Joi.string().regex(/^\d+$/).min(10).max(14).required(),
    accountNumber: Joi.string().regex(/^\d+$/).min(8).max(14).required(),
    swiftCode: Joi.string().alphanum().min(8).max(12).required(),
    paymentAmount: Joi.number().greater(0).required(),
    currency: Joi.string().min(2).required(),
    provider: Joi.string().min(3).required()
});

const employeeSignupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required()
});

const employeeLoginSchema = Joi.object({
    username: Joi.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
    password: Joi.string().min(8).required()
});


// Middleware to validate request body against a provided schema
const validateInput = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: `Invalid input: ${error.details[0].message}` });
        }
        next();
    };
};

// Export schemas and validateInput function
module.exports = {
    customerSignupSchema,
    customerLoginSchema,
    paymentSchema,
    employeeSignupSchema,
    employeeLoginSchema,
    validateInput
};
