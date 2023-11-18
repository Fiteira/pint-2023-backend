const Entrevista = require("../models/entrevista.model");
const Candidatura = require("../models/candidaturas.model")
const Usuario = require("../models/usuarios.model")
const Vaga = require("../models/vagas.model")
const Reunioes = require("../models/reunioes.model")

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

const email_sender = require("../config/email-body");
const include =  [
  {
    model: Candidatura,
    include: [
      {
        model: Vaga,
        attributes: ['NomeVaga'],
      },
      {
        model: Usuario,
        attributes: ['Nome', 'NUsuario'],
      },
    ]
  }
  ]

// Create a new Entrevista
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
     return res.status(400).send({
        success: false,
        message: "Conteudo não pode estar vazio!"
      });
    }
    // Criar Novo Entrevista
  
    // Criar novo entrevista na base de dados
    try {
       // caso sucedida, enviaremos a convocatória ao candidato
       const cand = await Candidatura.findOne({where : {NCandidatura : req.body.NCandidatura }})
       if (!cand ) {
        return res.status(404).send({ message: "Candidatura não encontrada", success: false });
      }
       const user = await Usuario.findOne({ where: { NUsuario: cand.NUsuario } });
       if (!user ) {
        return res.status(404).send({ message: "Utilizador não encontrado", success: false });
      }
       const vaga = await Vaga.findOne({where: {NVaga : cand.NVaga} })
   
       email_sender.convocacaoEntrevista(user.Email, user.Nome, vaga.NomeVaga)
       
      const entrevista = await Entrevista.create(req.body)
      const data = await entrevista.reload({ include: include});
      return res.send({
        success: true,
        message: data
      });
  
    } catch (error) {
    return  res.status(500).send({
        success: false,
        message: "Erro ao criar entrevista: " + error
      });
    }
  };

// Get all Entrevistas

exports.getAll = async (req, res) => {
  const ncandidatura = req.query.ncandidatura;

  let whereClause = {};
  if (ncandidatura) {
    whereClause.NCandidatura = ncandidatura;
  }

  try {
    const entrevistas = await Entrevista.findAll({
      order: [['NEntrevista', 'DESC']],
      where: whereClause,
      include: include
    });

    const entrevistasWithEstado = await Promise.all(entrevistas.map(async entrevista => {
      const reuniao = await Reunioes.findOne({
        where: { NEntrevista: entrevista.NEntrevista },
      });
      console.log(reuniao)
      const Estado = reuniao ? (reuniao.DataHoraFim < new Date() ? 'Finalizada' : 'Pendente') : 'Pendente';

      return {
        ...entrevista.toJSON(),
        Estado,
      };
    }));

    return res.send({
      success: true,
      message: entrevistasWithEstado,
    });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({
      success: false,
      message: "Erro ao obter entrevistas",
    });
  }
};

// Get a Entrevista by ID
exports.getById = async (req, res) => {
  try {
    const entrevista = await Entrevista.findByPk(req.params.nentrevista,
      {include: include});

    if (entrevista) {
      const reuniao = await Reunioes.findOne({
        where: { NEntrevista: entrevista.NEntrevista },
      });

      const Estado = reuniao ? (reuniao.DataHoraFim > new Date() ? 'Finalizada' : 'Pendente') : 'Pendente';

      const entrevistaWithEstado = {
        ...entrevista.toJSON(),
        Estado,
      };

      return res.send({
        success: true,
        message: entrevistaWithEstado,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Entrevista não encontrada com o ID: " + req.params.nentrevista,
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({
      success: false,
      message: "Erro ao encontrar entrevista",
    });
  }
};
// Delete a Entrevista by ID
exports.delete = async (req, res) => {
  const nentrevista = req.params.nentrevista;
  try {
    const result = await Entrevista.destroy({ where: { NEntrevista: nentrevista } });
    if (result === 0) {
    return  res.status(404).send({
        success: false,
        message: "Entrevista não encontrada com o ID: " + nentrevista
      });
    } else {
     return res.status(200).send({
        success: true,
        message: `Entrevista apagada com o ID: ${nentrevista}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send({
      success: false,
      message: "Erro ao apagar entrevista"
    });
  }
}
// Update a Entrevista by ID
exports.updateById = async (req, res) => {
  const nentrevista = req.params.nentrevista;
  // Validate Request
  if (!req.body) {
      return res.status(400).send({
          sucess: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
  ;
try {
  const result = await Entrevista.update(req.body, { where: { NEntrevista: nentrevista } });
  if (result[0] === 0) {
    const candidatura = await Entrevista.findOne({ where: { NEntrevista: nentrevista } });
    if (!candidatura) {
     return res.status(404).send({
        success: false,
        message: `Impossível encontrar a entrevista de id: ${nentrevista}.`
      });
    } else {
     return res.send({
        success: true,
        message: "Nenhum dado foi atualizado porque os valores são iguais."
      });
    }
  } else {
   return res.send({
      success: true,
      message: "Entrevista atualizada com sucesso!"
    });
  }
} catch (error) {
 return res.status(500).send({
    success: false,
    message: `Erro ao atualizar entrevista: ${error}`
  });
}
}