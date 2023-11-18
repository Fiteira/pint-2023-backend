const { Readable } = require('stream');


exports.uploadImage = (fileBuffer, publicId) => {
  const cloudinary = require('cloudinary').v2;
  const { Readable } = require('stream');

  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: publicId },
        (error, result) => {
          if (error) {
            reject({ success: false, message: `Error while uploading file to Cloudinary: ${JSON.stringify(error)}` });
          } else {
            resolve(result);
          }
        }
      );

      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null);

      bufferStream.on('error', (error) => {
        reject({ success: false, message: `Error while creating the buffer stream: ${error}` });
      });

      bufferStream.pipe(uploadStream).on('error', (error) => {
        reject({ success: false, message: `Error while uploading file to Cloudinary: ${error}` });
      });
    } catch (error) {
      reject({ success: false, message: `Error while initializing Cloudinary: ${error}` });
    }
  });
};
