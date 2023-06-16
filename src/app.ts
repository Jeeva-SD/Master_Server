import * as express from 'express';
import * as cors from 'cors';
import { combineRouter } from './router/index';
import { ApiResult, getMetaData, Route } from './utils';

class Application {
    private readonly app: express.Application;

    get instance(): express.Application {
        return this.app;
    }

    constructor() {
        this.app = express();
        this.app.use(cors())
        this.app.use(express.json());
        this.registerRouters();
    }

    private registerRouters() {
        this.app.get('/', (req: express.Request, res: express.Response) => {
            res.json({ code: 100, message: 'In action' });
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

                    if (route.hasFile) {
                        if (response instanceof Promise) return response.then((path: string) => res.sendFile(path));
                        return res.sendFile(response);
                    }
                    else if (response instanceof Promise) return response.then((data: ApiResult) => res.send(data));
                    else res.send(response);
                });

                this.app.use(controllerPath, router);
            })
        })
    }
}

export default new Application();