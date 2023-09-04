const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app/routes/auth.route.js']

swaggerAutogen(outputFile, endpointsFiles)