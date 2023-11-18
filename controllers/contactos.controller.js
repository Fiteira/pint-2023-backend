const Contactos = require("../models/contactos.model");


//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Contactos
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteudo não pode estar vazio!"
    });
  }
  console.log(req.body);
  // Criar Novo Contactos

  // Criar novo contacto na base de dados
  try {
    const contactos = await Contactos.create(req.body);
   return res.send(
      {
        success: true,
        message: contactos
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

  const ncliente = req.query.ncliente;
  const ordenar = (ncliente) ? {NCliente: ncliente } : {}

  try {
    const contactos = await Contactos.findAll({
      order: [['NContactos', 'ASC']],
      where: ordenar
    });

   return res.send({ success: true, message: contactos });
  } catch (err) {
    console.log("error: ", err);
  return  res.status(500).send({
      success: false,
      message: `Erro ao obter contacto: ${err}`
    });
  }
};

// Get a Contactos by ID
exports.getById = async (req, res) => {
  try {
    const contactos = await Contactos.findByPk(req.params.ncontacto);
    if (contactos) {
     return res.send({
        success: true,
        message: contactos
      })
    } else {
    return  res.status(404).send(
        {
          success: false,
          message: "Contacto não encontrado de id: " + req.params.ncontacto
        }
      )
    }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send(
      {
        success: false,
        message: "Erro ao encontrar o contacto de id: " + req.params.ncontacto
      }
    )
  }
};

// Delete a Contactos by ID
exports.delete = async (req, res) => {
  const ncontacto = req.params.ncontacto;
  try {
    const result = await Contactos.destroy({ where: { NContactos: ncontacto } });
    if (result === 0) {
     return res.status(404).send(
        {
          message: "Contactos não encontrado de id: " + ncontacto,
          success: false
        })

    } else {
     return res.status(200).send(
        {
          success: true,
          message: `Contacto apagado de id: ${ncontacto}`
        })
    }
  } catch (err) {
    console.log("erro na query: ", err);
    return res.status(500).send(
      {
        success: false,
        message: `Erro ao apagar contacto: ${err}`
      })
  }
};

// Update a Contactos by ID
exports.updateById = async (req, res) => {
  const ncontacto = req.params.ncontacto
  // Validate Request
  if (!req.body) {
   return res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio!"
    });
  }
  console.log(req.body);

  try {
    const result = await Contactos.update(req.body, { where: { NContactos: ncontacto } });
    if (result[0] === 0) {
     return res.status(404).send({
        success: false,
        message: `Impossível encontrar a contactos de id: ${ncontacto}.`
      });
    } else {
     return res.send({
        success: true,
        message: "Contactos atualizada com successo!"
      })
    }
  } catch (error) {
   return res.status(500).send({
      success: false,
      message: `Erro ao atualizar contacto: ${error} `
    })
  }
}