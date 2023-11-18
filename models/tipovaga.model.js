const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const TipoVaga = sequelize.define('TipoVaga', {
    NTipoVaga: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeTipoVaga: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

// Função para criar os registros padrão
const createDefaultTipoVagas = async () => {
    try {
      await TipoVaga.bulkCreate([
        { NomeTipoVaga: "Externa" },
        { NomeTipoVaga: "Interna" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  TipoVaga.afterSync(() => {
    TipoVaga.count().then(count => {
      if (count === 0) {
        createDefaultTipoVagas();
      }
    });
  });
  

module.exports = TipoVaga;