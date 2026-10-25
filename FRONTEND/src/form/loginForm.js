import { login, mensajeDeError } from '../service/authService.js';

export const createLoginForm = ({ onSuccess, onIrARegistro, aviso = '' }) => {
    const form = document.createElement('form');
    form.className = 'auth-form';
    form.innerHTML = `
        <h2>Iniciar sesión</h2>

        <label for="nombre_usuario">Usuario</label>
        <input id="nombre_usuario" name="nombre_usuario" type="text"
               autocomplete="username" required />

        <label for="contrasena">Contraseña</label>
        <input id="contrasena" name="contrasena" type="password"
               autocomplete="current-password" required />

        <button type="submit">Entrar</button>
        <p class="mensaje" role="alert"></p>
        <p class="cambio">¿No tienes cuenta?
            <button type="button" class="enlace">Regístrate</button>
        </p>
    `;

    const mensaje = form.querySelector('.mensaje');
    const boton = form.querySelector('button[type="submit"]');

    if (aviso) {
        mensaje.textContent = aviso;
        mensaje.classList.add('ok');
    }

    form.querySelector('.enlace').addEventListener('click', onIrARegistro);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensaje.textContent = '';
        mensaje.classList.remove('ok');
        boton.disabled = true;

        try {
            const data = await login(Object.fromEntries(new FormData(form)));
            onSuccess(data.usuario);
        } catch (error) {
            mensaje.textContent = mensajeDeError(error);
        } finally {
            boton.disabled = false;
        }
    });

    return form;
};