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
            const videoPath = path.join(__dirname, '..', 'assets', 'RabbitMQ in 100 Seconds.mp4');
            const deleteFile = false;

            ffmpeg.setFfmpegPath(this.ffmpegPath);

            return await new Promise((resolve, reject) => {
                ffmpeg(videoPath)
                    .setStartTime(startTime)
                    .setDuration(duration)
                    .format('mp4')
                    .on('end', () => {
                        const trimmedVideoPath = './trimmed_video.mp4';
                        console.log('File created');

                        if (deleteFile) {
                            setTimeout(() => {
                                fs.unlink(trimmedVideoPath, (err) => {
                                    if (err) {
                                        console.error('Error deleting file:', err);
                                    } else {
                                        console.log('File deleted successfully.');
                                    }
                                });
                            }, 5000);
                        }

                        return resolve(take(505));
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