const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // limite de 5MB para o tamanho do arquivo
    }
  });

module.exports = upload;