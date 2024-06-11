function isBlobURL(url) {
    return url?.startsWith('blob:');
}
export const getFormattedImageURL = (image = '') => {
    if (image) {
        if (typeof image === 'string' && image.indexOf("https://")) {
            if (isBlobURL(image)) { return image; } else {
                console.log("image==", image);
                const imageName = image?.split('/')?.pop();
                const S3_BASE_URL = process.env.REACT_APP_S3_BASE_URL;
                const S3_BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_FOLDER_PATH;

                const formattedImage = `${S3_BASE_URL}/${S3_BUCKET_NAME}/${imageName}`;

                return formattedImage;
            }
        }
    }
    return image;
};