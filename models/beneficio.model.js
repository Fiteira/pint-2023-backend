const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')



const Beneficio = sequelize.define('Beneficio', {
    NBeneficio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeBeneficio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Subtitulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    EnderecoImagem: {
      type: DataTypes.STRING,
      allowNull: true
  }
},{ timestamps: false,
    freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

module.exports = Beneficio;