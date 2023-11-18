const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Cargo = require("./cargo.model")


const Usuario = sequelize.define('Usuario', {
  NUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  Nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  NCargo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Cargo',
        key: 'NCargo'
    }
},
  Telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Linkedin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  CV: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Foto:
  {
    type: DataTypes.STRING,
    allowNull: true
  },
  DataNascimento:
  {
    type: DataTypes.DATE,
    allowNull: false
  },
  Genero:
  {
    type: DataTypes.STRING,
    allowNull: false
  },
  TokenEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Localidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Estado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DataHoraRegisto: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  google_id : {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebook_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
  freezeTableName: true // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
});
// Definindo a associação com o modelo Cargo
Usuario.belongsTo(Cargo, {
  foreignKey: 'NCargo'
});

module.exports = Usuario