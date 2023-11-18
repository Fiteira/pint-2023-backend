const Cliente = require("../models/cliente.model");
const Usuario = require("../models/usuarios.model");
//const Joi = require('joi');
//const Boom = require('@hapi/boom');

// Create a new Cliente
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
     return res.status(400).send({
        message: "Conteudo não pode estar vazio!"
      });
    }
    // Criar Novo Cliente

    // Criar novo cliente na base de dados
    try {
        const cliente = await Cliente.create(req.body);
        const data = await cliente.reload({  include: [
          { model: Usuario, attributes: ['Nome'] }]})

      return  res.send(
          {
            success: true,
            message: data
          }
        );
        
    } catch (error) {
        res.status(500).send("erro: " + error);
    }
   
  };
// Get all Clientes
exports.getAll = async (req, res) => {

  const nusuario = req.query.nusuario
  try {
    let clientes = (nusuario) ?
       await Cliente.findAll({
        order: [['NCliente', 'ASC']],
        include: [
          { model: Usuario, attributes: ['Nome'] }],
          where: {NUsuarioCriador: nusuario}
      }) :
      await Cliente.findAll({
        order: [['NCliente', 'ASC']],
        include: [
          { model: Usuario, attributes: ['Nome'] }] 
        })

     // console.log("Clientes: ", clientes);
     return res.send(
        {
          success: true,
          message: clientes
        }
      )
  } catch (err) {
      console.log("error: ", err);
     return res.status(500).send(
        {
          success: false,
          message:  "Erro ao obter clientes"
        }
      )
  }
};

// Get a Cliente by ID
exports.getById = async (req, res) => {
  try {
      const cliente = await Cliente.findByPk(req.params.ncliente,
        { include: [
          { model: Usuario, attributes: ['Nome'] }]});
      if (cliente) {
          console.log("Cliente encontrado: ", cliente);
         return res.send(
            {
              success: true,
              message: cliente
            }
          )

      } else {
       return res.status(404).send(
          {
            success: false,
            message: "Cliente não encontrado de id: " + req.params.ncliente
          }
        )
      }
  } catch (err) {
      console.log("erro na query: ", err);
     return res.status(500).send(
        {
          success: false,
          message:    "Erro ao encontrar cliente"
        })
  }
};

// Delete a Cliente by ID
exports.delete = async (req, res) => {
    const ncliente = req.params.ncliente;
  try {
      const result = await Cliente.destroy({ where: { NCliente: ncliente } });
      if (result === 0) {
      return  res.status(404).send(
          {
            success: false,
            message:  "Cliente não encontrado de id: " + ncliente
          }
        )
      } else {
       return res.status(200).send(
          {
            success: true,
           message: `Cliente apagado de id: ${ncliente}`
          }
          )
      }
  } catch (err) {
    console.log("erro na query: ", err);
   return res.status(500).send(

      {
        success: false,
        message:   "Erro ao apagar cliente"
      }
    )
      
  }
};

// Update a Cliente by ID
exports.updateById = async (req, res) => {
    const ncliente = req.params.ncliente
    // Validate Request
    if (!req.body) {
     return res.status(400).send({
        success: false,
        message: "Conteúdo não pode estar vazio!"
      });
    }
    const result = await Cliente.update(req.body, {where: {NCliente : ncliente}});
  try {
    if (result[0] === 0) {
       return res.status(404).send({
            success: false,
            message: `Impossível encontrar o cliente de id: ${ncliente}.`
        });
      } else {
        res.send({
          success: true,
           message: "Cliente atualizado com sucesso!"
        })
      }
  } catch (error) {
    return res.status(500).send({
        success: false,
        message: `Erro ao atualizar cliente: ${error} ` 
    })
    
  }
}
  
