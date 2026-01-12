import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { initializeDatabase } from './database/connection';
import { errorHandler } from './middleware/validation';
import entrepriseRoutes from './routes/entreprise.routes';
import compteBancaireRoutes from './routes/compteBancaire.routes';

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

// Routes
app.use('/api/entreprise', entrepriseRoutes);
app.use('/api/bankAccount', compteBancaireRoutes);

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
