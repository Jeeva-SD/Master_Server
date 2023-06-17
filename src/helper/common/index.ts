import * as fs from 'fs';

export const hasString = (str: string) => {
    return str.trim().length > 0;
};

export const wait = (callback: any, ms: number): void => {
    setTimeout(callback, ms);
};

export const unlink = (media: any, ms: number): void => {
    wait(() => fs.unlink(media, () => console.log(`${media} unlinked.`)), ms);
};