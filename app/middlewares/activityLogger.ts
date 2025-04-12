import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models/activityLog.model';

export const activityLogger = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function (body: any): Response {
      ActivityLog.create({
        userId: req.user?.id,
        action,
        details: {
          method: req.method,
          path: req.path,
          body: req.body,
          response: body
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }).catch(console.error);
      
      return originalSend.call(this, body);
    };
    
    next();
  };
};