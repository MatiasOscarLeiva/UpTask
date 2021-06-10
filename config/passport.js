const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propias(usuario y password);
passport.use(
    new LocalStrategy(
        //por default usuario espera un email y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({ where: { email, activo: 1 } });

                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'La contraseña no es valida'
                    })
                }

                return done(null, usuario);
            } catch (error) {
                return done(null, false, {
                    message: 'Esa cuenta no existe o no fue verificada'
                })
            }
        }
    )
)

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

//deserializar
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

module.exports = passport;