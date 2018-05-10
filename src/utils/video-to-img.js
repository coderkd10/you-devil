const videoToImage = (video, { filter="", mimeType="image/png" }) => {
    const canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    const ctx = canvas.getContext('2d');
    ctx.filter = filter;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    return canvas.toDataURL(mimeType);
}

export default videoToImage;
