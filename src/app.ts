import express from 'express';
import session from 'express-session';
import { PORT } from './config';
import { getLogger } from './config/logger';
import { API_BASE_URL } from './constants';
import { errorHandler } from './middleware';
import { setupRoutes } from './routes';
import { setupSwagger } from './swagger';
import { checkDatabaseConnection } from './utils/checkDatabase';

const logger = getLogger('app.ts');

const app = express();

app.use(express.json());

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

app.use(session(sessionConfig));

setupRoutes(app);
setupSwagger(app);

await checkDatabaseConnection();

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(` Server is running on http://localhost:${PORT}`);
  logger.info(
    `Swagger UI is available at http://localhost:${PORT}${API_BASE_URL}/docs`
  );
});
