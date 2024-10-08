const express = require('express');
const { client } = require("../Backend/db/db.js");
const cors = require('cors');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const app = express();

// Import validation schemas and middleware
const {
    customerSignupSchema,
    customerLoginSchema,
    paymentSchema,
    employeeSignupSchema,
    employeeLoginSchema,
    validateInput
} = require('./validation');

const allowedOrigins = ['https://localhost:4659'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
let db;
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('BankingSystem');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

connectToDatabase();

// Customer Functions
// Signup Endpoint with validation middleware
app.post('/signup', validateInput(customerSignupSchema), async (req, res) => {
    try {
        const { name, surname, idNumber, accountNumber, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const userModel = {
            fullName: `${name} ${surname}`,
            idNumber,
            accountNumber,
            password: hashedPassword,
        };

        const usersCollection = db.collection('users');
        const result = await usersCollection.insertOne(userModel);
        const userID = result.insertedId;

        res.status(201).json({
            message: `Welcome ${userModel.fullName}`,
            data: {
                userID,
                fullName: userModel.fullName,
                idNumber: userModel.idNumber,
                accountNumber: userModel.accountNumber,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login Endpoint with validation middleware
app.post('/login', validateInput(customerLoginSchema), async (req, res) => {
    try {
        const { fullName, accountNumber, password } = req.body;
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ fullName, accountNumber });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: `Welcome back, ${user.fullName}`,
            userID: user._id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Payments Endpoint with validation middleware
app.post('/payments', validateInput(paymentSchema), async (req, res) => {
    try {
        const { fullName, idNumber, accountNumber, swiftCode, paymentAmount, currency, provider } = req.body;

        const paymentModel = {
            fullName,
            idNumber,
            accountNumber,
            swiftCode,
            paymentAmount,
            currency,
            provider,
            status: 'Pending'
        };

        const paymentsCollection = db.collection('payments');
        const result = await paymentsCollection.insertOne(paymentModel);
        const paymentID = result.insertedId;

        res.status(201).json({
            message: 'Payment information successfully recorded',
            paymentID,
            data: paymentModel
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Employee Functions
// Employee Signup Endpoint with validation middleware
app.post('/employee/signup', validateInput(employeeSignupSchema), async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const employeeModel = { username, password: hashedPassword };

        const employeesCollection = db.collection('employees');
        const result = await employeesCollection.insertOne(employeeModel);
        const employeeID = result.insertedId;

        res.status(201).json({ message: `Employee ${username} successfully registered`, employeeID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Employee Login Endpoint with validation middleware
app.post('/employee/login', validateInput(employeeLoginSchema), async (req, res) => {
    try {
        const { username, password } = req.body;
        const employeesCollection = db.collection('employees');
        const employee = await employeesCollection.findOne({ username });

        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: `Welcome back, ${employee.username}`, employeeID: employee._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = app;
