module.exports = app => {
    const ideias = require("../controllers/ideias.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo ideia
     router.route("/").post(ideias.create);
    // Obter todos ideias
    router.route("/").get(ideias.getAll);

    // Obter um ideia pelo id
    router.route("/:nideia").get(ideias.getById);

    // Apagar ideia
   router.route("/:nideia").delete(ideias.delete);

    // Atualizar ideia
    router.route("/:nideia").put(ideias.updateById);


    app.use("/api/ideias", middleware.jwtAuthMiddleware, router);
};