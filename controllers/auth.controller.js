// Importar o modelo de usuário
const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const auth = require('../config/passport')
const { verifyImageURL } = require('verify-image-url');
const cache = require("../config/cache");
const Joi = require('joi');

//const transporter = require("../config/nodemailer")
const email_sender = require("../config/email-body");
const { func } = require('joi');

const website = process.env.WEBSITE || 'https://pint-2023.netlify.app'

const picture = process.env.PROFPICTURE || 'https://res.cloudinary.com/dr2x19yhh/image/upload/v1685533187/default-picture_egbowx.png'


exports.login = async (req, res) => {
  if (!req.body.Email) {
    return res.status(400).send({
      success: false,
      message: "O email está vazio."
    })
  }

  if (!req.body.Senha) {
    return res.status(400).send({
      success: false,
      message: "A password está vazia."
    })
  }

  let user;
  try {
    user = await Usuario.findOne({ where: { Email: req.body.Email } });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "O email ou a password estão incorretos."

      })
    }
  } catch (error) {
    res.status(500).send(
      {
        success: false,
        message: "Erro ao verificar o email: " + error
      }
    )
  }


  // Usuário encontrado
  console.log("usuario encontrado: " + user.Email);

  // Verifica se o usuário está ativado.
  if (user.Estado === 0) {
    res.status(401).send(
      {
        success: false,
        message: "A conta está desativada. Por favor, verifique o seu email ou contacte a adminstração."
      }
    )
  }

  // Verificiar password´

  try {
    if (bcrypt.compareSync(req.body.Senha, user.Senha)) {
      const payload =
      {
        email: user.Email,
        id: user.NUsuario
      }
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" })

      return res.status(200).send(
        {
          success: true,
          message: "Bearer " + token
        })
    }
    else {
      return res.status(401).send(
        {
          message: "O email ou a password estão incorretos.",
          success: false
        })
    }

  } catch (error) {
    res.status(500).send(
      {
        message: "Erro de autenticação: " + error,
        success: false
      }
    );
  }
}

exports.register = async (req, res) => {

  const schema = Joi.object({
    Nome: Joi.string().min(3).required().messages({
      'string.base': 'O nome deve ser uma string válida',
      'string.empty': 'O nome não pode estar vazio',
      'string.min': 'O nome deve ter no mínimo {#limit} caracteres'
    }),
    Email: Joi.string().email().required().messages({
      'string.base': 'O e-mail deve ser uma string válida',
      'string.empty': 'O e-mail não pode estar vazio',
      'string.email': 'O e-mail deve ser um endereço de e-mail válido'
    }),
    Senha: Joi.string().min(6).regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required().messages({
      'string.base': 'A palavra-passe deve ser uma string válida',
      'string.empty': 'A palavra-passe não pode estar vazia',
      'string.min': 'A palavra-passe deve ter no mínimo {#limit} caracteres',
      'string.pattern.base': 'A palavra-passe deve conter pelo menos uma letra e um número'
    }),
    Genero: Joi.string().required().messages({
      'string.base': 'O género deve ser uma string válida',
      'string.empty': 'O género não pode estar vazio'
    }),
    DataNascimento: Joi.date().required().messages({
      'date.base': 'A data de nascimento deve ser uma data válida',
      'date.empty': 'A data de nascimento não pode estar vazia',
      'date.format': 'A data de nascimento deve estar no formato ISO'
    }),
    Telefone: Joi.string().allow('', null).optional(),
    Linkedin: Joi.string().allow('', null).optional(),
    Localidade: Joi.string().allow('', null).optional()
  });
  
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    // Se houver erros de validação, mapear as mensagens de erro e retornar uma resposta com os erros
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).send({
      message: errorMessages[0],
      success: false
    });
  }
  
  // Criar novo Usuario



  // Verificar se o email não está cadastrado
  try {
    const user = await Usuario.findOne({ where: { Email: req.body.Email } });
    if (user) {
      return res.status(500).send({
        success: false,
        message: "O email já está registado."

      })
    }
  } catch (error) {
    res.status(500).send(
      {
        success: false,
        message: "Erro ao verificar o email do utilizador: " + error
      }
    )
  }
  // Define o estado = 0, até que verifique o email
  req.body.Estado = 0;
  // Encriptar password
  const salt = await bcrypt.genSalt();
  req.body.Senha = await bcrypt.hash(req.body.Senha, salt);


  // Criar token para validar email
  const payload =
  {
    email: req.body.Email,
  }
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "15m" })

  // Definir token de validação na BD
  req.body.TokenEmail = token

  // Mandar email de verificação
  email_sender.verificarEmail(req.body.Email, token);

  // Define o cargo padrão como 1 "Utilizador externo"
  req.body.NCargo = 1;

  req.body.Foto = picture

  try {
    const data = await Usuario.create(req.body);
    res.send({
      message: data,
      success: true

    });

  } catch (error) {
    res.status(500).send(
      {
        message: "Erro ao criar o utilizador: " + error,
        success: false
      })
  }
}

