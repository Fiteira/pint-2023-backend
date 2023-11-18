const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Candidatura = require('../models/candidaturas.model')


const Entrevista = sequelize.define('Entrevista', {
    NEntrevista: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NCandidatura: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Candidatura',
            key: 'NCandidatura'
        }
    },

    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, { timestamps: false,   getters: true ,// Adicionando a opção getters: true para definir getters virtuais
freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela

});


Entrevista.belongsTo(Candidatura,
    { foreignKey: 'NCandidatura' }
)

Entrevista.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
      // Removendo as propriedades dos modelos associados
      delete values.Usuario;
      delete values.Candidatura;
    // Incluindo as propriedades das associações diretamente no objeto
    values.NUsuario = this.Candidatura.Usuario.NUsuario;
    values.NomeUsuario = this.Candidatura.Usuario.Nome;
    values.NomeVaga = this.Candidatura.Vaga.NomeVaga;


    return values;
  };

module.exports = Entrevista;