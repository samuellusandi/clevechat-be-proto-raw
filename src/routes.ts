import { HelloController } from './controllers/root/HelloController';
import { NotFoundController } from './controllers/root/NotFoundController';
import { App } from './core/App';
import { DefaultLogger } from './core/Logger';

import { NextFunction, Request, Response } from 'express';

const controllers = {
    HelloController: new HelloController(),
    NotFoundController: new NotFoundController(),
};

export default function createRoutes(app: App): void {
    app.createRoute('GET', '/', (req: Request, res: Response, next: NextFunction) =>
        controllers.HelloController.handle(req, res, next)
    );
    app.createRoute('GET', '*', (req: Request, res: Response, next: NextFunction) =>
        controllers.NotFoundController.handle(req, res, next)
    );
}
