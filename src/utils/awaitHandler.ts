import type { NextFunction, Request, Response } from 'express';

export const awaitHandler = (fn: (...args: any[]) => any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
