const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Vaga = require("./vagas.model")
const Usuario = require("./usuarios.model");

const Candidatura = sequelize.define('Candidatura', {
    NCandidatura: {
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
    DataCandidatura:
    {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    PretencaoSalarial:
    {
        type: DataTypes.STRING,
     allowNull: true
    },
    Mensagem:
    {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Estado:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    Estagio:
    {
        type: DataTypes.ENUM('Análise', 'Entrevista', 'Rejeitada', 'Aceite'),
        allowNull: true,
        defaultValue: 'Análise'
    }

}, {
    timestamps: false,
    freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
    getters: true // Adicionando a opção getters: true para definir getters virtuais

});

// Definindo a associação com o modelo Vaga
Candidatura.belongsTo(Vaga, {
    foreignKey: 'NVaga'
});

// Definindo a associação com o modelo Usuario
Candidatura.belongsTo(Usuario, {
    foreignKey: 'NUsuario'
});

Candidatura.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
      // Removendo as propriedades dos modelos associados
      delete values.Usuario;
      delete values.Vaga;
    // Incluindo as propriedades das associações diretamente no objeto
    values.NomeUsuario = this.Usuario.Nome;
    values.NomeVaga = this.Vaga.NomeVaga;
    values.Subtitulo = this.Vaga.Subtitulo;
    values.EmailUsuario = this.Usuario.Email;

    return values;
  };

module.exports = Candidatura