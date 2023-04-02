import { Request } from 'express';
import Download from '../core/download';
import { controller, GET } from '../utils';

@controller('/download')
class DownloadController {
    private downloader: Download;

    constructor() {
        this.downloader = this.downloadInstance();
    }

    @GET('/')
    public tagsByTitle(req: Request) {
        return this.downloader.download(String(req.query.url));
    }

    private downloadInstance(): Download {
        if (!this.downloader) this.downloader = new Download();
        return this.downloader;
    }
}

export default DownloadController;