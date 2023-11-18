module.exports = app => {
  const router = require("express").Router();

  const authController = require('../controllers/auth.controller');
  const passport = require("passport");

  const middleware = require("../config/middleware.js")
  // proteger endpoints com jwt authentication
//  router.use(middleware.jwtAuthMiddleware),

  

  // Rota de login
  router.route("/login").post(middleware.limitarLogin, authController.login);
  // Rota de cadastro
  router.route("/register").post(middleware.limitarAcesso, authController.register);

  router.route("/adminregister").post(middleware.jwtAuthMiddleware, authController.adminRegister);
  // Rota de validação de e-mail
  router.route("/validaremail").get(authController.validarEmail);

  router.route("/resetpassword").post(authController.resetPassword)

  router.route("/requestresetpassword").post(authController.requestResetPassword)

  router.route("/adminregister").post(middleware.jwtAuthMiddleware, authController.adminRegister);

  router.route("/disableuser/:nusuario").put(middleware.jwtAuthMiddleware, authController.disableUser);

// Rota de verificação de token
router.get('/checktoken', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { NUsuario, NCargo, Email, Nome, Foto } = req.user;
  res.status(200).json({success: true,
    message:{ NUsuario, NCargo, Email, Nome, Foto }});
});

// Autenticação do google

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/googleandroid').post(authController.googleLogin)

router.get('/google/callback',
  passport.authenticate('google'), authController.googlecallback);
  // Aplica o roteador "/api" em todas as rotas

  router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { scope: ['email', 'name', 'picture'] }),
  authController.facebookcallback);

  
  app.use("/api", router);
};

