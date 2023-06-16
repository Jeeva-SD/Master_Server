import * as path from 'path';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { take } from '../utils';

class MediaCore {
    private ffmpegPath: string;

    constructor() {
        this.ffmpegPath = '/usr/bin/ffmpeg';
    }

    public async trim({ videoUrl, startTime, duration }: any, res: any) {
        try {
            const videoPath = path.join(__dirname, '..', 'assets', 'Rust.mp4');
            const deleteFile = true;

            ffmpeg.setFfmpegPath(this.ffmpegPath);

            return await new Promise((resolve, reject) => {
                ffmpeg(videoPath)
                    .setStartTime(startTime)
                    .setDuration(duration)
                    .format('mp4')
                    .outputOptions('-acodec', 'copy')
                    .on('end', () => {
                        const trimmedVideoPath = './trimmed_video.mp4';

                        if (deleteFile) {
                            setTimeout(() => {
                                fs.unlink(trimmedVideoPath, (err) => {
                                    if (err) console.error('Error deleting file:', err);
                                    else console.log('File deleted successfully.');
                                });
                            }, 5000);
                        }

                        const stat = fs.statSync(trimmedVideoPath);
                        const fileSize = stat.size;

                        res.writeHead(200, {
                            'Content-Length': fileSize,
                            'Content-Type': 'video/mp4',
                        });

                        return resolve(fs.createReadStream(trimmedVideoPath));
                    })
                    .on('error', (err: any) => {
                        console.error('Error trimming video:', err.message);
                        reject(err);
                    })
                    .save('./trimmed_video.mp4');
            });
        } catch (error) {
            console.error('Error trimming video:', error.message);
            res.status(500).json({ error: 'Error trimming video' });
        }
    }
}

export default MediaCore;