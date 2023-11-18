const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Localidade = require("./localidade.model");
const TipoVaga = require("./tipovaga.model")

const Vaga = sequelize.define('Vaga', {
  NVaga: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  NomeVaga: {
      type: DataTypes.STRING,
      allowNull: false
  },
  Subtitulo: {
      type: DataTypes.STRING,
      allowNull: false
  },
  Descricao: {
      type: DataTypes.TEXT,
      allowNull: true
  },
  NLocalidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Localidade',
          key: 'NLocalidade'
      }
  },
  NTipoVaga: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'TipoVaga',
          key: 'NTipoVaga'
      }
  },
  Estado:
  {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  DataCriacao:
  {
    type:DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, { 
timestamps: false,
freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
getters: true // Adicionando a opção getters: true para definir getters virtuais

});

// Definindo a associação com o modelo Localidade
Vaga.belongsTo(Localidade, {
foreignKey: 'NLocalidade'
});

// Definindo a associação com o modelo TipoVaga
Vaga.belongsTo(TipoVaga, {
foreignKey: 'NTipoVaga'
});

Vaga.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
  
    // Removendo as propriedades dos modelos associados
    delete values.Localidade;
    delete values.TipoVaga;
  
    // Incluindo as propriedades das associações diretamente no objeto
    values.Localidade = this.Localidade.Localidade;
    values.TipoVaga = this.TipoVaga.NomeTipoVaga;
  
    return values;
  };

module.exports = Vaga;