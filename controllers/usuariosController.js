const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Inicia Sesión en UpTask',
        error
    });
}

exports.crearCuenta = async (req, res) => {

    const { email, password } = req.body

    try {
        await Usuarios.create({ email, password });

        //Crear URL de confirma
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //Crear el objeto de usuario
        const usuario = {
            email
        }

        //Enviar email
        await enviarEmail.enviar({
            confirmarUrl,
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            archivo: 'confirmarCuenta'
        });


        //Redirigir al usuario
        req.flash('correcto', 'Se ha enviado un email para verificarte')
        res.redirect('/iniciar-sesion');

    } catch (error) {

        req.flash('error', error.errors.map(err => err.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        });

    }

}

exports.formReestablecerContraseña = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({ where: { email: req.params.correo } });

    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Se ha confirmado tu usuario');
    res.redirect('/iniciar-sesion');
}