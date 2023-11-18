module.exports = app => {
    const indicacoes = require("../controllers/indicacoes.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo indicacao
     router.route("/").post(indicacoes.create);
    // Obter todos indicacoes
    router.route("/").get(indicacoes.getAll);

    // Obter um indicacao pelo id
    router.route("/:nindicacao").get(indicacoes.getById);

    // Apagar indicacao
   router.route("/:nindicacao").delete(indicacoes.delete);

    // Atualizar indicacao

    router.route("/:nindicacao").put(indicacoes.updateById);


    app.use("/api/indicacoes", middleware.jwtAuthMiddleware, router);
};