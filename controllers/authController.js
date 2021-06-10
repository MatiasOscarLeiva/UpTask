const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const { body } = require('express-validator');
const passport = require('passport');

const enviarEmail = require('../handlers/email');

const Usuarios = require('../models/Usuarios');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para verificar si el usuario esta autenticado
exports.usuarioAutenticado = (req, res, next) => {
    //autenticado pasa
    if (req.isAuthenticated()) {
        return next();
    }

    //no autenticado redirigir form
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

exports.enviarToken = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuarios.findOne({ where: { email } });

        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;

        await usuario.save();

        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
        await enviarEmail.enviar({
            resetUrl,
            usuario,
            subject: 'Reestablecer Contraseña',
            archivo: 'reestablecerPassword'
        });

        req.flash('correcto', 'Se envio un mensaje a tu correo');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer', {
            nombrePagina: 'Reestablecer Contraseña',
            mensajes: req.flash()
        });
    }

}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token } });

    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword', {
        nombrePagina: 'Reestablece tu contraseña'
    });

}

exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    usuario.token = null;
    usuario.expiracion = null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    await usuario.save();

    req.flash('correcto', 'Se ha cambiado la contraseña exitosamente')
    res.redirect('/iniciar-sesion');
}