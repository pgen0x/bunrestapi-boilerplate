import type { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import jsonSchema from '../prisma/json-schema/json-schema.json';
import { API_BASE_URL } from './constants';

type Definitions = {
  [key: string]: any; // or whatever type you expect the properties to be
};

const definitions: Definitions = Object.keys(jsonSchema.definitions).reduce(
  (acc: Definitions, title: string) => {
    acc[title] = {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
        statusCode: {
          type: 'number',
        },
        message: {
          type: 'string',
        },
        data: {
          type: 'array',
          items: (jsonSchema.definitions as any)[title],
        },
        timestamp: {
          type: 'string',
        },
      },
    };
    return acc;
  },
  {}
);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bun API',
      version: '1.0.0',
      description: 'API documentation for Bun boilerplate',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8888}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...definitions,
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            statusCode: {
              type: 'number',
            },
            message: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
            timestamp: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    `${API_BASE_URL}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};
