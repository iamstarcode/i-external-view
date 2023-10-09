import swaggerJsdoc from 'swagger-jsdoc'
const port = process.env.PORT || 3000;
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'zuri shop external  API',
            version: '1.0.0',
            description: 'A simple Express API',
        },
        servers: [

            {
                url: 'https://i-external-view-production.up.railway.app/api/v1',
            },
            {
                url: `http://localhost:${port}/api/v1`,
            },
        ],
    },
    apis: ['./src/controllers/*'],
}

export const swaggerSpec = swaggerJsdoc(options)