exports.validarEmail = async function (req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send(
      {
        message: "Código não fornecido.",
        success: false
      }
    );
  }

  try {
    const user = await Usuario.findOne({ where: { TokenEmail: code } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Código inválido."
      }
      );
    }

    // Marque o email do usuário como verificado
    try {
      user.TokenEmail = null;
      user.Estado = 1;
      console.log("estado: " + user.Estado);
      await user.save();
    } catch (error) {
      console.log("Erro ao atualizar o utilizador: " + error)
      return res.status(500).send({
        message: "Erro ao validar o código: " + error,
        success: false
      });
    }


    return res.send({
      message: "Código validado.",
      success: true
    }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Erro ao validar o código: " + error,
      success: false
    });
  }
};

exports.requestResetPassword = async function (req, res) {
  const email = req.body.Email
  if (!email) {
    res.status(400).send({
      message: "É preciso o email.",
      success: false
    });
  }
  try {
    const user = await Usuario.findOne({ where: { Email: email } });
    if (!user) {
      res.status(404).send(
        {
          success: false,
          message: "Não existe nenhum utilizador com esse e-mail."
        })
    }

    if (user.Estado === 0) {
      res.status(400).send(
        {
          success: false,
          message: "Não é permitido redefinir a password de um utilizador desativado."
        }
      )
    }
    const payload =
    {
      email: req.body.Email,
    }
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "15m" })
    // Definir token de validação na BD
    user.TokenEmail = token;

    user.save();

    // Mandar email de verificação
    try {
      email_sender.resetPassword(req.body.Email, token);
    } catch (error) {
      console.log("erro no email :" + error)
      res.status(500).send(
        {
          success: false,
          message: "Erro ao enviar o email."
        })
    }

    res.send(
      {
        success: true,
        message: "O email para a redefinição da password foi enviado."
      }
    )

  } catch (error) {
    console.log("erro redefinir password " + error)
    res.status(500).send(
      {
        success: false,
        message: "Erro ao redefinir a password."
      }
    )
  }
}


exports.resetPassword = async function (req, res) {
  const code = req.query.code;
  const senha = req.body.Senha;

  if (!code) {
    console.log("Erro: código não fornecido.")
    return res.status(400).send(
      {
        message: "Código não fornecido.",
        success: false
      }
    );
  }

  if (!senha) {
    console.log("Erro, Password não fornecida")
    return res.status(400).send(
      {
        message: "Password não fornecida.",
        success: false
      }
    );
  }

  try {
    const user = await Usuario.findOne({ where: { TokenEmail: code } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Código inválido."
      }
      );
    }

    // Marco o estado da conta como ativado e criptografa a password
    try {
      const salt = await bcrypt.genSalt();
      req.body.Senha = await bcrypt.hash(req.body.Senha, salt);
      user.Senha = req.body.Senha;
      // No caso de ser uma contra criada pela administração
      if (user.estado != 1) {
        user.Estado = 1;
      }

      user.TokenEmail = null
      console.log("estado: " + user.Estado);
      await user.save();
    } catch (error) {
      console.log("Erro ao atualizar usuário: " + error)
      return res.status(500).send({
        message: "Erro ao validar o código: " + error,
        success: false
      });
    }

    return res.send({
      message: "A password foi redefinida com sucesso.",
      success: true
    }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Erro ao validar o código: " + error,
      success: false
    });
  }
};

// Criar contas através do administrador
exports.adminRegister = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "O conteúdo não pode estar vazio.",
      success: false
    });
  }

  // Verificar se o usuario é adminstrador
  if(req.user.NCargo != 0)
  {
    return res.status(401).send({
      message: "Acesso negado: é preciso ter um cargo com permissões para isso.",
      success: false
    })
  }
  // Criar novo Usuario

  // Verificar se o email não está cadastrado
  try {
    const user = await Usuario.findOne({ where: { Email: req.body.Email } });
    if (user) {
      return res.status(500).send({
        success: false,
        message: "O email já está registado: " + req.body.Email
      })
    }
  } catch (error) {
    res.status(500).send(
      {
        success: false,
        message: "Erro ao verificar o email do utilizador : " + error
      }
    )
  }

  // Definir a verificao de password como 0 (obriga o utilizador a resetar a password no primeiro login)
  req.body.Estado = 0;

  // Criar password aleatória, apenas para não ficar vazio
  var randompassword = Math.random().toString(36).slice(-8);
  console.log("Random pass: " + randompassword);
  // Encriptar password
  const salt = await bcrypt.genSalt();
  req.body.Senha = await bcrypt.hash(randompassword, salt);


  // Criar token para validar email
  const payload =
  {
    email: req.body.Email,
  }
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "100m" })

  // Definir token de validação na BD
  req.body.TokenEmail = token

  req.body.Foto = picture

  // Mandar email de verificação
  email_sender.contaCriadaPorAdmin(req.body.Email, token);

  try {
    const data = await Usuario.create(req.body);
    res.send({
      message: data,
      success: true
    });

  } catch (error) {
    res.status(500).send(
      {
        message: "Erro ao criar o utilizador: " + error,
        success: false
      })
  }
}

