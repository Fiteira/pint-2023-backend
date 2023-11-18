const passport = require("passport");
const router = require("express").Router();
const UserModel = require("../models/usuarios.model");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt
const bcrypt = require('bcryptjs');
const website = process.env.WEBSITE 
const FacebookStrategy = require('passport-facebook');

// Cria o cache dos usuários com experição de 60s

const defaultPicture = process.env.PROFPICTURE 


const cache = require("../config/cache")

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

const generateRandomPassword = async () => {

  try {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);
    return password;
  } catch (error) {
    throw new Error('Erro ao gerar senha aleatória');
  }
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try {
    // Tenta obter o usuário em cache
    let user = await cache.get(jwt_payload.id);
    if (!user) {
      console.log("Usuário não está em cache, obtendo da BD...")
      // Se o usuário não está em cache, obtém da BD
      user = await UserModel.findByPk(jwt_payload.id, {
        attributes: ['NUsuario', 'NCargo', 'Email', 'Nome', 'Foto', 'Estado']
      });
      // Armazena o usuário em cache por 4 minutos
     cache.set(jwt_payload.id, user, 240);
    }
    if (user && user.Estado === 1) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

// Autenticação pelo google
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: website + '/api/google/callback',
    scope: ["profile", "email"] // Specify the required scope here
  },  (accessToken, refreshToken, profile, done) => {
    console.log(profile); // add this line to check the profile object
    UserModel.findOne({ where: { google_id: profile.id} })
      .then(existingUser => {
        if (existingUser) {
          // Return the existing user
          console.log("Google ID: " + profile.id);
          console.log("Usuário já existe");
          done(null,{ message:  existingUser, success: true });
        } else {
          // Check if there's an existing user with the same email address
          UserModel.findOne({ where: { Email: profile.emails[0].value } })
            .then(async userWithEmail => {
              if (userWithEmail && userWithEmail.google_id === null) {
                // An account with the same email exists and was not created with Google, don't create a new account
                console.log("Já existe um usuário com este email");
                const authError = new Error('Email já está cadastrado com uma conta não google');
                authError.status = 401; // Unauthorized
                done(authError);
              } else {
                // If the user doesn't exist, create a new user in your database
                console.log("Criando novo usuário...");
                // Gera uma senha totalmente aleatória
                const senhaAleatoria = await generateRandomPassword();
                const newUser = new UserModel({
                  Nome: profile.displayName,
                  Email: profile.emails[0].value,
                  google_id: profile.id,
                  Estado : 1,
                  DataNascimento: profile.birthday || new Date(),
                  Genero: profile.gender || 'Desconhecido',
                  NCargo: 1,
                  Senha: senhaAleatoria ,
                  Foto: profile.photos[0].value || defaultPicture
                });
                newUser.save()
                  .then(user => {
                    // Return the new user
                    done(null, newUser, { message: { 
                      NUsuario: user.NUsuario, 
                      NCargo: user.NCargo, 
                      Email: user.Email, 
                      Nome: user.Nome, 
                      Foto: user.Foto ,
                      DataNascimento: user.DataNascimento
                    }});
                  })
                  .catch(err => done(err)); // Handle database errors
              }
            })
            .catch(err => done(err)); // Handle database errors
        }
      })
      .catch(err => done(err)); // Handle database errors
  }));
  

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: website + '/api/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'picture'] ,
    scope: ['email']
  
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    const email = profile.emails[0].value;
    const picture = profile.photos[0].value;
    const facebook_id = profile.id
    const name = profile.name.givenName + ' '+ profile.name.familyName
    console.log(`Profile ID : ${facebook_id}, Email: ${email}
    , Nome: ${name},
    Foto: ${picture}`)
     
    UserModel.findOne({ where: { facebook_id: facebook_id} })
      .then(existingUser => {
        if (existingUser) {
          // Return the existing user
          console.log("Facebook ID: " + facebook_id);
          console.log("Usuário já existe");
          cb(null,{ message:  existingUser, success: true });
        } else {
          // Check if there's an existing user with the same email address
          UserModel.findOne({ where: { Email: email } })
            .then(async userWithEmail => {
              if (userWithEmail && userWithEmail.facebook_id === null) {
                // An account with the same email exists and was not created with facebook, don't create a new account
                console.log("Já existe um usuário com este email");
                const authError = new Error('Email already registered with non-Facebook account');
                authError.status = 401; // Unauthorized
                cb(authError);
              } else {
                // If the user doesn't exist, create a new user in your database
                console.log("Criando novo usuário pelo facebook...");
                const senhaAleatoria = await generateRandomPassword();
                const newUser = new UserModel({
                  Nome: name,
                  Email: email,
                  facebook_id: facebook_id,
                  Estado : 1,
                  DataNascimento: profile.birthday || new Date(),
                  Genero: profile.gender || 'Desconhecido',
                  NCargo: 1,
                  Senha: senhaAleatoria ,
                  Foto: picture || defaultPicture
                });
                newUser.save()
                  .then(user => {
                    // Return the new user
                    cb(null, newUser, { message: { 
                      NUsuario: user.NUsuario, 
                      NCargo: user.NCargo, 
                      Email: user.Email, 
                      Nome: user.Nome, 
                      Foto: user.Foto ,
                      DataNascimento: user.DataNascimento
                    }});
                  })
                  .catch(err => cb(err)); // Handle database errors
              }
            })
            .catch(err => cb(err)); // Handle database errors
        }
      })
  }
  ));