const TipoVaga = require("../models/tipovaga.model");

// Get all Indicações
exports.getAll = async (req, res) => {
    try {
      const tipoVagas = await TipoVaga.findAll();
  
      return res.send({ message: tipoVagas, success: true, });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter tipoVagas.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const tipoVaga = await TipoVaga.findByPk(req.params.ntipovaga);
  
      if (tipoVaga) {
        console.log("Indicação encontrada: ", tipoVaga);
        return res.send({ message: tipoVaga, success: true });
      } else {
        return res.status(404).send({ message: `Tipo de vaga não encontrada de id: ${req.params.ntipovaga}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar indicação: " + err, success: false });
    }
  };