module.exports = app => {
    const tiposprojetos = require("../controllers/tipoprojetos.controller");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo status
     router.route("/").post(tiposprojetos.create);
    // Obter todos statuss
    router.route("/").get(tiposprojetos.getAll);

    // Obter um status pelo id
    router.route("/:ntipoprojetos").get(tiposprojetos.getById);

    // Apagar status
   router.route("/:ntipoprojetos").delete(tiposprojetos.delete);

    // Atualizar status

    router.route("/:ntipoprojetos").put(tiposprojetos.updateById);

    app.use("/api/tipoprojetos", middleware.jwtAuthMiddleware, router);
};