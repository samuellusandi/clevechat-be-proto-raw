import { BaseController } from '../BaseController';
import { HttpCodes } from '../HttpCodes';

import { NextFunction, Request, Response } from 'express';

export class NotFoundController implements BaseController {
    public handle(req: Request, res: Response, next: NextFunction): void {
        res.status(HttpCodes.HTTP_NOT_FOUND);
        res.send('No such resource.');
    }
}
