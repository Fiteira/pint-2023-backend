const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Cargo = sequelize.define('Cargo', {
    NCargo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Cargo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

// Função para criar os registros padrão
const createDefaultCargos = async () => {
    try {
      await Cargo.bulkCreate([
        { Cargo: "Administrador" },
        { Cargo: "Utilizador Externo" },
        { Cargo: "Utilizador Interno" },
        { Cargo: "Gestor Vendas" },
        { Cargo: "Gestor Ideias" },
        { Cargo: "Recursos Humanos" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  Cargo.afterSync(() => {
    Cargo.count().then(count => {
      if (count === 0) {
        createDefaultCargos();
      }
    });
  });

module.exports = Cargo;