import YoutubeController from '../controller/youtube';
import DownloadController from '../controller/download';
import FavController from '../controller/fav';
import MediaController from '../controller/media';

export const combineRouter = [
    YoutubeController,
    DownloadController,
    FavController,
    MediaController
];
