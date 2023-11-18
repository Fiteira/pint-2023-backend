const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Usuario = require('./usuarios.model');



const Clientes = sequelize.define('Clientes', {
    NCliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeEmp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    EmailEmp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    TelefoneEmp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NUsuarioCriador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Usuario',
            key: 'NUsuario'
        }
    },
    DataHoraCriacao: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
     
},{ timestamps: false,
    freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
    getters: true // Adicionando a opção getters: true para definir getters virtuais
    });

    Clientes.belongsTo(Usuario, {
        foreignKey: 'NUsuarioCriador'
    })

    Clientes.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        // Removendo as propriedades dos modelos associados
        delete values.Usuario;
        // Incluindo as propriedades das associações diretamente no objeto
        values.NomeUsuarioCriador = this.Usuario.Nome;

        return values;
      };


module.exports = Clientes;