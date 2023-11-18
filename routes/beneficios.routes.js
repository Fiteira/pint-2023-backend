module.exports = app => {
   
    const beneficios = require("../controllers/beneficios.controller.js");
    const router = require("express").Router();

    const middleware = require("../config/middleware.js")
      // proteger endpoints com jwt authentication
    //  router.use(middleware.jwtAuthMiddleware),
      
     // Criar Novo beneficio
     router.route("/").post(middleware.jwtAuthMiddleware, beneficios.create);
    // Obter todos beneficios
    router.route("/").get(beneficios.getAll);

    // Obter um beneficio pelo id
    router.route("/:nbeneficio").get(beneficios.getById);

    // Apagar beneficio
    router.route("/:nbeneficio").delete(middleware.jwtAuthMiddleware, beneficios.delete);

    // Atualizar beneficio

    router.route("/:nbeneficio").put(middleware.jwtAuthMiddleware, beneficios.updateById);

    


    app.use("/api/beneficios", router);
};