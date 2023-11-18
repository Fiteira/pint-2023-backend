module.exports = app => {
    const clientes = require("../controllers/clientes.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo cliente
     router.route("/").post(clientes.create);
    // Obter todos clientes
    router.route("/").get(clientes.getAll);

    // Obter um cliente pelo id
    router.route("/:ncliente").get(clientes.getById);

    // Apagar cliente
    router.route("/:ncliente").delete(clientes.delete);

    // Atualizar cliente

    router.route("/:ncliente").put(clientes.updateById);


    app.use("/api/clientes", middleware.jwtAuthMiddleware, router);
};