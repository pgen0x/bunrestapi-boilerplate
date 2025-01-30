import type { Response } from 'express';

/**
 * Standardized success response format
 */
export class SuccessResponse {
  static send(
    res: Response,
    data: any,
    message: string = 'Operation completed successfully',
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Standardized error response format
 */
export class ErrorResponse {
  static send(
    res: Response,
    message: string = 'An unexpected error occurred',
    statusCode: number = 500,
    errorDetails?: any
  ): Response {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error: errorDetails || null,
      timestamp: new Date().toISOString(),
    });
  }
}
