import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './lib/errorHandler';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'central-server',
            version: '1.0.0',
            description: 'API documentation for QR Code generation and user management',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 4000}/api`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Adjust the path if needed
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI on /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.use(errorHandler);

export default app;
