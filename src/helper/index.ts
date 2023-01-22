export function validateYouTubeUrl(url: string) {
    const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

    if (url.match(regExp)) return true;
    return false;
}

export function youtubeVideoId(url: string) {
    let videoId = url.split('v=')[1];
    let ampersandPosition = videoId.indexOf('&');

    if (ampersandPosition != -1) videoId = videoId.substring(0, ampersandPosition);
    return videoId;
}