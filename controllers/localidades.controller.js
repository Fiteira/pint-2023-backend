const Localidade = require('../models/localidade.model')

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
      const localidade = await Localidade.create(req.body);
      return res.send({ message: localidade, success: true});
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar localidade.", success: false });
    }
  
  };
  
  // Get all Indicações
  exports.getAll = async (req, res) => {
    try {
      const localidades = await Localidade.findAll({
        order: [['NLocalidade', 'ASC']]
    });
  
      return res.send({ message: localidades, success: true });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter localidades.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const localidade = await Localidade.findByPk(req.params.nlocalidade);
  
      if (localidade) {
        console.log("Indicação encontrada: ", localidade);
        return res.send({ message: localidade, success: true });
      } else {
        return res.status(404).send({ message: `Localidade não encontrada de id: ${req.params.nlocalidade}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar localidade: " + err, success: false });
    }
  };
  
  // Delete a Localidade by ID
  exports.delete = async (req, res) => {
    const nlocalidade = req.params.nlocalidade;
    try {
        const result = await Localidade.destroy({ where: { NLocalidade: nlocalidade } });
        if (result === 0) {
           return res.status(404).send({
                success: false,
                message: `Localidade não encontrada com o ID: ${nlocalidade}.`
            });
        } else {
          return  res.status(200).send({
                success: true,
                message: `Localidade excluída com sucesso. ID: ${nlocalidade}`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
       return res.status(500).send({
            success: false,
            message: "Erro ao excluir Localidade."
        });
    }
  };
  
  // Update a Localidade by ID
  exports.updateById = async (req, res) => {
    const nlocalidade = req.params.nlocalidade;
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            success: false,
            message: "Conteúdo não pode estar vazio!"
        });
    }
    console.log(req.body);
    try {
        const result = await Localidade.update(req.body, { where: { NLocalidade: nlocalidade } });
        if (result[0] === 0) {
         return   res.status(404).send({
                success: false,
                message: `Localidade não encontrada com o ID: ${nlocalidade}.`
            });
        } else {
          return  res.send({
                success: true,
                message: `Localidade atualizada com sucesso. ID: ${nlocalidade}`
            });
        }
    } catch (error) {
       return res.status(500).send({
            success: false,
            message: `Erro ao atualizar Localidade: ${error}`
        });
    }
  };