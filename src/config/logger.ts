import log4js from 'log4js';

// Configure Log4js
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'dateFile',
      filename: './logs/app.log',
      pattern: '.yyyyMMdd_hh',
      compress: true,
      numBackups: 24,
    },
  },
  categories: { default: { appenders: ['console', 'file'], level: 'debug' } },
});

// Create a logger instance
const logger =
  process.env.NODE_ENV === 'development'
    ? log4js.getLogger('development') // Use development logger in development mode
    : log4js.getLogger(); // Use default logger in production mode

// Helper function to set the filename dynamically
export const getLogger = (filename: string) => {
  const contextLogger = log4js.getLogger(filename); // Create a logger with the filename as the category
  contextLogger.addContext('filename', filename); // Add the filename to the context
  return contextLogger;
};

export default logger;
