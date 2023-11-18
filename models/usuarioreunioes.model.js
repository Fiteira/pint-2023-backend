const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Usuario = require('./usuarios.model');
const Reunioes = require('./reunioes.model');

const UsuarioReunioes = sequelize.define(
  'UsuarioReunioes',
  {
    NUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Usuario,
        key: 'NUsuario',
      },
    },
    NReunioes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Reunioes,
        key: 'NReunioes',
      },
    },
  },
  {
    timestamps: false,
    getters: true,
    freezeTableName: true,
  }
);

// Definindo a associação com o modelo Reunioes
UsuarioReunioes.belongsTo(Reunioes, {
  foreignKey: 'NReunioes',
});

// Definindo a associação com o modelo Usuarios
UsuarioReunioes.belongsTo(Usuario, {
  foreignKey: 'NUsuario',
});


UsuarioReunioes.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  // Removendo as propriedades dos modelos associados
  delete values.Usuario;
  delete values.Reunio;
  // Incluindo as propriedades das associações diretamente no objeto
  values.Titulo = this.Reunio.Titulo;
  values.Descricao = this.Reunio.Descricao;
  values.Tipo = this.Reunio.Tipo;
  values.DataHoraInicio = this.Reunio.DataHoraInicio;
  values.DataHoraFim = this.Reunio.DataHoraFim;
  values.NOportunidade = this.Reunio.NOportunidade;
  values.NEntrevista = this.Reunio.NEntrevista;
  values.DataHoraNotificacao = this.Reunio.DataHoraNotificacao;
  values.NotificacaoEnviada = this.Reunio.NotificacaoEnviada;
  values.NUsuarioCriador = this.Reunio.NUsuarioCriador;
  values.NomeUsuario = this.Usuario.Nome;
  values.NomeUsuarioCriador = this.Reunio.Usuario.Nome;

  return values;
};

module.exports = UsuarioReunioes;

