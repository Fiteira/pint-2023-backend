const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Ideias = require("./ideias.model")
const Notas = require("./nota.model")
const Anexos = sequelize.define('Anexos', {
    NAnexo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NIdeia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references : 
        {
            model: 'Ideia',
            key: 'NIdeia'
        }
    },
    Endereco: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});



module.exports = Anexos;