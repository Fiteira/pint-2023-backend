const Anexos = require("../models/anexos.model");

exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      return res.status(400).send({
        success: false,
        message: "Conteúdo não pode estar vazio!"
      });
    }
    console.log(req.body);
  
    // Criar Nova Anexo
    try {
      const anexo = await Anexos.create(req.body);
      return res.send({ message: anexo, success: true});
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar anexo.", success: false });
    }
  
  };
  
  // Get all Indicações
  exports.getAll = async (req, res) => {
    try {
      const anexos = await Anexos.findAll({
        order: [['NAnexo', 'ASC']]
      });
  
      return res.send({ message: anexos, success: true, });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter anexos.", success: false });
    }
  };
  
  // Get a Anexo by ID
  exports.getById = async (req, res) => {
    try {
      const anexo = await Anexos.findByPk(req.params.nanexo);
  
      if (anexo) {
        console.log("Anexo encontrada: ", anexo);
        return res.send({ message: anexo, success: true });
      } else {
        return res.status(404).send({ message: `Anexo não encontrado de id: ${req.params.nanexo}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar indicação: " + err, success: false });
    }
  };
  
  // Delete a Anexos by ID
  exports.delete = async (req, res) => {
    const nanexo = req.params.nanexo;
    try {
        const result = await Anexos.destroy({ where: { NAnexo: nanexo } });
        if (result === 0) {
            res.status(404).send({
                success: false,
                message: `Anexos não encontrada com o ID: ${nanexo}.`
            });
        } else {
            res.status(200).send({
                success: true,
                message: `Anexos excluída com sucesso. ID: ${nanexo}`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
        res.status(500).send({
            success: false,
            message: "Erro ao excluir Anexos."
        });
    }
  };
  
  // Update a Anexos by ID
  exports.updateById = async (req, res) => {
    const nanexo = req.params.nanexo;
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            success: false,
            message: "Conteúdo não pode estar vazio!"
        });
    }
    console.log(req.body);
    try {
        const result = await Anexos.update(req.body, { where: { NAnexo: nanexo } });
        if (result[0] === 0) {
            res.status(404).send({
                success: false,
                message: `Anexos não encontrada com o ID: ${nanexo}.`
            });
        } else {
            res.send({
                success: true,
                message: `Anexos atualizada com sucesso. ID: ${nanexo}`
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Erro ao atualizar Anexos: ${error}`
        });
    }
  };