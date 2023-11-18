const Indicacao = require("../models/indicacoes.model");
const Vaga = require('../models/vagas.model');
const Usuario = require('../models/usuarios.model')
const email_sender = require("../config/email-body");
const Joi = require('joi');


//const Joi = require('joi');
//const Boom = require('@hapi/boom');


// Create a new Indicacao
exports.create = async (req, res) => {
  // Define Joi schema for validation
  const schema = Joi.object({
    EmailCand: Joi.string().email().required().messages({
      'string.email': 'O email deve ser válido.',
      'any.required': 'O email é obrigatório.'
    }),
    NomeCand: Joi.string().min(3).required().messages({
      'string.min': 'O nome deve ter pelo menos {#limit} caracteres.',
      'any.required': 'O campo nome é obrigatório.'
    }),
    LINKEDIN: Joi.string().allow('', null),
    CV: Joi.string().allow('', null),
    TelefoneCand: Joi.string().allow('', null),
    NVaga: Joi.number().integer(),
    NUsuario: Joi.number().integer()
  });

  // Validate request body
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    language: {
      any: {
        required: '!!{{label}} é um campo obrigatório.',
        empty: '!!{{label}} não pode estar vazio.'
      },
      string: {
        email: '!!{{label}} deve ser um email válido.',
        min: '!!{{label}} deve ter pelo menos {#limit} caracteres.'
      }
    }
  });

  if (error) {
    // Format Joi error messages
    const errorMessage = error.details.map((detail) => detail.message.replace(/['"]+/g, '')).join(' ');

    return res.status(400).send({
      success: false,
      message: errorMessage,

    });
  }

  // Create a new Indicação
  try {
    const indicacao = await Indicacao.create(req.body);
    const data = await indicacao.reload({ include: [Vaga, Usuario] });

    const user = await Usuario.findOne({ where: { NUsuario: indicacao.NUsuario } });
    const vaga = await Vaga.findOne({ where: { NVaga: indicacao.NVaga } });

    // If everything went well, send the email
    try {
      if(user && vaga)
      await email_sender.mandarEmailIndicacao(data.EmailCand, data.NomeCand, user.Nome, vaga.NomeVaga, vaga.NVaga);
      else
      return res.status(404).send({
        success: false,
        message: "Vaga ou utilizador não encontrados"
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: "Erro ao enviar e-mail de indicação." });
    }

    return res.send({ message: data, success: true });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao criar indicação.", success: false, error });
  }
};

// Get all Indicações
exports.getAll = async (req, res) => {
  try {
    const nvaga = req.query.nvaga;

    let whereClause = {};
    if(nvaga)
    whereClause.NVaga = nvaga;
    const indicacoes = await Indicacao.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['Nome']
        },
        {
          model: Vaga,
          attributes: ['NomeVaga']
        }
      ],
      where: whereClause,
      order: [['NIndicacao', 'DESC']]
    });

    return res.send({ message: indicacoes, success: true, });

  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({ message: "Erro ao obter indicações.", success: false});
  }
};

// Get a Indicação by ID
exports.getById = async (req, res) => {
  try {
    const indicacao = await Indicacao.findByPk(req.params.nindicacao, {
      include: [
        {
          model: Usuario,
          attributes: ['Nome']
        },
        {
          model: Vaga,
          attributes: ['NomeVaga']
        }
      ]
    });

    if (indicacao) {
      console.log("Indicação encontrada: ", indicacao);
      return res.send({ message: indicacao, success: true });
    } else {
      return res.status(404).send({ message: `Indicação não encontrada de id: ${req.params.nindicacao}`, success: false });
    }

  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({ message: "Erro ao encontrar indicação: " + err, success: false });
  }
};

// Delete a Indicacao by ID
exports.delete = async (req, res) => {
  const nindicacao = req.params.nindicacao;
  try {
      const result = await Indicacao.destroy({ where: { NIndicacao: nindicacao } });
      if (result === 0) {
        return  res.status(404).send({
              success: false,
              message: `Indicacao não encontrada com o ID: ${nindicacao}.`
          });
      } else {
        return  res.status(200).send({
              success: true,
              message: `Indicacao excluída com sucesso. ID: ${nindicacao}`
          });
      }
  } catch (err) {
      console.log("Erro na query: ", err);
      return res.status(500).send({
          success: false,
          message: "Erro ao excluir Indicacao."
      });
  }
};

// Update a Indicacao by ID
exports.updateById = async (req, res) => {
  const nindicacao = req.params.nindicacao;
  // Validate Request
  if (!req.body) {
      return res.status(400).send({
          success: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  console.log(req.body);
  try {
      const result = await Indicacao.update(req.body, { where: { NIndicacao: nindicacao } });
      if (result[0] === 0) {
          return res.status(404).send({
              success: false,
              message: `Indicacao não encontrada com o ID: ${nindicacao}.`
          });
      } else {
         return res.send({
              success: true,
              message: `Indicacao atualizada com sucesso. ID: ${nindicacao}`
          });
      }
  } catch (error) {
     return res.status(500).send({
          success: false,
          message: `Erro ao atualizar Indicacao: ${error}`
      });
  }
};
