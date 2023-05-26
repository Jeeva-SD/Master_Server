import YoutubeController from '../controller/youtube';
import DownloadController from '../controller/download';
import FavController from '../controller/fav';

export const combineRouter = [
    YoutubeController,
    DownloadController,
    FavController
];
