import { Request, Response } from 'express';
import mediaCore from '../core/media';
import { controller, GET } from '../../utils';

@controller('/media')
class MediaController {
    private media: mediaCore;

    constructor() {
        this.media = this.mediaInstance();
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