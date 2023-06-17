import { Request, Response } from 'express';
import path = require('path');
import mediaCore from '../core/media';
import { controller, GET } from '../utils';

@controller('/media')
class MediaController {
    private media: mediaCore;

    constructor() {
        this.media = this.mediaInstance();
    }

    @GET('/video', true)
    public video() {
        const videoPath = path.join(__dirname, '../../trimmed_video.mp4');
        return videoPath;
    }

    @GET('/trim', true)
    public trim(req: Request, res: Response) {
        return this.media.trim(req.query, res);
    }

    private mediaInstance(): mediaCore {
        if (!this.media) this.media = new mediaCore();
        return this.media;
    }
}

export default MediaController;