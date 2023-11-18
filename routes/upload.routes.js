


module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const imagem = require('../controllers/imagem.controller')
  const upload = require("../config/multer")
  const multer = require('multer');
  const sharp = require("sharp");
  const middleware = require("../config/middleware.js")
  const config = require('../config/cloudinary');
  const cloudinary = require('cloudinary').v2;

  router.route("/ficheiro").post(
    (req, res, next) => {
      upload.single("ficheiro")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // erro de validação do multer
          console.log(err)
          res.status(400).send({ success: false, message: "Erro ao fazer upload do ficheiro"});
        } else if (err) {
          // erro desconhecido
          res.status(500).send({ success: false, message: "Erro desconhecido ao fazer upload do ficheiro" });
        } else {
          next(); // passa para o próximo middleware
        }
      });
    },
    async (req, res) => {
      try {
    
        const file = req.file;
        console.log("file: " + file.filename)
        const uploadResult = await imagem.uploadImage(file.buffer, file.filename);
        res.status(200).send({ success: true, message: uploadResult.url });
      } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Erro ao fazer upload do ficheiro" });
      }
    }
  );
  
  router.route('/imagem').post(
    upload.single('imagem'),
    async (req, res) => {
      try {
        // Remove do nome original a extensão
        const originalFilename = req.file.originalname.replace(/\.[^/.]+$/, '');
  
        // set default dimensions
        let dimensions = { width: 300, height: 300 };
  
        // check for width and height parameters and update dimensions accordingly
        if (req.body.width) {
          dimensions.width = parseInt(req.body.width);
        }
  
        if (req.body.height) {
          dimensions.height = parseInt(req.body.height);
        }
  
        // check for resize parameter and update dimensions fit accordingly
        if (req.body.resize === 'true') {
          dimensions.fit = 'inside';
        } else {
          dimensions.fit = 'cover';
        }
  
        // resize and compress the image using sharp
        const buffer = await sharp(req.file.buffer)
          .resize(dimensions)
          .jpeg({ quality: 90 })
          .toBuffer();
  
        // upload the image using existing upload function
        const uploadResult = await imagem.uploadImage(buffer, originalFilename);
  
        res.status(200).send({ success: true, message: uploadResult.url });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ success: false, message: 'Erro ao fazer upload da imagem' });
      }
    }
  );
  app.use("/api", middleware.jwtAuthMiddleware, router);
}
