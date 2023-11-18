const Estagios = require("../models/estagios.model");
const Etiquetas = require("../models/etiquetas.model");
const Oportunidade = require("../models/oportunidades.model");
const Cliente = require("../models/cliente.model");
const Usuario = require("../models/usuarios.model");
const TiposProjeto = require("../models/tipoprojetos.model");

const includes = [
  { model: Etiquetas, attributes: ['Nome'] },
  { model: Estagios, attributes: ['Nome'] },
  {model: Cliente, attributes: ['NomeEmp', 'TelefoneEmp', 'EmailEmp']},
  {model: Usuario, attributes: ['Nome', 'NCargo'] },
  {model: TiposProjeto, attributes: ['Nome']}
]

// Create a new Oportunidade
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  // Criar Novo Oportunidade

  // Criar novo oportunidade na base de dados
  try {
    const oportunidade = await Oportunidade.create(req.body);
    const data = await oportunidade.reload({include: includes});
    return res.send({
      success: true,
      message: data
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Erro ao criar oportunidade: " + error
    });
  }
};

// Get all Oportunidades
exports.getAll = async (req, res) => {
  const nusuario = req.query.nusuario;
  const nestagio = req.query.nestagio;
  const ordem = req.query.ordem || 'desc'; // Valor padrão é 'asc' se não for fornecido

  try {
    let whereClause = {};

    if (nusuario) {
      whereClause.NUsuario = nusuario;
    }

    if (nestagio) {
      whereClause.NEstagio = nestagio;
    }

    const oportunidades = await Oportunidade.findAll({
      where: whereClause,
      include: includes,
      order: [['DataHoraCriacao', ordem]]

    });

    return res.send({
      success: true,
      message: oportunidades
    });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({
      success: false,
      message: "Erro ao obter oportunidades"
    });
  }
};

// Get a Oportunidade by ID
exports.getById = async (req, res) => {
  try {
    const oportunidade = await Oportunidade.findByPk(req.params.noportunidade,
      {
        include: includes
      });
    if (oportunidade) {
      return res.send({
        success: true,
        message: oportunidade,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Oportunidade não encontrada com o ID: " + req.params.noportunidade
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({
      success: false,
      message: "Erro ao encontrar oportunidade"
    });
  }
};

// Delete a Oportunidade by ID
exports.delete = async (req, res) => {
  const noportunidade = req.params.noportunidade;
  try {
    const result = await Oportunidade.destroy({ where: { NOportunidade: noportunidade } });
    if (result === 0) {
      return res.status(404).send({
        success: false,
        message: "Oportunidade não encontrada com o ID: " + noportunidade
      });
    } else {
      return res.status(200).send({
        success: true,
        message: `Oportunidade apagada com o ID: ${noportunidade}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send({
      success: false,
      message: "Erro ao apagar oportunidade"
    });
  }
}
// Update a Oportunidade by ID
exports.updateById = async (req, res) => {
  const noportunidade = req.params.noportunidade;
  // Validate Request
  if (!req.body) {
      return res.status(400).send({
          sucess: false,
          message: "Conteúdo não pode estar vazio!"
      });
  }
 
  try {
    const oportunidade = await Oportunidade.findByPk(noportunidade);
    if (!oportunidade) {
      return res.status(404).send({
        success: false,
        message: `Impossível encontrar a oportunidade de id: ${noportunidade}.`
      });
    }
    const result = await Oportunidade.update(req.body, { where: { NOportunidade: noportunidade } });
      if (result[0] === 0) {
          return res.send({
            success: true,
              message: `Nenhum registo foi atualizado pois os dados são iguais`
          });
      } else {
          return res.send({
              success: true,
              message: "Oportunidade atualizada com sucesso!"
          });
      }
  } catch (error) {
      return res.status(500).send({
          success: false,
          message: `Erro ao atualizar oportunidade: ${error}`
      });
  }
}
