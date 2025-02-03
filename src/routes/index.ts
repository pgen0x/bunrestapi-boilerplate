import { Router } from 'express';
import type { Express } from 'express-serve-static-core';
import { getLogger } from 'log4js';
import { API_BASE_URL } from '../constants';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { authMiddleware, validateUser } from '../middleware';
import { awaitHandler } from '../utils/awaitHandler';
const logger = getLogger('routes/index.ts'); // Pass the filename here

const router = Router();

router.get(
  '/health',
  awaitHandler(async (req, res) => {
    /**
     * @swagger
     * /api/v1/health:
     *   get:
     *     summary: Health check - can be called by load balancer to check health of REST API
     *     description: Returns a simple text response
     *     responses:
     *       200:
     *         description: A successful response
     *         content:
     *           text/plain:
     *             example: 'OK'
     */
    logger.debug(`${req.protocol}, ${req.ip}, ${req.originalUrl}`);
    res.sendStatus(200);
  })
);

router.post(
  '/auth/register',
  validateUser,
  awaitHandler(AuthController.register)
);
router.post('/auth/login', awaitHandler(AuthController.login));

router.get(
  '/users',
  authMiddleware(['USER']),
  awaitHandler(UserController.getUsers)
);

export const setupRoutes = (app: Express) => {
  app.use(API_BASE_URL, router);
};
