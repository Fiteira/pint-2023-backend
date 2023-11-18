module.exports = app => {
    const oportunidades = require("../controllers/oportunidades.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo oportunidade
     router.route("/").post(oportunidades.create);
    // Obter todos oportunidades
    router.route("/").get(oportunidades.getAll);

    // Obter um oportunidade pelo id
    router.route("/:noportunidade").get(oportunidades.getById);

    // Apagar oportunidade
   router.route("/:noportunidade").delete(oportunidades.delete);

    // Atualizar oportunidade

    router.route("/:noportunidade").put(oportunidades.updateById);

    app.use("/api/oportunidades", middleware.jwtAuthMiddleware, router);
};