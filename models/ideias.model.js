const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Usuario = require("./usuarios.model");



const Ideias = sequelize.define('Ideia', {
    NIdeia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    /*
    Relatorio: {

    }
    */
    NUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'NUsuario'
        }
    },
    Titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Data: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    Estado: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
     
},{ timestamps: false});

Ideias.belongsTo(Usuario, 
    { foreignKey: 'NUsuario'}
    )

    Ideias.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
          // Removendo as propriedades dos modelos associados
          delete values.Usuario;
        // Incluindo as propriedades das associações diretamente no objeto
        values.NomeUsuario = this.Usuario.Nome;
        return values;
      };

module.exports = Ideias;