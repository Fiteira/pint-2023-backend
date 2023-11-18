const Cargo = require("../models/cargo.model");

// Get all Indicações
exports.getAll = async (req, res) => {
    try {
      const cargos = await Cargo.findAll();
  
      return res.send({ message: cargos, success: true, });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter cargos.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const tipoVaga = await Cargo.findByPk(req.params.ncargo);
  
      if (tipoVaga) {
        console.log("Cargo encontrado: ", tipoVaga);
        return res.send({ message: tipoVaga, success: true });
      } else {
        return res.status(404).send({ message: `Cargo não encontrada de id: ${req.params.ncargo}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar cargo " + err, success: false });
    }
  };