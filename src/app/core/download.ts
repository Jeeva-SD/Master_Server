import axios from 'axios';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';
import { dataList, exception } from '../../utils';
import { downloadOptions } from '../../types/download';
import { isInstagramUrlValid, unlink } from '../../helper';
import Editor from '../../utils';

class Download {
    private ff: Editor;

    constructor() {
        this.ff = this.ffInstance();
    }

    public async download(url: string) {
        try {
            if (!isInstagramUrlValid(url)) return exception('Enter valid url');

            let response = null;
            const { data } = await axios.post('https://ssyoutube.com/api/convert', { url });

            if (data.hasOwnProperty('url')) response = data;
            else if (Array.isArray(data) && data?.length > 0) response = data[0];
            else return dataList([]);

            const downloadLink: string | null = this.extractDownloadLink(response);
            if (!downloadLink) return dataList([]);

            const result: downloadOptions = {
                title: response?.meta?.title,
                thumbnail: response?.thumb,
                downloadLink,
            };

            return dataList([result]);
        } catch (error) {
            return exception(error);
        }
    }

    private extractDownloadLink(response: any) {
        try {
            let hasQuality: any[] = [];

            let downloadLink: string = response?.url?.map((e: any, index: number) => {
                if (e.hasOwnProperty('quality') || e.hasOwnProperty('url')) hasQuality.push({ ...e, index });
                return e.url;
            })[response?.url?.length - 1]?.url;

            if (hasQuality.length > 0) {
                const data = hasQuality.sort((a: any, b: any) => b.quality - a.quality)[0];
                downloadLink = data.url;
            }

            return downloadLink;
        } catch (error) {
            return null;
        }
    }


    public async youtube(params: any): Promise<string> {
        try {
            const { url, title, startTime, duration } = params;
            const fileName = `${title}.mp4`;

            const videoInfo = await ytdl.getInfo(url);
            const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestvideo' });
            const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });

            return new Promise((resolve, reject) => {
                const videoStream = ytdl(url, { format: videoFormat });
                const audioStream = ytdl(url, { format: audioFormat });
                const outputStream = fs.createWriteStream(`./src/assets/downloads/${fileName}`);

                videoStream.pipe(outputStream);

                videoStream.on('end', () => {
                    const audioFilePath = `./src/assets/downloads/audio_${fileName}`.replace('mp4', 'mp3');
                    const mergedFilePath = `./src/assets/downloads/merged_${fileName}`;

                    audioStream.pipe(fs.createWriteStream(audioFilePath))
                        .on('finish', () => {
                            unlink(outputStream.path, 10000);
                            unlink(audioFilePath, 10000);
                            resolve(this.ff.trimVideo(audioFilePath, mergedFilePath, startTime, duration));
                        });
                });

                outputStream.on('error', (error) => {
                    console.error('Error downloading YouTube video:', error);
                    reject(fileName);
                });
            });
        } catch (error) {
            console.error('Error downloading YouTube video:', error);
        }
    }

    private ffInstance(): Editor {
        if (!this.ff) this.ff = new Editor();
        return this.ff;
    }
}

export default Download;