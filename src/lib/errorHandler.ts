import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If a status code wasn't set before the error was thrown, default to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  
  res.json({
    message: err.message,
    // In production, avoid exposing the full error stack for security reasons
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
