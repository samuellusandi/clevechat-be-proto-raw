/// <reference types="node" />
import { Application, NextFunction, Request, Response, Router } from 'express';
import { PathParams } from 'express-serve-static-core';
import http from 'http';
export declare type ACTION_TYPES = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'USE';
export declare class App {
    readonly DEFAULT_PORT = 8020;
    private readonly app;
    private readonly router;
    private readonly port;
    constructor(port?: number);
    createRoute(type: ACTION_TYPES, url: PathParams, handler: (request: Request, response: Response, next: NextFunction) => void): void;
    start(callback: () => void): http.Server;
    getPort(): number;
    getApplication(): Application;
    getRouter(): Router;
}
