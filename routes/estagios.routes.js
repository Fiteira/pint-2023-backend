module.exports = app => {
    const estagios = require("../controllers/estagios.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo estagio
     router.route("/").post(estagios.create);
    // Obter todos estagios
    router.route("/").get(estagios.getAll);

    // Obter um estagio pelo id
    router.route("/:nestagio").get(estagios.getById);

    // Apagar estagio
   router.route("/:nestagio").delete(estagios.delete);

    // Atualizar estagio

    router.route("/:nestagio").put(estagios.updateById);


    app.use("/api/estagios", middleware.jwtAuthMiddleware, router);
};