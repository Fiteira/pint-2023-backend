const Usuario = require("../models/usuarios.model");
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { verifyImageURL } = require('verify-image-url');

const cache = require("../config/cache");

// Definir os atributos desejados
const usuarioAttributes = [
  'NUsuario',
  'Nome',
  'Email',
  'NCargo',
  'Telefone',
  'Linkedin',
  'CV',
  'Foto',
  'DataNascimento',
  'Genero',
  'Localidade',
  'Estado',
  'DataHoraRegisto'
];

exports.getAll = async (req, res) => {
  const estado = req.query.estado;
  const NCargo = req.query.ncargo;

  try {
    let whereClause = {};

    if (estado === '1') {
      whereClause.Estado = 1;
    }

    if (NCargo) {
      const NCargoValues = NCargo.split(',');
      whereClause.NCargo = NCargoValues;
    }

    const data = await Usuario.findAll({
      where: whereClause,
      attributes: usuarioAttributes,
      order: [['NUsuario', 'ASC']]
    });

    return res.send({
      success: true,
      message: data
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).send({
      message: "Erro ao obter o utilizador.",
      success: false
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.nusuario, {
      attributes: usuarioAttributes
    });

    if (usuario) {
      return res.send({
        message: usuario,
        success: true
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Utilizador não encontrado com o ID: " + req.params.nusuario
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({
      message: "Erro ao encontrar o utilizador.",
      success: false
    });
  }
};


// apagar usuario
exports.delete = async (req, res) => {
  const nusuario = req.params.nusuario;
  try {
    const result = await Usuario.destroy({ where: { NUsuario: nusuario } });
    if (result === 0) {
     return res.status(404).send(
        {
          message: "Utilizador não encontrado de ID: " + nusuario,
          success: false
        }
      );
    } else {
     return res.status(200).send(
        {
          message: `Utilizador apagado de ID: ${nusuario}`,
          success: true
        }
      );
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return  res.status(500).send(
      {
        message: "Erro ao apagar o utilizador.",
        success: false
      }
    )

  }
};


exports.updateById = async (req, res) => {
  const schema = Joi.object({
    Telefone: Joi.string().allow('').allow(null).optional(),
    NCargo: Joi.number().allow(null).optional(),
    Linkedin: Joi.string().allow('').allow(null).optional(),
    CV: Joi.string().allow('').allow(null).optional(),
    Foto: Joi.string().allow('').allow(null).optional(),
    Genero: Joi.string().allow('').allow(null).optional(),
    DataNascimento: Joi.string().allow('').allow(null).optional(),
    Nome: Joi.string().required().optional(),
    Localidade: Joi.string().allow('').allow(null).optional()
  });
  try {
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send({
        success: false,
        message: "Erro de validação: " + validationResult.error.details[0].message
      });
    }

    const newNCargo = req.body.NCargo;
    const userId = req.params.nusuario;
    const userNCargo = req.user.NCargo;
    const userAuthId = req.user.NUsuario
    console.log(userNCargo);

    const usuario = await Usuario.findOne({ where: { NUsuario: userId } });
    if (!usuario) {
      return res.status(404).send({
        success: false,
        message: `Impossível encontrar o utilizador de ID: ${userId}.`
      });
    }

    if (newNCargo !== undefined && userNCargo !== 0 && newNCargo !== userNCargo) {
      return res.status(401).send({
        success: false,
        message: "Apenas os administradores podem alterar o campo NCargo."
      });
    }

    if(userNCargo !== 0 && userId != userAuthId)
    {
      return res.status(401).send({
        success: false,
        message: "Não tem permissão para alterar uma conta alheia."
      });

    }

    for (const field in req.body) {
      usuario[field] = req.body[field];
    }

    await usuario.save();

    cache.del(userId)
    res.send({
      success: true,
      message: "Utilizador atualizado com sucesso."
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Erro ao atualizar o utilizador: ${error}`
    });
  }
};