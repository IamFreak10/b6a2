import { NextFunction, Request, Response } from 'express';
import config, { jwt } from '../config';
import { JwtPayload } from 'jsonwebtoken';

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(500).json({
          messsage: 'You are not authenticated',
        });
      }
      const decodedToken = jwt.verify(
        token,

        config.jwtsecret as string
      ) as JwtPayload;
      req.user = decodedToken;
      if (!roles.includes(decodedToken.role)) {
        return res.status(403).json({
          sucess: false,
          message: 'You Do not Have Permission',
        });
      }

      next();
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  };
};
export default auth;
