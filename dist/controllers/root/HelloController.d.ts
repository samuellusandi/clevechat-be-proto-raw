import { BaseController } from '../BaseController';
import { NextFunction, Request, Response } from 'express';
export declare class HelloController implements BaseController {
    handle(req: Request, res: Response, next: NextFunction): void;
}
