import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { initializeDatabase } from './database/connection';
import { errorHandler } from './middleware/validation';
import { CompteBancaireController } from './adapters/driving/compteBancaireController';
import { EntrepriseController } from './adapters/driving/entrepriseController';
import { CompteBancaireService } from './services/compteBancaire.service';
import { EntrepriseService } from './services/entreprise.service';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(express.json());

// Read OpenAPI spec
const openApiPath = path.join(__dirname, '../openapi.yaml');
const openApiContent = fs.readFileSync(openApiPath, 'utf-8');
const openApiSpec = YAML.parse(openApiContent);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Routes via controllers
const compteBancaireController = new CompteBancaireController(
  CompteBancaireService
);
compteBancaireController.registerRoutes(app);

const entrepriseController = new EntrepriseController(EntrepriseService);
entrepriseController.registerRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;
