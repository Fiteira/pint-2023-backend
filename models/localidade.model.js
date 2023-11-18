const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Localidade = sequelize.define('Localidade', {
    NLocalidade: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Localidade: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

// Função para criar os registros padrão
const createDefaultLocalidades = async () => {
    try {
      await Localidade.bulkCreate([
        { Localidade: "Porto" },
        { Localidade: "Viseu" },
        { Localidade: "Aveiro" },
        { Localidade: "Coimbra" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  Localidade.afterSync(() => {
    Localidade.count().then(count => {
      if (count === 0) {
        createDefaultLocalidades();
      }
    });
  });
  

module.exports = Localidade