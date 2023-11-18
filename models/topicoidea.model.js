const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')



const TopicoIdeia = sequelize.define('TopicoIdeia', {
    NTopicoIdeia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeTopico: {
        type: DataTypes.STRING,
        allowNull: false
    }
     
},{ timestamps: false,
    freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

module.exports = TopicoIdeia;