import { ErrorMessages } from '@app/common-lib';
import { NestMiddleware, NotAcceptableException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AuthGatewayMiddleware implements NestMiddleware {
  public constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const forwardedFromNginx = req.headers['x-forwarded-by-nginx'];

    if (forwardedFromNginx === process.env.NGINX_SECRET) {
      next();
    } else {
      throw new NotAcceptableException(ErrorMessages.DIRECT_ACCESS_NOT_ALLOWED);
    }
  }
}
