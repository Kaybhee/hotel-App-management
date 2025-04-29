import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

// Set up Swagger middleware
export const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('📘 Swagger docs available at /api-docs')
}