const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Usuario = require("../models/usuarios.model")
const Oportunidade = require("../models/oportunidades.model")
const Entrevista = require("../models/entrevista.model")
const Reunioes = sequelize.define('Reunioes', {
    NReunioes: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NUsuarioCriador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'NUsuario'
        }
    },
    Titulo:
    {
        type: DataTypes.STRING,
        allowNull: true
    },
    Descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Tipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DataHoraInicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    DataHoraFim: {
        type: DataTypes.DATE,
        allowNull: false
    },
    NOportunidade: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Oportunidade',
            key: 'NOportunidade'
        }
    },
    NEntrevista: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Entrevista',
            key: 'NEntrevista'
        }
    },
    DataHoraNotificacao: {
        type: DataTypes.DATE,
        allowNull: true
    },
    NotificacaoEnviada: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },


}, { 
  timestamps: false,
  freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
    getters: true
});

Reunioes.belongsTo(Usuario ,
    {
        foreignKey: 'NUsuarioCriador'
    });

    Reunioes.belongsTo(Oportunidade ,
        {
            foreignKey: 'NOportunidade'
        });

        Reunioes.belongsTo(Entrevista,
            {
                foreignKey: 'NEntrevista'
            });

    Reunioes.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
      
        // Removendo as propriedades dos modelos associados
        delete values.Usuario

      
        // Incluindo as propriedades das associações diretamente no objeto
        values.NomeUsuarioCriador = this.Usuario.Nome
      
        return values;
      };
    

module.exports = Reunioes