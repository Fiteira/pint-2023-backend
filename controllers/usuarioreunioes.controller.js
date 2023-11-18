const UsuarioReunioes = require("../models/usuarioreunioes.model");
const Usuario = require("../models/usuarios.model")
const Reunioes = require("../models/reunioes.model")
const Entrevista = require("../models/entrevista.model")
const email_sender = require("../config/email-body");

const include = [
  {
    model: Reunioes,
    include: [Usuario]
  },
  {
    model: Usuario,
    attributes: ['Nome']
  }
];

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio."
    });
  }

  try {

      let descricao = 'Sem Descrição'
        // buscar reunião
        const reuniao = await Reunioes.findOne({ where: { NReunioes: req.body.NReunioes } });
        if (!reuniao) {
          return res.status(404).send({ message: "Reunião não encontrada", success: false });
        }
   
       // Buscar a entrevista
       let entrevista;
  

        descricao = reuniao.Descricao
       
       
       
    // Buscar o objeto Usuário
    const user = await Usuario.findOne({ where: { NUsuario: req.body.NUsuario } });
    if (!user) {
      return res.status(404).send({ message: "Utilizador não encontrado.", success: false });
    }

     // Criar Nova Indicação
     const topicosdaideias = await UsuarioReunioes.create(req.body);
     const data = await topicosdaideias.reload({ include: include });

    console.log(user.Email + user.Nome, reuniao.DataHoraInicio + descricao)
    email_sender.conviteAReuniao(user.Email, user.Nome, reuniao.DataHoraInicio, reuniao.DataHoraFim, descricao, reuniao.Titulo)

    return res.send({ message: data, success: true });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao criar o utilizador da reunião: " + error , success: false });
  }
};
// Get all Indicações
exports.getAll = async (req, res) => {
  try {
    const nreuniao = req.query.nreuniao;
    const nusuario = req.query.nusuario;
    let usuarioReunioes;

    if (nusuario && nreuniao) {
      usuarioReunioes = await UsuarioReunioes.findAll({ where: { NUsuario: nusuario, NReunioes: nreuniao }, include: include });
    } else if (!nusuario && nreuniao) {
      usuarioReunioes = await UsuarioReunioes.findAll({ where: { NReunioes: nreuniao },  include: include  });
    } else if (nusuario && !nreuniao) {
      usuarioReunioes = await UsuarioReunioes.findAll({ where: { NUsuario: nusuario },  include: include  });
    } else {
      usuarioReunioes = await UsuarioReunioes.findAll({ include: include });
    }

  
      
      return res.send({ success: true, message: usuarioReunioes });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).send({ message: "Erro ao obter o utilizador da reunião.", success: false });
  }
};
  
  // Get a Indicação by ID
  exports.getById = async (req, res) => {
    try {
      const NIdeia = req.params.nideia;
      const NTopicoIdeia = req.params.nusuarioreuniao
      const usuarioReunioes =  await UsuarioReunioes.findOne({
        where: {
          NIdeia,
          NTopicoIdeia
        }
      });
  
      if (usuarioReunioes) {
        console.log("Topicos da ideia encontrada: ", usuarioReunioes);
        return res.send({ message: usuarioReunioes, success: true });
      } else {
        return res.status(404).send({ message: `O utilizador da reunião não encontrado de ID: ${NTopicoIdeia}`, success: false });
      }
  
    } catch (err) {
      console.log("erro na query: ", err);
      return res.status(500).send({ message: "Erro ao encontrar o utilizador da reunião: " + err, success: false });
    }
  };

  // Delete a UsuarioReunioes by ID
  exports.delete = async (req, res) => {
    const nusuario = req.query.nusuario;
    const nreuniao = req.query.nreuniao;
    try {
        let whereCondition = {};

        if (nusuario && nreuniao) {
            whereCondition = { NUsuario: nusuario, NReunioes: nreuniao };
        } else if (nusuario) {
            whereCondition = { NUsuario: nusuario };
        } else if (nreuniao) {
            whereCondition = { NReunioes: nreuniao };
        } else {
            return res.status(400).send({
                success: false,
                message: "Por favor, forneça pelo menos um parâmetro de pesquisa válido (nusuarior, nreuniao)"
            });
        }

        const result = await UsuarioReunioes.destroy({ where: whereCondition });

        if (result === 0) {
            res.status(404).send({
                success: false,
                message: "Nenhum registo encontrado para exclusão."
            });
        } else {
            res.status(200).send({
                success: true,
                message: `O(s) utilizador(es) da reunião foi(foram) excluído(s) com sucesso.`
            });
        }
    } catch (err) {
        console.log("Erro na query: ", err);
        res.status(500).send({
            success: false,
            message: "Erro ao excluir o utilizador da reunião."
        });
    }
};