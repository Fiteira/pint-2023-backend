module.exports = app => {
    const status = require("../controllers/status.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo status
     router.route("/").post(status.create);
    // Obter todos statuss
    router.route("/").get(status.getAll);

    // Obter um status pelo id
    router.route("/:nstatus").get(status.getById);

    // Apagar status
   router.route("/:nstatus").delete(status.delete);

    // Atualizar status

    router.route("/:nstatus").put(status.updateById);

    app.use("/api/status", middleware.jwtAuthMiddleware, router);
};