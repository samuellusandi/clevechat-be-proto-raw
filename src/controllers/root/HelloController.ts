import { BaseController } from '../BaseController';
import { HttpCodes } from '../HttpCodes';

import { NextFunction, Request, Response } from 'express';

export class HelloController implements BaseController {
    public handle(req: Request, res: Response, next: NextFunction): void {
        res.status(HttpCodes.HTTP_OK)
            .send('The only available endpoint is POST /graphql.');
    }
}
