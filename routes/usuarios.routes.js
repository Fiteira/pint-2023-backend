module.exports = app => {
    const usuarios = require("../controllers/usuarios.controller.js");
    const router = require("express").Router();
    const middleware = require("../config/middleware.js")


    // Obter todos usuarios
    router.route("/").get(usuarios.getAll);

    // Obter um usuario pelo id
    router.route("/:nusuario").get(usuarios.getById);

    
    // Apagar usuario
    router.route("/:nusuario").delete(usuarios.delete);

    // Atualizar usuario

    router.route("/:nusuario").put(usuarios.updateById);


    app.use("/api/usuarios", middleware.jwtAuthMiddleware, router);
};