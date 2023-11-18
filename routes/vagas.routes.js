module.exports = app => {
    const vagas = require("../controllers/vagas.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")

     // Criar Novo vaga
     router.route("/").post(middleware.jwtAuthMiddleware, vagas.create);
    // Obter todos vagas
    router.route("/").get(vagas.getAll);

    // Obter um vaga pelo id
    router.route("/:nvaga").get(vagas.getById);

    // Apagar vaga
   router.route("/:nvaga").delete(middleware.jwtAuthMiddleware,vagas.delete);

    // Atualizar vaga

    router.route("/:nvaga").put(middleware.jwtAuthMiddleware,vagas.updateById);

    app.use("/api/vagas", router);
};