const generateRandomPassword = async () => {
 

  try {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);
    return password;
  } catch (error) {
    throw new Error('Erro ao gerar senha aleatória');
  }
};

exports.disableUser = async (req, res) => {
  const nusuario = req.params.nusuario;

  if(req.user.NCargo != 0)
  {
    return res.status(401).send({
      message: "Acesso negado: é preciso ter um cargo com permissões para isso.",
      success: false
    })
  }
  if (!nusuario) {
   return req.status(400).send(
      {
        success: false,
        message: "NUsuario não fornecido."
      }
    )
  }
  try {
    const allowedFields = ['Estado']; // definir os campos permitidos
    user = await Usuario.findOne({ where: { NUsuario: nusuario } });
    const updates = Object.keys(req.body).filter(field => allowedFields.includes(field)); // filtra somente os campos permitidos
    const result = await Usuario.update(req.body, {
      where: { NUsuario: nusuario },
      fields: updates // utiliza apenas os campos permitidos
    });
    if (result[0] === 0) {
     return res.status(404).send({
        success: false,
        message: `Impossível encontrar o utilizador com o ID: ${nusuario}.`
      });
    } else {
      // Apaga os dados do usuário em cache para serem atualizados posteriormente
      cache.del(nusuario);
      // Envia a mensagem de resposta
     return res.send({
        success: true,
        message: "O estado do utilizador foi alterado com sucesso."
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Erro ao mudar o estado do utilizador: ${error} `
    })
  }

}

exports.googlecallback = (req, res) => {
  // successful authentication, redirect home
  const user = req.user.message;
  if (!user) {

    return res.redirect('/api/google');
  }
  console.log("User: " + JSON.stringify(user))
  const payload =
  {
    email: user.Email,
    id: user.NUsuario
  }
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" })

  const bearerToken = "Bearer " + token;
  console.log(bearerToken);


  res.send(`<script>window.opener.postMessage({accessToken: '${bearerToken}'}, '${website}');window.close();</script>`);

}

exports.googleLogin = async (req, res, next) => {
  const { IDGoogle, Email, Nome, Foto } = req.body;

  Usuario.findOne({ where: { google_id: IDGoogle } })
    .then(existingUser => {
      if (existingUser) {
        // Return the existing user
        console.log("Google ID: " + IDGoogle);
        console.log("Usuário já existe");
        const payload = {
          email: existingUser.Email,
          id: existingUser.NUsuario
        }
        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" })
        res.status(200).json({ message: "Bearer " + token, success: true });
      } else {
        // Check if there's an existing user with the same email address
        Usuario.findOne({ where: { Email: Email } })
          .then(async userWithEmail => {
            if (userWithEmail && userWithEmail.google_id === null) {
              // An account with the same email exists and was not created with Google, don't create a new account
              console.log("Já existe um usuário com este email");
              res.status(401).json({ message: 'O email já está registado com uma conta não Google.', success: false });
            } else {
              if (!userWithEmail) {


                // If the user doesn't exist, create a new user in your database
                console.log("Criando novo utilizador...");

                // Verify if the photo URL is valid
                let fotoURL = Foto;
                if (Foto) {
                  const result = await verifyImageURL(fotoURL);
                  const isImage = result.isImage;
                  if (!isImage) {
                    fotoURL = null;
                    console.log("URL da Foto inválido. Foto será salva como padrão.");
                  }
                }
                const senhaAleatoria = await generateRandomPassword();

                //veriricar se a url da foto é valida
                const newUser = new Usuario({
                  Nome: Nome,
                  Email: Email,
                  google_id: IDGoogle,
                  Estado: 1,
                  DataNascimento: new Date(),
                  Genero: 'Desconhecido',
                  NCargo: 1,
                  Senha: senhaAleatoria,
                  Foto: fotoURL || picture
                });
                newUser.save()
                  .then(user => {
                    // Return the new user
                    const payload = {
                      email: user.Email,
                      id: user.NUsuario
                    }
                    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" })
                    res.status(200).json({ message: "Bearer " + token, success: true })
                  })
                  .catch(err => {
                    console.error(err);
                    res.status(500).json({ message: 'Erro interno do servidor.', success: false });
                  });

              }
              else {
                res.status(401).send(
                  {
                    success: false,
                    message: "O email já está registado: é impossível criar um novo."
                  }
                )
              }

            }
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Erro interno do servidor.', success: false });
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Erro interno do servidor.', success: false });
    });
}

exports.facebookcallback = (req, res) => {
  console.log("Website: " + website)
  // successful authentication, redirect home
  const user = req.user.message;
  if (!user) {
    return res.redirect('/api/facebook');
  }
  console.log("User: " + JSON.stringify(user))
  const payload =
  {
    email: user.Email,
    id: user.NUsuario
  }
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" })
  const bearerToken = "Bearer " + token;
  console.log(bearerToken);
  res.send(`<script>window.opener.postMessage({accessToken: '${bearerToken}'}, '${website}');window.close();</script>`);

}
