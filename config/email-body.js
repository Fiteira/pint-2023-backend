const transporter = require("./nodemailer")
const defaultEmail = process.env.EMAIL 
const website = process.env.WEBSITE 

const options = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  timeZone: process.env.TIMEZONE || 'Europe/Lisbon' // Defina o fuso horário de Portugal aqui
};
const verificarEmail = async (email, code) => {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Verificação de email',
      html:
        `
       <html>
          <head>
            <style>
              /* Estilos CSS inline */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #f7f7f7;
              }
              h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #444444;
              }
              p {
                margin-bottom: 20px;
                color: #777777;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <h1>Verificação de email</h1>
            <p>Olá! Clique no botão abaixo para validar seu endereço de email.</p>
            <a href="${website}/validaremail?code=${code}" class="button">Validar email</a>
          </body>
        </html>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Erro sending email: ' + error);
        //res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        // res.send('Email sent successfully!');
      }
    });
  }

  const contaCriadaPorAdmin = async (email, code) => {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Conta disponível na plataforma',
      html:
        `
       <html>
          <head>
            <style>
              /* Estilos CSS inline */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #f7f7f7;
              }
              h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #444444;
              }
              p {
                margin-bottom: 20px;
                color: #777777;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <h1>Conta criada pela administração</h1>
            <p>Olá! A sua conta na plataforma já está disponível, use o link abaixo para definir sua password.</p>
            <a href="${website}/inserirpass?resetpassword=${code}" class="button">Definir password</a>
          </body>
        </html>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Erro sending email: ' + error);
        //res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        // res.send('Email sent successfully!');
      }
    });
  }

  const resetPassword = async (email, code) => {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Redefinir password',
      html:
        `
       <html>
          <head>
            <style>
              /* Estilos CSS inline */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #f7f7f7;
              }
              h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #444444;
              }
              p {
                margin-bottom: 20px;
                color: #777777;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <h1>Redefinir password</h1>
            <p>Olá! Aceda ao link para redefinir a password</p>
            <a href="${website}/inserirpass?resetpassword=${code}" class="button">Redefinir password</a>
          </body>
        </html>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Erro sending email: ' + error);
        //res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        // res.send('Email sent successfully!');
      }
    });
  }

  async function mandarEmailIndicacao(email, nomeCand, nomeUsuario, nomeVaga, nVaga) {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Indicação à vaga',
      html: `
        <html>
          <head>
            <style>
              p {
                font-size: 16px;
                font-family: Arial, sans-serif;
              }
              .nome-candidato {
                font-weight: bold;
              }
              .vaga-indicada {
                font-style: italic;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <p>Olá <span class="nome-candidato">${nomeCand}</span>,</p>
            <p>Você foi indicado para a vaga <span class="vaga-indicada">${nomeVaga}</span> por ${nomeUsuario}.
            <a href="${website}/vagas/${nVaga}" class="button">Ver Vaga</a>
            </p>
          </body>
        </html>
      `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       // res.send('Email sent successfully!');
      }
    });
  }
  

  async function conviteAReuniao(email, nomeUsuario, dataHora, dataHoraFim, detalhes, nome ) {
    
    const dateTimeFormat = new Intl.DateTimeFormat('pt-PT', options);
    const formattedDataHora = dateTimeFormat.format(new Date(dataHora));
    const formattedDataHoraFim = dateTimeFormat.format(new Date(dataHoraFim));
  

    let mailOptions = {
    from: defaultEmail,
    to: email,
    subject: 'Convite a Reunião',
    html: `
      <html>
        <head>
          <style>
            p {
              font-size: 16px;
              font-family: Arial, sans-serif;
            }
            .nome-candidato {
              font-weight: bold;
            }
            .vaga-indicada {
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
          <p>Você foi convidado a participar da reunião ${nome} que começa em: ${formattedDataHora} e termina em: ${formattedDataHoraFim}. Mais detalhes:</p>
          <p>${detalhes}</p>
        </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      // res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      // res.send('Email sent successfully!');
    }
  });
}

  async function notificacaoAReuniao(email, nomeUsuario, dataHora, dataHoraFim, titulo ) {
    const dateTimeFormat = new Intl.DateTimeFormat('pt-PT', options);
    const formattedDataHora = dateTimeFormat.format(new Date(dataHora));
    const formattedDataHoraFim = dateTimeFormat.format(new Date(dataHoraFim));
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Reunião Próxima',
      html: `
        <html>
          <head>
            <style>
              p {
                font-size: 16px;
                font-family: Arial, sans-serif;
              }
              .nome-candidato {
                font-weight: bold;
              }
              .vaga-indicada {
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
            <p>Gostariamos de notificar que a reunião ${titulo} começará em breve as: ${formattedDataHora}</p>
          </body>
        </html>
      `
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        // res.send('Email sent successfully!');
      }
    });
  }

    async function convocacaoEntrevista(email, nomeUsuario, nomeVaga ) {
      let mailOptions = {
        from: defaultEmail,
        to: email,
        subject: 'Convocação a entrevista de emprego',
        html: `
          <html>
            <head>
              <style>
                p {
                  font-size: 16px;
                  font-family: Arial, sans-serif;
                }
                .nome-candidato {
                  font-weight: bold;
                }
                .vaga-indicada {
                  font-style: italic;
                }
              </style>
            </head>
            <body>
              <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
              <p>A sua entrevista de emprego para a vaga <span class="vaga-indicada">${nomeVaga}</span> foi confirmada.
              Em breve receberá um email com os detalhes da reunião.</p>
            </body>
          </html>
        `
      };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       // res.send('Email sent successfully!');
      }
    });
  }

  async function relatorioIdeiaAutor(relatorioAutor,  tipo, nomeUsuario, email ) {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: `Ideia ${(tipo == 0) ? "rejeitada" : "aprovada"}`,
      html: `
        <html>
          <head>
            <style>
              p {
                font-size: 16px;
                font-family: Arial, sans-serif;
              }
              .nome-candidato {
                font-weight: bold;
              }
              .vaga-indicada {
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
            <p>
              A sua ideia foi ${(tipo == 0) ? "rejeitada" : "aprovada"}:</p>
              
            <p>${relatorioAutor}
          </body>
        </html>
      `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       // res.send('Email sent successfully!');
      }
    });
  }

  async function relatorioIdeiaAdm(relatorioAdm, nomeUsuario, email ) {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: `Uma nova ideia foi aprovada`,
      html: `
        <html>
          <head>
            <style>
              p {
                font-size: 16px;
                font-family: Arial, sans-serif;
              }
              .nome-candidato {
                font-weight: bold;
              }
              .vaga-indicada {
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
            <p>
              Queremos informa-lo que um gestor de ideias
              aprovou uma nova ideia que poderá ser relevante para a administração, veja os detalhes:</p>
              
            <p>${relatorioAdm}
          </body>
        </html>
      `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       // res.send('Email sent successfully!');
      }
    });
  }

  async function candidaturaResultado(nomeUsuario, email, estagio, nomeVaga ) {
    
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: `Candidatura para ${nomeVaga} foi ${estagio}`,
      html: `
        <html>
          <head>
            <style>
              p {
                font-size: 16px;
                font-family: Arial, sans-serif;
              }
              .nome-candidato {
                font-weight: bold;
              }
              .vaga-indicada {
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
            <p>
              Queremos informá-lo que a sua candidatura para ${nomeVaga}
              foi ${estagio}</p>
          </body>
        </html>
      `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       // res.send('Email sent successfully!');
      }
    });
  }


  module.exports =
  {
    resetPassword,
    verificarEmail,
    contaCriadaPorAdmin,
    conviteAReuniao,
    convocacaoEntrevista,
    mandarEmailIndicacao,
    notificacaoAReuniao,
    relatorioIdeiaAutor,
    relatorioIdeiaAdm,
    candidaturaResultado
  }