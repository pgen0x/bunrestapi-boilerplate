import prisma from '../../prisma/client';
import { getLogger } from '../config/logger';

const logger = getLogger('app.ts');

// Check db prisma connection
export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Failed to connect to the database', error);
    process.exit(1); // Exit the app if database connection fails
  }
};
