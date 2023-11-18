const Candidatura = require("../models/candidaturas.model");
const Vaga = require('../models/vagas.model');
const Usuario = require('../models/usuarios.model')
const Email = require("../config/email-body")

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Candidatura
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  console.log(req.body);
  // Criar Novo Candidatura

  // Criar novo candidatura na base de dados
  try {
    const candidaturaExistente = await Candidatura.findOne(
      {
        where: {NUsuario: req.body.NUsuario, NVaga: req.body.NVaga, Estado: 1}
      })

      if(candidaturaExistente)
      return res.status(403).send(
        {
          success: false,
          message: "Um utilizador não pode se candidatar a mesma vaga mais de uma vez"
        }
      )

    const candidatura = await Candidatura.create(req.body);
    const data = await candidatura.reload({ include: [Usuario, Vaga] });
   return res.send({
      success: true,
      message: data
    });

  } catch (error) {
   return res.status(500).send({
      success: false,
      message: "Erro ao criar candidatura: " + error
    });
  }
};

// Get all Candidaturas
exports.getAll = async (req, res) => {
  const estado = req.query.estado;
  const nusuario = req.query.nusuario;
  const nvaga = req.query.nvaga;

  const whereClause = {};

  if (estado === '1') {
    whereClause.Estado = 1;
  }

  if (nusuario) {
    whereClause.NUsuario = nusuario;
  }

  if (nvaga) {
    whereClause.NVaga = nvaga;
  }

  try {
    const candidaturas = await Candidatura.findAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          attributes: ['Nome', 'Email']
        },
        {
          model: Vaga,
          attributes: ['NomeVaga', 'Subtitulo']
        }
      ],
      order: [['DataCandidatura', 'DESC']]
    });

    return res.send({
      success: true,
      message: candidaturas
    });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({
      success: false,
      message: "Erro ao obter candidaturas"
    });
  }
};
// Get a Candidatura by ID
exports.getById = async (req, res) => {
  try {
    const candidatura = await Candidatura.findByPk(req.params.ncandidatura,
      {
        include: [
          {
            model: Usuario,
            attributes: ['Nome', 'Email']
          },
          {
            model: Vaga,
            attributes: ['NomeVaga', 'Subtitulo']
          }
        ]
      });
    if (candidatura) {
      console.log("Candidatura encontrado: ", candidatura);
     return res.send({
        success: true,
        message: candidatura,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Candidatura não encontrada com o ID: " + req.params.ncandidatura
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({
      success: false,
      message: "Erro ao encontrar candidatura"
    });
  }
};

// Delete a Candidatura by ID
exports.delete = async (req, res) => {
  const ncandidatura = req.params.ncandidatura;
  try {
    const result = await Candidatura.destroy({ where: { NCandidatura: ncandidatura } });
    if (result === 0) {
     return res.status(404).send({
        success: false,
        message: "A candidatura não foi encontrada com o ID: " + ncandidatura
      });
    } else {
     return res.status(200).send({
        success: true,
        message: `A candidatura foi apagada com o ID: ${ncandidatura}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
  return  res.status(500).send({
      success: false,
      message: "Erro ao apagar candidatura"
    });
  }
}
// Update a Candidatura by ID
exports.updateById = async (req, res) => {
  const ncandidatura = req.params.ncandidatura;
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }

  try {
    var candidatura = await Candidatura.findOne({
      where: { NCandidatura: ncandidatura },
      include: [
        {
          model: Usuario,
          attributes: ['Nome', 'Email']
        },
        {
          model: Vaga,
          attributes: ['NomeVaga', 'Subtitulo']
        }
      ]
    });

    const [numRowsAffected] = await Candidatura.update(req.body, {
      where: { NCandidatura: ncandidatura }
    });
    if (numRowsAffected === 0) {
      if (!candidatura) {
        return res.status(404).send({
          success: false,
          message: `Impossível encontrar a candidatura de id: ${ncandidatura}.`
        });
      } else {
        return res.send({
          success: true,
          message: "Nenhum dado foi alterado"
        });
      }
    } else {
      if (req.body.Estagio && (req.body.Estagio === "Rejeitada" || req.body.Estagio === "Aceite")) {
    
        await Email.candidaturaResultado(
          candidatura.Usuario.Nome,
          candidatura.Usuario.Email,
          req.body.Estagio,
          candidatura.Vaga.NomeVaga
        );
      }

      return res.send({
        success: true,
        message: "Candidatura atualizada com sucesso!"
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Erro ao atualizar candidatura: ${error}`
    });
  }
};
