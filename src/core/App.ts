import express, { Application, NextFunction, Request, Response, Router } from 'express';
import { PathParams } from 'express-serve-static-core';

import cors from 'cors';
import http from 'http';

import { UnsupportedMethodException } from '../exceptions/core/UnsupportedMethodException';

export declare type ACTION_TYPES = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'USE';

export class App {
    public readonly DEFAULT_PORT = 8020;

    private readonly app: Application;
    private readonly router: Router;
    private readonly port: number;

    public constructor(port?: number) {
        this.app = express();
        this.router = express.Router();
        this.app.use('/', this.router);
        this.app.use(cors());
        this.port = port === undefined ? this.DEFAULT_PORT : port;
    }

    public createRoute(
        type: ACTION_TYPES,
        url: PathParams,
        handler: (request: Request, response: Response, next: NextFunction) => void
    ): void {
        switch (type) {
            case ('GET'):
                this.router.get(url, handler);
                break;
            case ('POST'):
                this.router.post(url, handler);
                break;
            case ('PUT'):
                this.router.put(url, handler);
                break;
            case ('PATCH'):
                this.router.patch(url, handler);
                break;
            case ('DELETE'):
                this.router.delete(url, handler);
                break;
            case ('USE'):
                this.router.use(url, handler);
                break;
            default:
                throw new UnsupportedMethodException('No such HTTP method.');
        }
    }

    public start(callback: () => void): http.Server {
        return this.app.listen(this.port, callback);
    }

    public getPort(): number {
        return this.port;
    }

    public getApplication(): Application {
        return this.app;
    }

    public getRouter(): Router {
        return this.router;
    }
}
