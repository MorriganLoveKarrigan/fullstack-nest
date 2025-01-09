import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] - ${req.method} ${req.url}`);
    console.log('Client IP:', req.ip);
    console.log('Query Params:', req.query);
    console.log('Route Params:', req.params);
    console.log('Body:', req.body);

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });

    res.on('error', err => {
      console.error('Response Error:', err);
    });

    next();
  }
}
