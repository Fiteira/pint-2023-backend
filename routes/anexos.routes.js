module.exports = app => {
    const anexos = require("../controllers/anexos.controller.js");
    const router = require("express").Router();

     // Criar Novo anexo
     router.route("/").post(anexos.create);
    // Obter todos anexos
    router.route("/").get(anexos.getAll);

    // Obter um anexo pelo id
    router.route("/:nanexo").get(anexos.getById);

    // Apagar anexo
    router.route("/:nanexo").delete(anexos.delete);

    // Atualizar anexo

    router.route("/:nanexo").put(anexos.updateById);


    app.use("/api/anexos", router);
};