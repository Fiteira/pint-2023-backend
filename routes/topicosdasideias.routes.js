module.exports = app => {
    const topicosdasideias = require("../controllers/topicosdasideias.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


    // router.route("/").post(localidades.create);
    // Obter todos tipos vagas
    router.route("/").get(topicosdasideias.getAll);

    // Obter um tipo de vaga pelo id
    router.route("/").get(topicosdasideias.getById);

    router.route("/").post(topicosdasideias.create);

    router.route("/").delete(topicosdasideias.delete);

    app.use("/api/topicosdasideias", middleware.jwtAuthMiddleware, router);
};