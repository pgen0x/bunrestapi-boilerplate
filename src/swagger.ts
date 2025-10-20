import 'dotenv/config';
import type { Express, NextFunction, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import jsonSchema from '../prisma/json-schema/json-schema.json';
import { getLogger } from './config/logger';
import { API_BASE_URL, API_URL } from './constants';

const logger = getLogger('swagger.ts');

type Definitions = {
  [key: string]: any;
};

// Transform the schema to proper OpenAPI format
const transformSchemaType = (schema: any): any => {
  if (!schema) return schema;

  // Handle array of types (nullable fields)
  if (Array.isArray(schema.type)) {
    const nonNullTypes = schema.type.filter((t: string) => t !== 'null');
    return {
      ...schema,
      type: nonNullTypes.length === 1 ? nonNullTypes[0] : nonNullTypes[0],
      nullable: true,
    };
  }

  // Fix $ref paths from #/definitions/ to #/components/schemas/
  if (schema.$ref && typeof schema.$ref === 'string') {
    return {
      ...schema,
      $ref: schema.$ref.replace('#/definitions/', '#/components/schemas/'),
    };
  }

  // Recursively transform nested objects
  if (schema.properties) {
    const transformedProperties: any = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      transformedProperties[key] = transformSchemaType(value as any);
    }
    return {
      ...schema,
      properties: transformedProperties,
    };
  }

  // Handle arrays with items
  if (schema.items) {
    return {
      ...schema,
      items: transformSchemaType(schema.items),
    };
  }

  return schema;
};

// Transform definitions to proper OpenAPI format
const definitions: Definitions = Object.keys(jsonSchema.definitions).reduce(
  (acc: Definitions, title: string) => {
    const schema = (jsonSchema.definitions as any)[title];
    acc[title] = transformSchemaType(schema);

    // Wrap in response format
    acc[`${title}Response`] = {
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
          type: 'object',
          properties: {
            [title.toLowerCase()]: {
              type: 'array',
              items: transformSchemaType(acc[title]), // Apply transformation to ensure refs are correct
            },
            totalCount: {
              type: 'integer',
            },
            totalPages: {
              type: 'integer',
            },
            currentPage: {
              type: 'integer',
            },
          },
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
      },
    };
    return acc;
  },
  {}
);

const getSwaggerSpec = () => {
  // Generate the Swagger spec fresh each time to ensure it's up to date
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Skyiq API',
        version: '1.0.0',
        description: 'API documentation for Skyiq API',
      },
      servers: [
        {
          url: API_URL,
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
                format: 'date-time',
              },
            },
          },
          PaginatedResponse: {
            type: 'object',
            properties: {
              totalCount: {
                type: 'integer',
                description: 'Total number of records',
              },
              totalPages: {
                type: 'integer',
                description: 'Total number of pages',
              },
              currentPage: {
                type: 'integer',
                description: 'Current page number',
              },
            },
          },
        },
      },
    },
    // Be more explicit with file paths to ensure all API docs are found
    apis: [
      './src/controllers/*.ts',
      './src/controllers/**/*.ts',
      './src/routes/*.ts',
      './src/routes/**/*.ts',
    ],
  };

  try {
    const spec = swaggerJsdoc(options);
    return spec;
  } catch (error) {
    logger.error('Error generating Swagger documentation:', error);
    return {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation Error',
        version: '1.0.0',
        description:
          'Failed to generate API documentation. Please check server logs.',
      },
      paths: {},
    };
  }
};

export const setupSwagger = (app: Express) => {
  // Configure Swagger UI with cache-busting options
  const swaggerUiOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      responseInterceptor: (response: any) => {
        // This helps ensure fresh content is loaded
        response.headers['Cache-Control'] = 'no-store';
        return response;
      },
      // Force the UI to always fetch the latest API spec
      url: `${API_BASE_URL}/swagger.json`,
    },
  };

  // Generate a fresh spec each time the docs are requested
  app.get(`${API_BASE_URL}/swagger.json`, (req: Request, res: Response) => {
    const spec = getSwaggerSpec();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.send(spec);
  });

  app.use(
    `${API_BASE_URL}/docs`,
    (req: Request, res: Response, next: NextFunction) => {
      // Add cache control headers to prevent browser caching
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup({}, swaggerUiOptions)
  );
};
