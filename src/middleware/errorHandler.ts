import type { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import { ErrorResponse } from '../utils/ApiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack); // Log the error stack trace
  ErrorResponse.send(res, err.message, 500);
};
