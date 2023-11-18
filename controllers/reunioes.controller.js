const Reunioes = require("../models/reunioes.model");
const Usuario = require("../models/usuarios.model");

//const Joi = require('joi');
//const Boom = require('@hapi/boom');

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }

  // Criar Novo Reunioes

  // Criar novo reunioes na base de dados
  try {
    const DataHoraInicio = new Date(req.body.DataHoraInicio)
    const DataHoraFim = new Date(req.body.DataHoraFim)

    const noportunidade = req.body.NOportunidade
    const nentrevista = req.body.NEntrevista
    const tipo =  req.body.Tipo;

    if (isNaN(DataHoraInicio.getTime()) || isNaN(DataHoraFim.getTime())) {
      return res.status(400).send({
        success: false,
        message: "As datas de início e fim da reunião devem ser válidas."
      });
    }

    if (DataHoraInicio < new Date()) {
      return res.status(400).send({
        success: false,
        message: "O horário do início da reunião não pode ser no passado."
      });
    }

    if (DataHoraInicio > DataHoraFim) {
      return res.status(400).send({
        success: false,
        message: "O horário do fim da reunião não pode ser inferior ao horário de início."
      });
    }

    if((tipo === 0 && (!nentrevista || noportunidade)) || (tipo === 1 && (!noportunidade || nentrevista))
    || (tipo === 2 && (noportunidade || nentrevista)))
    {
      return res.status(400).send({
        success: false,
        message: "O NEntrevista ou NOportunidade não estão de acordo com o tipo"
      });
    }
 
    if(!req.body.Titulo)
    {
      req.body.Titulo = (tipo > 1) ? "Reunião" : (tipo === 0 ? "Reunião sobre entrevista" : "Reunião sobre oportunidade");
    }

    const reuniao = await Reunioes.create(req.body);
    const data = await reuniao.reload({include: [
      { model: Usuario, attributes: ['Nome'] }
    ]})
    res.send({
      success: true,
      message: data
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erro: " + error
    });
  }
};

// Get all Reunioess
exports.getAll = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const nentrevista = req.query.nentrevista;
    const noportunidade = req.query.noportunidade;
    
    let ordenar = {};

if (tipo) {
  ordenar.Tipo = tipo;
}

if (nentrevista) {
  ordenar.NEntrevista = nentrevista;
}

if (noportunidade) {
  ordenar.NOportunidade = noportunidade;
}
   
   
    const reunioess = await Reunioes.findAll({
      order: [['DataHoraInicio', 'ASC']],
      include: [
        { model: Usuario, attributes: ['Nome'] },
      ],
      where: ordenar,
      order: [['NReunioes', 'DESC']]
    });
    res.send({
      success: true,
      message: reunioess
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao obter reuniões"
    });
  }
};

// Get a Reunioes by ID
exports.getById = async (req, res) => {
  try {
    const reunioes = await Reunioes.findByPk(req.params.nreuniao,
      { include: [
        { model: Usuario, attributes: ['Nome'] },
      ]});
    if (reunioes) {
      console.log("Reunião encontrada: ", reunioes);
      res.send({
        success: true,
        message: reunioes
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Reunião não encontrada de id: " + req.params.reuniao
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao encontrar reuniões"
    });
  }
};

// Delete a Reunioes by ID
exports.delete = async (req, res) => {
  const reuniao = req.params.nreuniao;
  try {
    const result = await Reunioes.destroy({ where: { NReunioes: reuniao } });
    if (result === 0) {
      res.status(404).send({
        success: false,
        message: "Reunião não encontrada de id: " + reuniao
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Reunião apagada de id: ${reuniao}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    res.status(500).send({
      success: false,
      message: "Erro ao apagar reunião"
    });
  }
};

// Update a Reunioes by ID
exports.updateById = async (req, res) => {
  const reuniao = req.params.nreuniao;
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }
  console.log(req.body);
  try {
    const result = await Reunioes.update(req.body, { where: { NReunioes: reuniao } });

    if(!req.body.Titulo)
    {
      req.body.Titulo = req.body.Tipo === 0 ? "Reunião sobre entrevista" : "Reunião sobre oportunidade"
    }
    if (result[0] === 0) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar o reunioes de id: ${reuniao}.`
      });
    } else {
      res.send({
        success: true,
        message: "Reunião atualizada com sucesso"
      })
      }
     } catch (error) {
        res.status(500).send({
          success: false,
            message: `Erro ao atualizar reunião: ${error} ` 
        })
      }
    }