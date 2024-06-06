const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dcoajgeh5",
    api_key: "398428448442352",
    api_secret: "Rm7Sy0n4EWRx7MY20-i1SM2CCz0",
});

const uploadImageToCloudinary = async (filePath) => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const result = await cloudinary.uploader.upload(filePath);
            return result;
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            attempt++;
            if (attempt >= maxRetries) {
                throw error;
            }
        }
    }
};

module.exports = {
  uploadImageToCloudinary,
};
