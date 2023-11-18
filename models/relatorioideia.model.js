const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const Ideia = require("./ideias.model")
const RelatorioIdeia = sequelize.define('RelatorioIdeia', {
    NRelatorioIdeia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ApontamentosAdm: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ApontamentosAutor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // 0 é rejeitada, 1 é aprovada
    Tipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DataHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    NIdeia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Ideia',
            key: 'NIdeia'
        }
    }
}, { 
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});

RelatorioIdeia.belongsTo(Ideia,
    {
        foreignKey: 'NIdeia'
    })
module.exports = RelatorioIdeia