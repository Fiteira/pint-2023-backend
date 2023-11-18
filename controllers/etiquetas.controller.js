const Etiqueta = require('../models/etiquetas.model')

exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      return res.status(400).send({
        success: false,
        message: "Conteúdo não pode estar vazio!"
      });
    }
    // Criar Nova Indicação
    try {
      const etiqueta = await Etiqueta.create(req.body);
      return res.send({ message: etiqueta, success: true});
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar etiqueta.", success: false });
    }
  
  };
  
  // Get all Indicações
  exports.getAll = async (req, res) => {
    try {
      const etiquetas = await Etiqueta.findAll({
        order: [['NEtiqueta', 'ASC']]
      });
  
      return res.send({ message: etiquetas, success: true, });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter etiquetas.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const etiqueta = await Etiqueta.findByPk(req.params.netiqueta);
  
      if (etiqueta) {
        console.log("Indicação encontrada: ", etiqueta);
        return res.send({ message: etiqueta, success: true });
      } else {
        return res.status(404).send({ message: `Indicação não encontrada de id: ${req.params.netiqueta}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar indicação: " + err, success: false });
    }
  };
  
  // Delete a Etiqueta by ID
  exports.delete = async (req, res) => {
    const netiqueta = req.params.netiqueta;
    try {
        const result = await Etiqueta.destroy({ where: { NEtiqueta: netiqueta } });
        if (result === 0) {
         return   res.status(404).send({
                success: false,
                message: `Etiqueta não encontrada com o ID: ${netiqueta}.`
            });
        } else {
           return res.status(200).send({
                success: true,
                message: `Etiqueta excluída com sucesso. ID: ${netiqueta}`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
       return res.status(500).send({
            success: false,
            message: "Erro ao excluir Etiqueta."
        });
    }
  };
  
  // Update a Etiqueta by ID
  exports.updateById = async (req, res) => {
    const netiqueta = req.params.netiqueta;
    // Validate Request
    if (!req.body) {
      return  res.status(400).send({
            success: false,
            message: "Conteúdo não pode estar vazio!"
        });
    }
    console.log(req.body);
    try {
        const result = await Etiqueta.update(req.body, { where: { NEtiqueta: netiqueta } });
        if (result[0] === 0) {
          return  res.status(404).send({
                success: false,
                message: `Etiqueta não encontrada com o ID: ${netiqueta}.`
            });
        } else {
            return res.send({
                success: true,
                message: `Etiqueta atualizada com sucesso. ID: ${netiqueta}`
            });
        }
    } catch (error) {
       return res.status(500).send({
            success: false,
            message: `Erro ao atualizar Etiqueta: ${error}`
        });
    }
  };