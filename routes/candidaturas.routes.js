module.exports = app => {
    const candidaturas = require("../controllers/candidaturas.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")

     // Criar Novo candidatura
     router.route("/").post(candidaturas.create);
    // Obter todos candidaturas
    router.route("/").get(candidaturas.getAll);

    // Obter um candidatura pelo id
    router.route("/:ncandidatura").get(candidaturas.getById);

    // Apagar candidatura
   router.route("/:ncandidatura").delete(candidaturas.delete);

    // Atualizar candidatura

    router.route("/:ncandidatura").put(candidaturas.updateById);


    app.use("/api/candidaturas", middleware.jwtAuthMiddleware, router);
};