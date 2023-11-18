const RelatorioIdeia = require("../models/relatorioideia.model");
//const Joi = require('joi');
//const Boom = require('@hapi/boom');
const Email = require("../config/email-body")
const Usuarios = require("../models/usuarios.model")
const Ideias = require("../models/ideias.model")


exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }

  // Criar Novo RelatorioIdeia

  // Criar novo relatorioideia na base de dados
  try {
    const ideia = await Ideias.findByPk(req.body.NIdeia);
    const user = await Usuarios.findByPk(ideia.NUsuario);

    const nao_notificar_adm = req.query.nao_notificar_adm

    // Send email to the author
    await Email.relatorioIdeiaAutor(req.body.ApontamentosAutor, req.body.Tipo, user.Nome, user.Email);

    if (req.body.Tipo === 1 && !nao_notificar_adm) {
      console.log("Enviando notificação para a administração...")
      const usersadm = await Usuarios.findAll({ where: { NCargo: 0 } });

      await Promise.all(
        usersadm.map((u) => Email.relatorioIdeiaAdm(req.body.ApontamentosAdm, u.Nome, u.Email))
      );
    }
    

    const data = await RelatorioIdeia.create(req.body);

    return res.send({
      success: true,
      message: data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to create relatorioideia",
    });
  }
};

// Get all RelatorioIdeias
exports.getAll = async (req, res) => {
  try {
    const relatorioideias = await RelatorioIdeia.findAll({
      order: [['NRelatorioIdeia', 'ASC']]
    });
    return res.send({
      success: true,
      message: relatorioideias
    });
  } catch (err) {
    console.log("error: ", err);
   return res.status(500).send({
      success: false,
      message: "Erro ao obter relatorioideias"
    });
  }
};

// Get a RelatorioIdeia by ID
exports.getById = async (req, res) => {
  try {
    const relatorioideia = await RelatorioIdeia.findByPk(req.params.nrelatorioideia);
    if (relatorioideia) {
      console.log("RelatorioIdeia encontrado: ", relatorioideia);
     return res.send({
        success: true,
        message: relatorioideia
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "RelatorioIdeia não encontrado de id: " + req.params.nrelatorioideia
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send({
      success: false,
      message: "Erro ao encontrar relatorioideia"
    });
  }
};

// Delete a RelatorioIdeia by ID
exports.delete = async (req, res) => {
  const nrelatorioideia = req.params.nrelatorioideia;
  try {
    const result = await RelatorioIdeia.destroy({ where: { NRelatorioIdeia: nrelatorioideia } });
    if (result === 0) {
      return res.status(404).send({
        success: false,
        message: "RelatorioIdeia não encontrado de id: " + nrelatorioideia
      });
    } else {
     return res.status(200).send({
        success: true,
        message: `RelatorioIdeia apagado de id: ${nrelatorioideia}`
      });
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send({
      success: false,
      message: "Erro ao apagar relatorioideia"
    });
  }
};

// Update a RelatorioIdeia by ID
exports.updateById = async (req, res) => {
  const nrelatorioideia = req.params.nrelatorioideia;
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }
  console.log(req.body);
  const result = await RelatorioIdeia.update(req.body, { where: { NRelatorioIdeia: nrelatorioideia } });
  try {
    if (result[0] === 0) {
      res.status(404).send({
        success: false,
        message: `Impossível encontrar o relatorioideia de id: ${nrelatorioideia}.`
      });
    } else {
      res.send({
        success: true,
        message: "RelatorioIdeia atualizado com sucesso"
      })
      }
     } catch (error) {
        res.status(500).send({
          success: false,
            message: `Erro ao atualizar relatorioideia: ${error} ` 
        })
      }
    }