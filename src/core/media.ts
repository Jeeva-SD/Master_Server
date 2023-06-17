import * as path from 'path';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { v4 as uuid } from 'uuid';
import Download from './download';
import { take } from '../utils';

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
            const videoPath = path.join(__dirname, '..', 'assets', 'Rust.mp4');
            let trimDuration = 0;
            let downloadedFile: string = '';
            let startTime = start ? start : 0;

            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    console.error('Error getting video information:', err);
                    return;
                }

                const { videoDuration } = metadata.format;
                trimDuration = duration ? duration : videoDuration;
            });

            if (yt) {
                downloadedFile = await this.downloader.youtube({ url, title, ffmpeg, startTime, duration });
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