const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarCampos = (body, { requeridos }) => {
    const errores = [];
    const { nombres, apellidos, correo, nombre_usuario, contrasena } = body ?? {};

    const reglas = {
        nombres: () => typeof nombres === 'string' && nombres.trim().length >= 2,
        apellidos: () => typeof apellidos === 'string' && apellidos.trim().length >= 2,
        correo: () => typeof correo === 'string' && EMAIL_REGEX.test(correo),
        nombre_usuario: () => typeof nombre_usuario === 'string' && nombre_usuario.trim().length >= 3,
        contrasena: () => typeof contrasena === 'string' && contrasena.length >= 6,
    };
    const mensajes = {
        nombres: 'nombres debe tener al menos 2 caracteres',
        apellidos: 'apellidos debe tener al menos 2 caracteres',
        correo: 'correo no tiene un formato válido',
        nombre_usuario: 'nombre_usuario debe tener al menos 3 caracteres',
        contrasena: 'contrasena debe tener al menos 6 caracteres',
    };

    for (const campo of Object.keys(reglas)) {
        const presente = body?.[campo] !== undefined;
        if (!presente && requeridos) {
            errores.push(`${campo} es obligatorio`);
        } else if (presente && !reglas[campo]()) {
            errores.push(mensajes[campo]);
        }
    }
    return errores;
};

export const validarId = (req, res, next) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo' });
    }
    next();
};

export const validarCrearUsuario = (req, res, next) => {
    const errores = validarCampos(req.body, { requeridos: true });
    if (errores.length) return res.status(400).json({ errores });
    next();
};

export const validarActualizarUsuario = (req, res, next) => {
    const campos = ['nombres', 'apellidos', 'correo', 'nombre_usuario', 'contrasena'];
    if (!campos.some((c) => req.body?.[c] !== undefined)) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo para actualizar' });
    }
    const errores = validarCampos(req.body, { requeridos: false });
    if (errores.length) return res.status(400).json({ errores });
    next();
};

export const validarLogin = (req, res, next) => {
    const { nombre_usuario, contrasena } = req.body ?? {};
    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
    }
    next();
};