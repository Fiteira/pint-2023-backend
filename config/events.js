
const UsuarioReunioes = require("../models/usuarioreunioes.model");
const Email = require("./email-body");
const Usuarios = require("../models/usuarios.model");
const Reunioes = require("../models/reunioes.model");

exports.verificarReunioesProximas = async () => {
  try {
    const reunioesProximas = await Reunioes.findAll();
    const userReunioes = await UsuarioReunioes.findAll();
    const users = await Usuarios.findAll();
    console.log(process.env.TZ);

    let agora = new Date();
    console.log("Verificação feita em: " + agora);
    console.log("Verificando se há reuniões próximas...");

    const promises = [];
    const reunioesAtualizar = [];

    for (const reuniao of reunioesProximas) {
      const dataHoraInicio = new Date(reuniao.DataHoraInicio);
      const dataHoraNotificacao = reuniao.DataHoraNotificacao ? new Date(reuniao.DataHoraNotificacao) : null;
     
      const usuarios = userReunioes
  .filter((ur) => ur.NReunioes === reuniao.NReunioes)
  .map((ur) => ur.dataValues.NUsuario);

  const filteredUsers = users.filter((user) => usuarios.includes(user.NUsuario));

  
           
      if (dataHoraNotificacao && dataHoraNotificacao < agora && reuniao.NotificacaoEnviada == 0) {
      for (const usuario of filteredUsers) {
        if (usuario) {
            const usermail = usuario.Email;
            const usernome = usuario.Nome;

           console.log("Enviando email...")
            promises.push(
              Email.notificacaoAReuniao(usermail, usernome, reuniao.DataHoraInicio, reuniao.DataHoraFim, reuniao.Titulo)
            );
          }
        }
        reunioesAtualizar.push(reuniao);
      }
    }

    // Wait for all emails to be sent
    await Promise.all(promises);

    // Update the NotificacaoEnviada field for the relevant reunioes
    for (const reuniao of reunioesAtualizar) {
      reuniao.NotificacaoEnviada = 1;
      await reuniao.save();
      console.log("Atualizado o campo NotificacaoEnviada da reunião:", reuniao.NReunioes);
    }

  } catch (e) {
    console.log("Erro ao verificar eventos " + e);
  }
};