const TipoProjetos = require('../models/tipoprojetos.model')

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
      const tipoprojeto = await TipoProjetos.create(req.body);
      return res.send({ message: tipoprojeto, success: true});
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar tipoprojetos.", success: false });
    }
  
  };
  
  // Get all Indicações
  exports.getAll = async (req, res) => {
    try {
      const tipoprojeto = await TipoProjetos.findAll({
        order: [['NTipoProjeto', 'ASC']]
      });
  
      return res.send({ message: tipoprojeto, success: true, });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter tipo projetos.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const tipoprojeto = await TipoProjetos.findByPk(req.params.ntipoprojetos);
  
      if (tipoprojeto) {
        console.log("Tipo projeto encontrado: ", tipoprojeto);
        return res.send({ message: tipoprojeto, success: true });
      } else {
        return res.status(404).send({ message: `Tipo de projeto não encontrado de id: ${req.params.ntipoprojetos}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar tipo projeto: " + err, success: false });
    }
  };
  
  // Delete a TipoProjetos by ID
  exports.delete = async (req, res) => {
    const ntipoprojeto = req.params.ntipoprojeto;
    try {
        const result = await TipoProjetos.destroy({ where: { NTipoProjetos: ntipoprojeto } });
        if (result === 0) {
         return   res.status(404).send({
                success: false,
                message: `Tipo Projeto não encontrado com o ID: ${ntipoprojeto}.`
            });
        } else {
           return res.status(200).send({
                success: true,
                message: `Tipo Projeto excluído com sucesso. ID: ${ntipoprojeto}`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
       return res.status(500).send({
            success: false,
            message: "Erro ao excluir Tipo Projeto."
        });
    }
  };
  
  // Update a TipoProjetos by ID
  exports.updateById = async (req, res) => {
    const ntipoprojeto = req.params.ntipoprojetos;
    // Validate Request
    if (!req.body) {
      return  res.status(400).send({
            success: false,
            message: "Conteúdo não pode estar vazio!"
        });
    }
    console.log(req.body);
    try {
        const result = await TipoProjetos.update(req.body, { where: { NTipoProjeto: ntipoprojeto } });
        if (result[0] === 0) {
          return  res.status(404).send({
                success: false,
                message: `Tipo Projeto não encontrado com o ID: ${ntipoprojeto}.`
            });
        } else {
            return res.send({
                success: true,
                message: `Tipo Projeto atualizada com sucesso. ID: ${ntipoprojeto}`
            });
        }
    } catch (error) {
       return res.status(500).send({
            success: false,
            message: `Erro ao atualizar Tipo Projeto: ${error}`
        });
    }
  };