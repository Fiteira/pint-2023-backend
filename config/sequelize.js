
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.NAME_BD, process.env.DIALECT_BD, process.env.PASSWORD_BD, {
  dialect: process.env.DIALECT_BD,
  host: process.env.HOST_DB ,
  port: process.env.PORT,
  
}
);

(async () => {
  // Sincronizará apenas num ambiente de produção ou caso seja forçado pela variável de ambiente FORCE_SYNC
  if (process.env.NODE_ENV === 'production' || process.env.FORCE_SYNC == 1) {
    await sequelize.sync({ alter: true, drop: false });
    console.log('Modelos sincronizados com sucesso!');
  }
})();


module.exports = sequelize;