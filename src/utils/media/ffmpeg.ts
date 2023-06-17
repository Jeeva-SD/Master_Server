import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { ffmpegPath } from '../../config';

class FFMPEG {
    constructor() {
        ffmpeg.setFfmpegPath(ffmpegPath);
    }

    protected execute(command: ffmpeg.FfmpegCommand, outputPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            command.on('error', (err) => {
                console.error('FFmpeg error:', err.message);
                reject(err);
            });

            command.on('end', () => {
                resolve(outputPath);
            });
            command.run();
        });
    }

    protected create(input: any, output: any): ffmpeg.FfmpegCommand {
        return ffmpeg(input)
            .setFfmpegPath(ffmpegPath)
            .output(output);
    }

    protected mediaInfo(videoPath: any) {
        return ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                console.error('Error getting video information:', err);
                return null;
            }

            return metadata;
        });
    }
}

export default FFMPEG;