import express from 'express';
import { PORT } from './config';
import { getLogger } from './config/logger';
import { API_BASE_URL } from './constants';
import { errorHandler } from './middleware';
import { setupRoutes } from './routes';
import { setupSwagger } from './swagger';

const logger = getLogger('app.ts');

const app = express();

app.use(express.json());

setupRoutes(app);
setupSwagger(app);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`);
  logger.info(
    `Swagger UI is available at http://localhost:${PORT}${API_BASE_URL}/docs`
  );
});
