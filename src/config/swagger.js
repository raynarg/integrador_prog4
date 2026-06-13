import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gestión de Cursos - Integrador Prog 4',
            version: '1.0.0',
            description: 'Documentación de la API para el sistema de gestión de cursos y estudiantes.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
    },
    // Archivos que contienen las anotaciones de Swagger
    apis: ['./src/routes/*.js', './src/app.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
