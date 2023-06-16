import { getMetaData } from './meta';

export const controller = (controller: string): ClassDecorator => {
    return (target: any) => {
        const meta = getMetaData(target.prototype);
        meta.controller = controller;
    };
}

export const methodDecorator = (method: string, path: string, hasFile: boolean = false): MethodDecorator => {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const meta = getMetaData(target);
        meta.routes[methodName] = { method, url: path, hasFile };
        return descriptor;
    }
}

export const GET = (path: string, hasFile: boolean = false) => methodDecorator('get', path, hasFile);
export const POST = (path: string, hasFile: boolean = false) => methodDecorator('post', path, hasFile);
export const PUT = (path: string, hasFile: boolean = false) => methodDecorator('put', path, hasFile);
export const DELETE = (path: string, hasFile: boolean = false) => methodDecorator('delete', path, hasFile);