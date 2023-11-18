const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Oportunidade = require('./oportunidades.model');
const Status = sequelize.define('Status', {
    NStatus: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Titulo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    EnderecoAnexo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    DataHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    NOportunidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Oportunidade',
            key: 'NOportunidade'
        }
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

Status.belongsTo(Oportunidade, {
    foreignKey: 'NOportunidade'
})

module.exports = Status