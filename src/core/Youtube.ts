import axios from 'axios';
import { validateYouTubeUrl, youtubeVideoId } from '../helper';
import { exception, dataList } from '../utils';

class Youtube {

    public async tags(params: any) {
        try {
            const query: string = params.q;
            const type: string = params.type;
            if (!query || query.trim().length === 0) return dataList([]);

            const isYoutubeURL = validateYouTubeUrl(query);
            if (isYoutubeURL) return await this.tagsByURL(query);

            let queryArr: string[] = [query];
            let words: string[] = query.split(' ');

            if (words?.length > 2) {
                const firstTwoWords = words[0].length > 8 ? words[0] : words.slice(0, 2).join(' ');
                queryArr.unshift(firstTwoWords);
            }

            if (type === 'web') {
                const { data } = await axios.get(`https://suggestqueries.google.com/complete/search?q=${query}&client=firefox`);
                return dataList(data[1]);
            }

            return dataList(await this.proTags(queryArr));
        } catch (error) {
            return exception(error);
        }
    }

    public async tagsByURL(videoUrl: string) {
        try {
            const videoId: string = youtubeVideoId(videoUrl);
            const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.ytAPIKey}`);
            const tags = data.items[0].snippet.tags;

            return dataList(tags);
        } catch (error) {
            return exception(error);
        }
    }

    public async youtubeSuggestions(query: string, count?: number) {
        try {
            let response: string[] = []
            const { data } = await axios.get('https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=' + query);
            const result: any = JSON.parse(data.replace(/^.*?\(/, '').replace(/\)$/, ''));

            result[1]?.forEach((arr: any, index: number) => {
                if (count && index < count) {
                    response.push(arr[0]);
                }
                else if (!count) {
                    response.push(arr[0]);
                }
            });

            return response;
        } catch (error) {
            return exception(error);
        }
    }

    private async proTags(queryArr: string[]) {
        try {
            async function getSuggestions(query: string, count?: number) {
                let response: string[] = []
                const { data } = await axios.get('https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=' + query);
                const result: any = JSON.parse(data.replace(/^.*?\(/, '').replace(/\)$/, ''));

                result[1]?.forEach((arr: any, index: number) => {
                    if (count && index < count) {
                        response.push(arr[0]);
                    }
                    else if (!count) {
                        response.push(arr[0]);
                    }
                });

                return response;
            }

            function generateProTags() {
                let promises = [];
                const count = queryArr.length > 1 ? 8 : 0;

                for (const query of queryArr) {
                    promises.push(getSuggestions(query, count));
                }

                return Promise.all(promises);
            }

            return generateProTags().then(results => {
                let proTags: string[] = [];

                results.forEach((tags: string[]) => {
                    proTags.push(...tags)
                })

                return [...new Set(proTags)];
            }).catch(error => {
                return exception(error);
            });
        } catch (error) {
            return exception(error);
        }
    }
}

export default Youtube;