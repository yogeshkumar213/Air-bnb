const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// configure means jodna means cloudinary k sath hum jod rhe hai apne .env file ko
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wonnderlust_Dev',
      allowedFormats: ["jpg","png","jpeg"],
      
    },
  });
  module.exports={
    cloudinary,
    storage
  }