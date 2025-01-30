import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/ApiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      ErrorResponse.send(res, 'Access denied. No token provided.', 401);
      return next(); // Call the next function to continue to the next middleware
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        role: string;
      };
      const userRole = decoded.role;

      // Check if the user's role is allowed
      if (!allowedRoles.includes(userRole)) {
        ErrorResponse.send(
          res,
          'Access denied. Insufficient permissions.',
          403
        );
        return next(); // Call the next function to continue to the next middleware
      }

      // Attach the user ID and role to the request object
      (req as any).user = decoded;
      next(); // Call the next function to continue to the next middleware
    } catch (error) {
      ErrorResponse.send(res, 'Invalid or expired token', 401);
      return next(); // Call the next function to continue to the next middleware
    }
  };
};
