import { Request } from 'express';
import Youtube from '../core/Youtube';
import { controller, GET } from '../utils';

@controller('/youtube')
class YoutubeController {
    private youtube: Youtube;

    constructor() {
        this.youtube = this.ytInstance();
    }

    @GET('/tags')
    public tagsByTitle(req: Request) {
        return this.youtube.tags(req.query);
    }

    private ytInstance(): Youtube {
        if (!this.youtube) this.youtube = new Youtube();
        return this.youtube;
    }
}

export default YoutubeController;