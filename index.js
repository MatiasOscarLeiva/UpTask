const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// const expressValidator = require("express-validator");

require('dotenv').config({ path: 'variables.env' });

//helpers con algunas funciones
const helpers = require("./helpers");

//Crear la conexión a la base de datos
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

//crear un app de express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');

//Habilitar body-parser para leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

//agregamos express validator
/******
 Tenía errores cuando agregaba express validator de esta manera
 Solamente con importarlo en el index.js del router me funciona
********/
// app.use(expressValidator());

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Flash
app.use(flash());

app.use(cookieParser());

//Sessions nos permite autenticarnos para navegar por siversas paginas sin volver a autenticar
app.use(session({
    secret: 'suersecretasdfqwer',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar var dumb
app.use((req, res, next) => {
    res.locals.vardumb = helpers.vardumb;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    next();
});

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
});