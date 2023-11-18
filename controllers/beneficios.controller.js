const Beneficio = require("../models/beneficio.model");
//const Joi = require('joi');
//const Boom = require('@hapi/boom');

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio."
    });
  }

  // Criar Novo Beneficio

  // Criar novo beneficio na base de dados
  try {
    const data = await Beneficio.create(req.body);
   return res.send({
      success: true,
      message: data
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "erro: " + error
    });
  }
};

// Get all Beneficios
exports.getAll = async (req, res) => {
  try {
    const beneficios = await Beneficio.findAll({
      order: [['NBeneficio', 'ASC']]
    });
    return res.send({
      success: true,
      message: beneficios
    });
  } catch (err) {
    console.log("error: ", err);
   return res.status(500).send({
      success: false,
      message: "Erro ao obter os benefícios."
    });
  }
};

// Get a Beneficio by ID
exports.getById = async (req, res) => {
  try {
    const beneficio = await Beneficio.findByPk(req.params.nbeneficio);
    if (beneficio) {
     return res.send({
        success: true,
        message: beneficio
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "O benefício não encontrado de ID: " + req.params.nbeneficio
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send({
      success: false,
      message: "Erro ao encontrar o benefício."
    });
  }
};

// Delete a Beneficio by ID
exports.delete = async (req, res) => {
  const nbeneficio = req.params.nbeneficio;
  try {
    const result = await Beneficio.destroy({ where: { NBeneficio: nbeneficio } });
    if (result === 0) {
      return res.status(404).send({
        success: false,
        message: "O benefício não encontrado de ID: " + nbeneficio
      });
    } else {
     return res.status(200).send({
        success: true,
        message: `O benefício foi apagado de ID: ${nbeneficio}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send({
      success: false,
      message: "Erro ao apagar o benefício."
    });
  }
};

// Update a Beneficio by ID
exports.updateById = async (req, res) => {
  const nbeneficio = req.params.nbeneficio;
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "O conteúdo não pode estar vazio."
    });
  }
  const result = await Beneficio.update(req.body, { where: { NBeneficio: nbeneficio } });
  try {
    if (result[0] === 0) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar o benefício de ID: ${nbeneficio}.`
      });
    } else {
      res.send({
        success: true,
        message: "O benefício foi atualizado com sucesso."
      })
      }
     } catch (error) {
        res.status(500).send({
          success: false,
            message: `Erro ao atualizar benefício: ${error} ` 
        })
      }
    }