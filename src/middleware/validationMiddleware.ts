import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ErrorResponse } from '../utils/ApiResponse';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userSchema.parse(req.body); // Validate the request body
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      ErrorResponse.send(
        res,
        'Validation failed',
        400,
        error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      );
    } else {
      ErrorResponse.send(res, 'Unexpected validation error', 500);
    }
  }
};
