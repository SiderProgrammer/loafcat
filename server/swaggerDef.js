const swaggerJsdoc = require('swagger-jsdoc');

// Swagger options
const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the version of OpenAPI (Swagger)
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Documentation for your Express.js API',
    },
  },
  // Specify the files to include in the documentation
  apis: ['./*.js'], // Use the path to your route files
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
