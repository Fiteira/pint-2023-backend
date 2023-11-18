module.exports = app => {
    const reunioes = require("../controllers/reunioes.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo reunioes
     router.route("/").post(reunioes.create);
    // Obter todos reunioes
    router.route("/").get(reunioes.getAll);

    // Obter um reunioes pelo id
    router.route("/:nreuniao").get(reunioes.getById);

    // Apagar reunioes
   router.route("/:nreuniao").delete(reunioes.delete);

    // Atualizar reunioes

    router.route("/:nreuniao").put(reunioes.updateById);


    app.use("/api/reunioes", middleware.jwtAuthMiddleware, router);
};