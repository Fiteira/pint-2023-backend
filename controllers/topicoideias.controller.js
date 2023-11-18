const TopicoIdeia = require("../models/topicoidea.model");


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
      const topicoideia = await TopicoIdeia.create(req.body);
      return res.send({ message: topicoideia, success: true});
    } catch (error) {
      return res.status(500).send({ message: "Erro ao criar topico ideia", success: false });
    }
  
  };

// Get all Indicações
exports.getAll = async (req, res) => {
    try {
      const topicoIdeia = await TopicoIdeia.findAll({
        order: [['NTopicoIdeia', 'ASC']]
    });
  
      return res.send({ message: topicoIdeia, success: true, });
  
    } catch (err) {
      console.log("error: ", err);
      return res.status(500).send({ message: "Erro ao obter tipoIdeia.", success: false });
    }
  };
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const topicoIdeia = await TopicoIdeia.findByPk(req.params.ntopicoideia);
  
      if (topicoIdeia) {
        console.log("Topico ideia encontrada: ", topicoIdeia);
        return res.send({ message: topicoIdeia, success: true });
      } else {
        return res.status(404).send({ message: `Tipo de vaga não encontrada de id: ${req.params.ntopicoideia}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar topico ideia: " + err, success: false });
    }
  };

  // Delete a TopicoIdeia by ID
  exports.delete = async (req, res) => {
    const ntopicoideia = req.params.ntopicoideia;
    try {
        const result = await TopicoIdeia.destroy({ where: { NTopicoIdeia: ntopicoideia } });
        if (result === 0) {
            res.status(404).send({
                success: false,
                message: `TopicoIdeia não encontrada com o ID: ${ntopicoideia}.`
            });
        } else {
            res.status(200).send({
                success: true,
                message: `TopicoIdeia excluída com sucesso. ID: ${ntopicoideia}`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
        res.status(500).send({
            success: false,
            message: "Erro ao excluir TopicoIdeia."
        });
    }
  };
  
  // Update a TopicoIdeia by ID
  exports.updateById = async (req, res) => {
    const ntopicoideia = req.params.ntopicoideia;
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            success: false,
            message: "Conteúdo não pode estar vazio!"
        });
    }
    console.log(req.body);
    try {
        const result = await TopicoIdeia.update(req.body, { where: { NTopicoIdeia: ntopicoideia } });
        if (result[0] === 0) {
            res.status(404).send({
                success: false,
                message: `TopicoIdeia não encontrada com o ID: ${ntopicoideia}.`
            });
        } else {
            res.send({
                success: true,
                message: `TopicoIdeia atualizada com sucesso. ID: ${ntopicoideia}`
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Erro ao atualizar TopicoIdeia: ${error}`
        });
    }
  };