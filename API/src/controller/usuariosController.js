import bcrypt from 'bcryptjs';
import { pool } from '../config/data/connectPoSQL.js';

const CAMPOS = 'id, nombres, apellidos, correo, nombre_usuario';
const esDuplicado = (error) => error.code === '23505';

export const getUsuarios = async (req, res) => {
    const { rows } = await pool.query(`SELECT ${CAMPOS} FROM usuarios ORDER BY id`);
    res.json(rows);
};

export const getUsuarioById = async (req, res) => {
    const { rows } = await pool.query(
        `SELECT ${CAMPOS} FROM usuarios WHERE id = $1`,
        [req.params.id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
};

export const createUsuario = async (req, res) => {
    const { nombres, apellidos, correo, nombre_usuario, contrasena } = req.body;

    try {
        const hash = await bcrypt.hash(contrasena, 10);
        const { rows } = await pool.query(
            `INSERT INTO usuarios (nombres, apellidos, correo, nombre_usuario, contrasena)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING ${CAMPOS}`,
            [nombres, apellidos, correo, nombre_usuario, hash]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ mensaje: 'El correo o nombre de usuario ya existe' });
        }
        throw error;
    }
};

export const updateUsuario = async (req, res) => {
    const { nombres, apellidos, correo, nombre_usuario, contrasena } = req.body;
    const hash = contrasena ? await bcrypt.hash(contrasena, 10) : null;

    try {
        const { rows } = await pool.query(
            `UPDATE usuarios SET
                nombres        = COALESCE($1, nombres),
                apellidos      = COALESCE($2, apellidos),
                correo         = COALESCE($3, correo),
                nombre_usuario = COALESCE($4, nombre_usuario),
                contrasena     = COALESCE($5, contrasena)
             WHERE id = $6
             RETURNING ${CAMPOS}`,
            [nombres, apellidos, correo, nombre_usuario, hash, req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ mensaje: 'El correo o nombre de usuario ya existe' });
        }
        throw error;
    }
};

export const deleteUsuario = async (req, res) => {
    const { rowCount } = await pool.query(
        'DELETE FROM usuarios WHERE id = $1',
        [req.params.id]
    );
    if (rowCount === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado' });
};

export const login = async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    const { rows } = await pool.query(
        'SELECT * FROM usuarios WHERE nombre_usuario = $1',
        [nombre_usuario]
    );
    const usuario = rows[0];

    const valida = usuario && await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valida) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const { contrasena: _, ...datos } = usuario;
    res.json({ mensaje: 'Login exitoso', usuario: datos });
};