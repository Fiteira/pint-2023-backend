module.exports = app => {
    const contactos = require("../controllers/contactos.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


     // Criar Novo contacto
     router.route("/").post(contactos.create);
    // Obter todos contactos
    router.route("/").get(contactos.getAll);

    // Obter um contacto pelo id
    router.route("/:ncontacto").get(contactos.getById);

    // Apagar contacto
    router.route("/:ncontacto").delete(contactos.delete);

    // Atualizar contacto

    router.route("/:ncontacto").put(contactos.updateById);


    app.use("/api/contactos", middleware.jwtAuthMiddleware, router);
};