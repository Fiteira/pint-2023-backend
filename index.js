// index.js
const express = require('express')

const app = express()
const PORT = process.env.PORT || 4000

const bodyParser = require('body-parser');
const passport = require("passport");
const cors = require('cors');
const events = require("./config/events")

const intervalo_verificacao = process.env.INTERVALO_VER || 3


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(passport.initialize());
const cron = require('node-cron');
// Middleware de log de solicitações

app.use((req, res, next) => {
  console.log(`[${agora}] ${req.method} ${req.url}`);
  next();
});



// suporte as sessões
const session = require('express-session');

app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false
  }));
// Obtenção de todas os rotas
require("./routes/clientes.routes")(app)
require("./routes/beneficios.routes")(app)
require("./routes/usuarios.routes")(app)
require("./routes/auth.routes")(app)
require("./routes/vagas.routes")(app)
require("./routes/candidaturas.routes")(app)
require("./routes/indicacoes.routes")(app)
require("./routes/upload.routes")(app)
require("./routes/localicade.routes")(app)
require("./routes/tipovagas.routes")(app)
require("./routes/ideias.routes")(app)
require("./routes/topicoideias.routes")(app)
require("./routes/topicosdasideias.routes")(app)
require("./routes/anexos.routes")(app)
require("./routes/cargos.routes")(app)
require("./routes/reunioes.routes")(app)
require("./routes/entrevista.routes")(app)
require("./routes/usuarioreunioes.routes")(app)
require("./routes/nota.routes")(app)
require("./routes/etiquetas.routes")(app)
require("./routes/estagios.routes")(app)
require("./routes/oportunidades.routes")(app)
require("./routes/status.routes")(app)
require("./routes/contactos.routes")(app)
require("./routes/relatorioideia.routes")(app)
require("./routes/tipoprojetos.routes")(app)

let agora = new Date();
console.log("Inicialização: " + agora)

app.listen(PORT, () => {
  console.log(`O ambiente está definido como: ${process.env.NODE_ENV}`)
  console.log(`API escutando na porta: ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Atenção, os endpoints desta api estão em /api/, por exemplo /api/clientes')
})

// O envio de emails de notificação é apenas feito em produção
if (process.env.NODE_ENV === 'production') {
  // Executará a verificação de reuniões próximas uma vez quando a API inicia
  events.verificarReunioesProximas();

  // Executará os eventos de tempos em tempos
cron.schedule(`*/${intervalo_verificacao} * * * *`, () => {
  events.verificarReunioesProximas();
});
}

// Export the Express API
module.exports = app
