

const cloudinary = require('cloudinary').v2;

// Configuration 
const cloud_config = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDKEY ,
  api_secret: process.env.CLOUDSECRET
});

module.exports = cloud_config;


