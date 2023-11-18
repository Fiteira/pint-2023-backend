const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Clientes = require("./cliente.model");
const Contactos = sequelize.define('Contactos', {
    NContactos: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clientes',
            key: 'NCliente'
        }
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

Contactos.belongsTo(Clientes, {
    foreignKey: 'NCliente'
})

module.exports = Contactos