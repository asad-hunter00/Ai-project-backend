/**
 * O‘ktam ota choyxonasi - Global Error Handler Middleware
 */
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Do not log request bodies, passwords or bearer tokens.

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Ma‘lumotlar validatsiyadan o‘tmadi',
      details: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof Error) {
    const isPermissionError = 
      err.message.includes('Ruxsat cheklangan') || 
      err.message.includes('administrator');
    
    const isNotFound = err.message.includes('topilmadi');

    const status = isPermissionError ? 403 : isNotFound ? 404 : 400;

    res.status(status).json({
      success: false,
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Ichki server xatoligi yuz berdi',
  });
}
