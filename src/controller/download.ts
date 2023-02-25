import { Request } from 'express';
import Download from '../core/download';
import { controller, GET } from '../utils';

@controller('/download')
class DownloadController {
    private download: Download;

    constructor() {
        this.download = this.ytInstance();
    }

    @GET('/')
    public tagsByTitle(req: Request) {
        return this.download.download(String(req.query.url));
    }

    private ytInstance(): Download {
        if (!this.download) this.download = new Download();
        return this.download;
    }
}

export default DownloadController;