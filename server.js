const express = require('express');
const app = express();
const port = 4444;
const { body, validationResult } = require('express-validator');
const swaggerJSDoc = require('swagger-jsdoc'); // Import swagger-jsdoc
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerDefinition = require('./swaggerDefinition.js'); // Import the Swagger definition

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 15,
});

// Define a common Swagger definition for all routes
const commonSwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Your API Documentation',
        version: '1.0.0',
    },
};

// Define Swagger options for automatic route generation
const swaggerOptions = {
    swaggerDefinition: {
        ...commonSwaggerDefinition,
        ...swaggerDefinition, // Import the rest of your Swagger definition
    },
    apis: [__filename], // Specify the current file as the source
};

// Generate the Swagger specification based on the options
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware for request validation using express-validator
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());

// Define a common route description for all routes
/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: API endpoints for managing agents
 */

// Define a GET endpoint for fetching agents
/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Get a list of agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: Successful response with a list of agents
 *       500:
 *         description: Internal Server Error
 */
app.get('/agents', async (req, res) => {
    try {
        // Get a database connection from the pool
        const conn = await pool.getConnection();

        // Perform the SQL query
        const rows = await conn.query('SELECT * FROM agents');

        // Release the database connection
        conn.release();

        // Define the response header (JSON)
        res.setHeader('Content-Type', 'application/json');

        // Send the response with the rows as JSON
        res.json(rows);
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

// Define a POST endpoint for creating an agent
/**
 * @swagger
 * /agents:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AGENT_CODE:
 *                 type: string
 *               AGENT_NAME:
 *                 type: string
 *             required:
 *               - AGENT_CODE
 *               - AGENT_NAME
 *     responses:
 *       200:
 *         description: Agent created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal Server Error
 */
app.post('/agents', [
    body('AGENT_CODE').isString(),
    body('AGENT_NAME').isString(),
    // Add validation rules for other fields as needed
    validateRequest, // Middleware to check validation errors
], async (req, res, next) => {
    try {
        // Implement logic to create an agent
        // ...
        res.send('Agent created successfully');
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

// Define a PATCH endpoint for updating an agent
/**
 * @swagger
 * /agents/{id}:
 *   patch:
 *     summary: Update an agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the agent to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AGENT_NAME:
 *                 type: string
 *             required:
 *               - AGENT_NAME
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal Server Error
 */
app.patch('/agents/:id', [
    body('AGENT_NAME').isString(),
    // Add validation rules for other fields as needed
    validateRequest, // Middleware to check validation errors
], async (req, res, next) => {
    try {
        // Implement logic to update an agent
        // ...
        res.send('Agent updated successfully');
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

/**
 * @swagger
 * /agents/{id}:
 *   put:
 *     summary: Replace an agent
 *     description: Replace an agent by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the agent to replace
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: New agent data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agent'  # Define the schema for Agent
 *     responses:
 *       200:
 *         description: Agent replaced successfully
 *       404:
 *         description: Agent not found
 */

app.put('/agents/:id', [
    body('AGENT_NAME').isString(),
    // Add validation rules for other fields as needed
    validateRequest, // Middleware to check validation errors
], async (req, res, next) => {
    try {
        // Implement logic to replace an agent
        // ...
        res.send('Agent replaced successfully');
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

/**
 * @swagger
 * /agents/{id}:
 *   delete:
 *     summary: Delete an agent
 *     description: Delete an agent by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the agent to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 *       404:
 *         description: Agent not found
 */
app.delete('/agents/:id', async (req, res, next) => {
    try {
        // Implement logic to delete an agent
        // ...
        res.send('Agent deleted successfully');
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get a list of companies
 *     description: Retrieve a list of companies.
 *     responses:
 *       200:
 *         description: A list of companies
 *       404:
 *         description: Companies not found
 */
app.get('/companies', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM company');
        conn.release();
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});
/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get a list of customers
 *     description: Retrieve a list of customers.
 *     responses:
 *       200:
 *         description: A list of customers
 *       404:
 *         description: Customers not found
 */
app.get('/customers', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM customer');
        conn.release();
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get a list of orders
 *     description: Retrieve a list of orders.
 *     responses:
 *       200:
 *         description: A list of orders
 *       404:
 *         description: Orders not found
 */
app.get('/orders', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM orders');
        conn.release();
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});
// Start the Express server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});