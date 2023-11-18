module.exports = app => {
    const topicoideias = require("../controllers/topicoideias.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


    // router.route("/").post(localidades.create);
    // Obter todos tipos vagas
    router.route("/").get(topicoideias.getAll);

    // Obter um tipo de vaga pelo id
    router.route("/:ntopicoideia").get(topicoideias.getById);

    router.route("/").post(topicoideias.create);

    router.route("/:ntopicoideia").delete(topicoideias.delete);

    router.route("/:ntopicoideia").put(topicoideias.updateById);

    app.use("/api/topicoideias", middleware.jwtAuthMiddleware, router);
};