import * as express from 'express';
import e = require('express');
import { combineRouter } from './router/index';
import { getMetaData, Route } from './utils';

class Application {
    private readonly app: express.Application;

    get instance(): express.Application {
        return this.app;
    }

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.registerRouters();
    }

    private registerRouters() {
        this.app.get('/', (req: express.Request, res: express.Response) => {
            res.json({ message: 'Tags here!' });
        });

        this.attachRouters();
    }

    private attachRouters() {
        combineRouter.forEach((instance: any) => {
            const controllerInstance = new instance();
            const metaData = getMetaData(controllerInstance);
            const controllerPath = metaData.controller;
            const routes = metaData.routes;

            Object.keys(routes).forEach((methodName: string) => {
                const router: any = express.Router();
                const route: Route = routes[methodName];
                const routeMethod = route.method;

                router[routeMethod](route.url, async (req: express.Request, res: express.Response) => {
                    const response = (controllerInstance as any)[methodName](req, res);

                    if (response instanceof Promise) return response.then((data) => res.send(data));
                    res.send(response);
                });

                this.app.use(controllerPath, router);
            })
        })
    }
}

export default new Application();