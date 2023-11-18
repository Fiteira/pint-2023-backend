const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");


const Etiquetas = require("../models/etiquetas.model")
const Estagios = require("../models/estagios.model")
const Clientes = require("../models/cliente.model")
const Usuarios = require("../models/usuarios.model")
const TiposProjeto = require("../models/tipoprojetos.model")


const Oportunidade = sequelize.define('Oportunidade', {
  NOportunidade: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  Titulo: {
      type: DataTypes.STRING,
      allowNull: false
  },
  Valor: {
      type: DataTypes.STRING,
      allowNull: true
  },
  Descricao: {
      type: DataTypes.TEXT,
      allowNull: true
  },
  NEtiqueta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Etiquetas',
          key: 'NEtiqueta'
      }
  },
  NEstagio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Estagios',
          key: 'NEstagio'
      }
  },
  NCliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: 'Clientes',
        key: 'NCliente'
    }
  },
  NUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: 'Usuario',
        key: 'NUsuario'
    }
  },
  NTipoProjeto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
        model: 'TiposProjeto',
        key : 'NTipoProjeto',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
  },
  DataHoraCriacao: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, { 
timestamps: false,
freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
getters: true // Adicionando a opção getters: true para definir getters virtuais

});

// Definindo a associação com o modelo Clientes
Oportunidade.belongsTo(Clientes, {
foreignKey: 'NCliente'
});

// Definindo a associação com o modelo Estagios
Oportunidade.belongsTo(Estagios, {
foreignKey: 'NEstagio'
});

// Definindo a associação com o modelo Etiquetas
Oportunidade.belongsTo(Etiquetas, {
    foreignKey: 'NEtiqueta'
    });

    Oportunidade.belongsTo(Usuarios, {
        foreignKey: 'NUsuario'
      });
      
      Oportunidade.belongsTo(TiposProjeto, {
        foreignKey: 'NTipoProjeto'
      });
        

Oportunidade.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
  
    // Removendo as propriedades dos modelos associados
    delete values.Etiqueta;
    delete values.Estagio;
    delete values.Cliente;
    delete values.Usuario;
    delete values.TiposProjeto;

    // Incluindo as propriedades das associações diretamente no objeto
    values.NomeEtiqueta = this.Etiqueta.Nome;
    values.NomeEstagio = this.Estagio.Nome;
    values.NomeCliente = this.Cliente.NomeEmp
    values.NomeUsuarioCriador = this.Usuario.Nome
    values.CargoUsuarioCriador = this.Usuario.NCargo
    values.TelefoneCliente = this.Cliente.TelefoneEmp;
    values.EmailCliente = this.Cliente.EmailEmp;
    values.TipoProjeto = this.TiposProjeto.Nome

  
    return values;
  };

module.exports = Oportunidade;