export interface Route {
    method: string;
    url: string;
    hasFile: boolean;
}

export interface MetaData {
    controller: string;
    routes: {
        [key: string]: Route;
    };
}

export interface TargetData {
    meta_data?: MetaData;
}

export const getMetaData = (target: TargetData): MetaData => {
    if (!target.meta_data) {
        target.meta_data = {
            controller: '',
            routes: {},
        };
    }
    return target.meta_data;
}