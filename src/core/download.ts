import axios from 'axios';
import { dataList, exception } from '../utils';
import { downloadOptions } from '../types/download';
import { isInstagramUrlValid } from '../helper';

class Download {
    public async download(url: string) {
        try {
            if (!isInstagramUrlValid(url)) return exception('Enter valid url');

            let response = null;
            const { data } = await axios.post("https://ssyoutube.com/api/convert", { url });

            if (data.hasOwnProperty('url')) response = data;
            else if (Array.isArray(data) && data?.length > 0) response = data[0];
            else return dataList([]);

            const downloadLink: string | null = this.extractDownloadLink(response);
            if (!downloadLink) return dataList([]);

            const result: downloadOptions = {
                title: response?.meta?.title,
                thumbnail: response?.thumb,
                downloadLink,
            }

            return dataList([result]);
        } catch (error) {
            return exception(error);
        }
    }

    private extractDownloadLink(response: any) {
        try {
            let hasQuality: any[] = [];

            let downloadLink: string = response?.url?.map((e: any, index: number) => {
                if (e.hasOwnProperty('quality')) hasQuality.push({ ...e, index });
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
}

export default Download;