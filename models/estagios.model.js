const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Estagios = sequelize.define('Estagios', {
    NEstagio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

// Função para criar os registros padrão
const createDefaultEstagios = async () => {
    try {
      await Estagios.bulkCreate([
        { Nome: "Oportunidades" },
        { Nome: "Aguarda Revisão" },
        { Nome: "Aguarda Reunião" },
        { Nome: "Negócios Finalizados" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  Estagios.afterSync(() => {
    Estagios.count().then(count => {
      if (count === 0) {
        createDefaultEstagios();
      }
    });
  });

module.exports = Estagios