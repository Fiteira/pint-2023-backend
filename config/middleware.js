const passport = require("passport");
const rateLimit = require('express-rate-limit');

exports.jwtAuthMiddleware = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        // Se houver erro, passa o erro para o próximo middleware (ou middleware de tratamento de erro) 
        return next(err);
      }
      if (!user) {
        // Se não houver usuário, retorna uma mensagem de erro
        return res.status(401).json({ success: false, message: 'Acesso negado! É preciso um token válido.' });
      }
      // Se o usuário for encontrado, adiciona o usuário ao objeto request e passa para o próximo middleware
      req.user = user;
      return next();
    })(req, res, next);
  };

 exports.limitarAcesso = rateLimit({
    windowMs: 5000, // Tempo em milissegundos (5 segundos)
    max: 1, // Número máximo de requisições permitidas nesse intervalo de tempo
    message: {sucess: false, message: "Muitas tentativas de registo, tente mais tarde."},
  });



exports.limitarLogin = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  message: { success: false, message: "Muitas tentativas de login, tente novamente mais tarde." },
  keyGenerator: (req) => {
    return req.body.Email; // Ao aceder a mesma conta várias vezes
  }
});


