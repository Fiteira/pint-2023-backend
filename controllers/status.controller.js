const Status = require("../models/status.model");


//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Status
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  // Criar Novo Status

  // Criar novo status na base de dados
  try {
    const status = await Status.create(req.body);
   return res.send(
      {
        success: true,
        message: status
      }
    );
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Erro: " + error
    });
  }

};
exports.getAll = async (req, res) => {
  const noportunidade = req.query.noportunidade;

  const ordenar = (noportunidade) ?  { NOportunidade : noportunidade } : {}

  try {
    const status = await Status.findAll({
      order: [['NStatus', 'ASC']],
      where: ordenar
    });

   return res.send({ success: true, message: status });
  } catch (err) {
    console.log("error: ", err);
  return  res.status(500).send({
      success: false,
      message: `Erro ao obter status: ${err}`
    });
  }
};

// Get a Status by ID
exports.getById = async (req, res) => {
  try {
    const status = await Status.findByPk(req.params.nstatus);
    if (status) {
      console.log("Status encontrado: ", status);
     return res.send({
        success: true,
        message: status
      })
    } else {
    return  res.status(404).send(
        {
          success: false,
          message: "Status não encontrado de id: " + req.params.nstatus
        }
      )
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send(
      {
        success: false,
        message: "Erro ao encontrar status de nstatus: " + req.params.nstatus
      }
    )
  }
};

// Delete a Status by ID
exports.delete = async (req, res) => {
  const nstatus = req.params.nstatus;
  try {
    const result = await Status.destroy({ where: { NStatus: nstatus } });
    if (result === 0) {
     return res.status(404).send(
        {
          message: "Status não encontrado de id: " + nstatus,
          success: false
        })

    } else {
     return res.status(200).send(
        {
          success: true,
          message: `Status apagado de id: ${nstatus}`
        })
    }
  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send(
      {
        success: false,
        message: `Erro ao apagar status: ${err}`
      })
  }
};

// Update a Status by ID
exports.updateById = async (req, res) => {
  const nstatus = req.params.nstatus
  // Validate Request
  if (!req.body) {
   return res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }
  console.log(req.body);

  try {
    const result = await Status.update(req.body, { where: { NStatus: nstatus } });
    if (result[0] === 0) {
     return res.status(404).send({
        success: false,
        message: `Impossível encontrar o status de id: ${nstatus}.`
      });
    } else {
     return res.send({
        success: true,
        message: "Status atualizado com successo!"
      })
    }
  } catch (error) {
   return res.status(500).send({
      success: false,
      message: `Erro ao atualizar status: ${error} `
    })
  }
}