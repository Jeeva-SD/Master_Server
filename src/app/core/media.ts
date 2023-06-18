import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import Download from './download';
import { unlink } from '../../helper';
import ytdl = require('ytdl-core');

class MediaCore {
    private downloader: Download;

    constructor() {
        this.downloader = this.downloadInstance();
    }

    public async trim(params: any, res: any) {
        try {
            const { url, start, duration, yt = false, title = uuid() } = params;
            let downloadedFile: string = '';
            let startTime = start ? start : 0;

            if (yt) {
                downloadedFile = await this.downloader.youtube({ url, title, startTime, duration });
                unlink(downloadedFile, 10000);

                return fs.createReadStream(downloadedFile);
            }

        } catch (error) {
            console.error('Error trimming video:', error.message);
            res.status(500).json({ error: 'Error trimming video' });
        }
    }


    public async quickTrim(params: any, res: any) {

        const { url = 'https://www.youtube.com/watch?v=KRyvcLqpVQ0', start, duration, yt = false, title = uuid() } = params;


        const endTime = 60; // End time in seconds
        const outputFileName = 'trimmed_video.mp4'; // Output file name for the trimmed video


        try {
            const videoInfo = await ytdl.getInfo(url);
            const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });

            const downloadOptions = {
                begin: '10s',
                range: {
                    start: 10,
                    end: 20,
                },
            };


            return new Promise<any>((resolve, reject) => {
                ytdl(url, {
                    range: {
                        start: 0,
                        end: 20
                    },
                    quality: 'lowestvideo',
                }).pipe(fs.createWriteStream('video.mp4'));


            });
        } catch (error) {
            console.error('Error downloading and trimming video:', error);
        }
    }

    private downloadInstance(): Download {
        if (!this.downloader) this.downloader = new Download();
        return this.downloader;
    }
}

export default MediaCore;