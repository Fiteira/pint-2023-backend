const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Entrevista = require('../models/entrevista.model');
const Usuario = require("../models/usuarios.model")


const Nota = sequelize.define('Nota', {
    NNota: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NEntrevista: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Entrevista',
            key: 'NEntrevista'
        }
    },
    Texto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NUsuarioRH: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'NUsuario'
        }
    },
    Anexo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    DataHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Nota.belongsTo(Entrevista, {
    foreignKey: 'NEntrevista'
});

Nota.belongsTo(Usuario, {
    foreignKey: 'NUsuarioRH'
});

Nota.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
      // Removendo as propriedades dos modelos associados
      delete values.Usuario;

    // Incluindo as propriedades das associações diretamente no objeto
    values.NomeRH = this.Usuario.Nome;


    return values;
  };

module.exports = Nota;