// Import the Express module
const express = require('express');
const helmet = require('helmet'); // Import Helmet
const rateLimit = require('express-rate-limit'); // Import Rate Limit
const ExpressBrute = require('express-brute'); // Import express-brute
const morgan = require('morgan'); // Import Morgan for logging

// Create an instance of Express
const app = express();
const userRoutes = require('./routes/userRoutes'); 

app.use(express.json()); // Middleware for parsing JSON bodies
app.use('/api', userRoutes); 

// Define a port for the server
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(helmet()); // Use Helmet to secure HTTP headers
app.use(express.json()); // Middleware to parse JSON bodies
app.use(morgan('combined')); // Use Morgan to log all HTTP requests 

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter); // Apply rate limiting to all requests

// Set up express-brute store (in-memory store for now, use Redis/Mongo for production)
const store = new ExpressBrute.MemoryStore(); // Use an in-memory store

// Create an express-brute instance
const bruteforce = new ExpressBrute(store, {
    freeRetries: 5,  // Allow 5 attempts
    minWait: 5 * 60 * 1000, // 5 minutes wait after retries are exceeded
    maxWait: 60 * 60 * 1000, // Maximum wait time of 1 hour
    failCallback: (req, res, next, nextValidRequestDate) => {
        res.status(429).send(`Too many requests. Try again at ${nextValidRequestDate}`);
    }
}); 

// Apply express-brute only to sensitive routes, such as creating new todo items or login
app.post('/todolist', bruteforce.prevent, (req, res) => {
    const newTodo = req.body;
    todolist.push(newTodo);
    res.status(201).json(newTodo);
}); 

// Create a basic route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World! Welcome to the Express server.');
});


let todolist = [];

// Get all todolist
app.get('/todolist', (req, res) => {
    res.json(todolist);
});


// Update a todo item by ID
app.put('/todolist/:id', (req, res) => {
    const id = req.params.id;
    const index = todolist.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todolist[index] = req.body;
        res.json(todolist[index]);
    } else {
        res.status(404).json({ message: "Todolist not found" });
    }
});

// Delete a todolist by ID
app.delete('/todolist/:id', (req, res) => {
    const id = req.params.id;
    todolist = todolist.filter(todo => todo.id !== id);
    res.status(204).send();
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});