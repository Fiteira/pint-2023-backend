module.exports = app => {
    const relatorioideia = require("../controllers/relatorioideia.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo relatorioideia
     router.route("/").post(relatorioideia.create);
    // Obter todos relatorioideia
    router.route("/").get(relatorioideia.getAll);

    // Obter um relatorioideia pelo id
    router.route("/:nrelatorioideia").get(relatorioideia.getById);

    // Apagar relatorioideia
   router.route("/:nrelatorioideia").delete(relatorioideia.delete);

    // Atualizar relatorioideia

    router.route("/:nrelatorioideia").put(relatorioideia.updateById);


    app.use("/api/relatorioideia", middleware.jwtAuthMiddleware, router);
};