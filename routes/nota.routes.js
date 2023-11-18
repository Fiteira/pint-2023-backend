module.exports = app => {
    const nota = require("../controllers/nota.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo nota
     router.route("/").post(nota.create);
    // Obter todos nota
    router.route("/").get(nota.getAll);

    // Obter uma nota pelo id
    router.route("/:nnota").get(nota.getById);

    // Apagar nota
   router.route("/:nnota").delete(nota.delete);

    // Atualizar nota

    router.route("/:nnota").put(nota.updateById);


    app.use("/api/nota", middleware.jwtAuthMiddleware, router);
};