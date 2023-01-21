import axios from 'axios';
import { exception, dataList } from '../utils';

class Youtube {

    public async tagsByTitle(params: any) {
        try {
            const videoTitle: string = params.q;
            const type: string = params.type;

            let tags = videoTitle.split(" ").map((word: string) => word);

            if (type === 'youtube') {
                const { data } = await axios.get("https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=" + videoTitle);
                const result = JSON.parse(data.replace(/^.*?\(/, '').replace(/\)$/, ''));
                result[1]?.forEach((arr: any) => tags.push(arr[0]));
            }
            else if (type === 'web') {
                const { data } = await axios.get(`https://suggestqueries.google.com/complete/search?q=${videoTitle}&client=firefox`);
                tags = tags.concat(data[1]);
            }

            return dataList(tags);
        } catch (error) {
            return exception(error);
        }
    }

    public async tagsByURL(params: any) {
        try {
            const videoUrl = params.q;
            const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoUrl}&key=${process.env.ytAPIKey}`);
            let tags = data.items[0].snippet.tags;

            return dataList(tags);
        } catch (error) {
            return exception(error);
        }
    }
}

export default Youtube;