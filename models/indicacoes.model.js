const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Vaga = require("./vagas.model")
const Usuario = require("./usuarios.model");

const Indicacao = sequelize.define('Indicacoes', {
    NIndicacao: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NVaga: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Vaga',
            key: 'NVaga'
        }
    },
    NUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'NUsuario'
        }
    },
    NomeCand:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TelefoneCand:
    {
        type: DataTypes.STRING,
        allowNull: true

    },
    EmailCand:
    {
        type: DataTypes.STRING,
        allowNull : false
    },
    LINKEDIN:
    {
        type: DataTypes.STRING,
        allowNull: true
    },
    CV:
    {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    timestamps: false,
    freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
    getters: true // Adicionando a opção getters: true para definir getters virtuais

});

// Definindo a associação com o modelo Vaga
Indicacao.belongsTo(Vaga, {
    foreignKey: 'NVaga'
});

// Definindo a associação com o modelo Usuario
Indicacao.belongsTo(Usuario, {
    foreignKey: 'NUsuario'
});

Indicacao.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
      // Removendo as propriedades dos modelos associados
      delete values.Usuario;
      delete values.Vaga;
    // Incluindo as propriedades das associações diretamente no objeto
    values.NomeUsuario = this.Usuario.Nome;
    values.NomeVaga = this.Vaga.NomeVaga;

    return values;
  };

module.exports = Indicacao