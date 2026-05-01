const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // Logging incoming requests

// API Versioning (v1)
const v1Router = express.Router();

v1Router.use('/auth', require('./routes/authRoutes'));
v1Router.use('/users', require('./routes/userRoutes'));
v1Router.use('/tasks', require('./routes/taskRoutes'));
v1Router.use('/admin', require('./routes/adminRoutes'));

// Mount all v1 routes under /api/v1
app.use('/api/v1', v1Router);

// Global Error Handler (Must be at the very end)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));