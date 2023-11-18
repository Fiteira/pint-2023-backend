const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Ideia = require("./ideias.model")
const TopicoIdeia = require("./topicoidea.model")



const TopicosDaIdeia = sequelize.define('TopicosDaIdeia', {
    NTopicoIdeia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:
        {
            model: 'TopicoIdeia',
            key: 'NTopicoIdeia'
        }
    },
    NIdeia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references:
        {
            model: 'Ideia',
            key: 'NIdeia'
        }
    }
     
},{ 
    timestamps: false,
    freezeTableName: true, // adicionando a opção freezeTableName para evitar a pluralização do nome da tabela
    getters: true // Adicionando a opção getters: true para definir getters virtuais
    
    });

    TopicosDaIdeia.belongsTo(Ideia, {
        foreignKey: 'NIdeia'
    })

    TopicosDaIdeia.belongsTo(TopicoIdeia, {
        foreignKey: 'NTopicoIdeia'
    })

    TopicosDaIdeia.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
      
        // Removendo as propriedades dos modelos associados
        delete values.Ideia;
        delete values.TopicoIdeium;
      
        // Incluindo as propriedades das associações diretamente no objeto
        values.NomeTopico = this.TopicoIdeium.NomeTopico;

      
        return values;
      };



module.exports = TopicosDaIdeia;