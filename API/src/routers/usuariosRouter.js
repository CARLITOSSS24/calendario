import { Router } from 'express';
import {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    login,
} from '../controller/usuariosController.js';
import {
    validarId,
    validarCrearUsuario,
    validarActualizarUsuario,
    validarLogin,
} from '../validator/usuariosValidator.js';

const router = Router();

router.post('/login', validarLogin, login);

router.get('/usuarios', getUsuarios);
router.get('/usuarios/:id', validarId, getUsuarioById);
router.post('/usuarios', validarCrearUsuario, createUsuario);
router.put('/usuarios/:id', validarId, validarActualizarUsuario, updateUsuario);
router.delete('/usuarios/:id', validarId, deleteUsuario);

export default router;