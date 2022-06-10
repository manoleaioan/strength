const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLD_CLOUD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET
});

const uploadFromBuffer = (uid, createReadStream) => {
  return new Promise(async (resolve, reject) =>{
    let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
      {
        public_id: 'strength/' + uid
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error.message);
        }
      }
    );
    createReadStream().pipe(cld_upload_stream);
  });
};



module.exports = {
  uploadFromBuffer
};