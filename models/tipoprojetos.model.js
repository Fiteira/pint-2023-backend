const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const TiposProjeto = sequelize.define('TiposProjeto', {
    NTipoProjeto: {
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

const createDefaultTipos = async () => {
    try {
      await TiposProjeto.bulkCreate([
        { Nome: "Patrocinios" },
        { Nome: "Parcerias" },
        { Nome: "Eventos" },
        { Nome: "Investimentos" }
      ]);
      console.log('Registros padrão criados com sucesso.');
    } catch (error) {
      console.error('Erro ao criar registros padrão:', error);
    }
  };
  
  TiposProjeto.afterSync(() => {
    TiposProjeto.count().then(count => {
      if (count === 0) {
        createDefaultTipos();
      }
    });
  });

module.exports = TiposProjeto