import * as path from 'path';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { v4 as uuid } from 'uuid';
import Download from './download';
import { unlink } from '../helper';

class MediaCore {
    private ffmpegPath: string;
    private deleteFile: boolean;
    private downloader: Download;

    constructor() {
        this.ffmpegPath = 'D:\\Jeeva\\ffmpeg\\bin\\ffmpeg.exe';
        this.deleteFile = true;
        this.downloader = this.downloadInstance();
        ffmpeg.setFfmpegPath(this.ffmpegPath);
    }

    public async trim(params: any, res: any) {
        try {
            const { url, start, duration, yt = false, title = uuid() } = params;
            let trimDuration = 0;
            let downloadedFile: string = '';
            let startTime = start ? start : 0;

            if (yt) {
                downloadedFile = await this.downloader.youtube({ url, title, ffmpeg, startTime, duration });
                unlink(downloadedFile, 10000);

                return fs.createReadStream(downloadedFile);
            }

        } catch (error) {
            console.error('Error trimming video:', error.message);
            res.status(500).json({ error: 'Error trimming video' });
        }
    }

    private downloadInstance(): Download {
        if (!this.downloader) this.downloader = new Download();
        return this.downloader;
    }
}

export default MediaCore;