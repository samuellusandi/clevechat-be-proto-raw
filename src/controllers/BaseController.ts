import { NextFunction, Request, Response  } from 'express';

export interface BaseController {
    handle: (req: Request, res: Response, next: NextFunction) => void;
}
