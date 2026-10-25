import { registrar, mensajeDeError } from '../service/authService.js';

export const createRegistroForm = ({ onSuccess, onIrALogin }) => {
    const form = document.createElement('form');
    form.className = 'auth-form';
    form.innerHTML = `
        <h2>Crear cuenta</h2>

        <div class="fila">
            <div>
                <label for="nombres">Nombres</label>
                <input id="nombres" name="nombres" type="text"
                       autocomplete="given-name" minlength="2" required />
            </div>
            <div>
                <label for="apellidos">Apellidos</label>
                <input id="apellidos" name="apellidos" type="text"
                       autocomplete="family-name" minlength="2" required />
            </div>
        </div>

        <label for="correo">Correo</label>
        <input id="correo" name="correo" type="email" autocomplete="email" required />

        <label for="nombre_usuario">Usuario</label>
        <input id="nombre_usuario" name="nombre_usuario" type="text"
               autocomplete="username" minlength="3" required />

        <label for="contrasena">Contraseña</label>
        <input id="contrasena" name="contrasena" type="password"
               autocomplete="new-password" minlength="6" required />

        <label for="confirmar">Confirmar contraseña</label>
        <input id="confirmar" name="confirmar" type="password"
               autocomplete="new-password" minlength="6" required />

        <button type="submit">Registrarme</button>
        <p class="mensaje" role="alert"></p>
        <p class="cambio">¿Ya tienes cuenta?
            <button type="button" class="enlace">Inicia sesión</button>
        </p>
    `;

    const mensaje = form.querySelector('.mensaje');
    const boton = form.querySelector('button[type="submit"]');

    form.querySelector('.enlace').addEventListener('click', onIrALogin);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensaje.textContent = '';

        const { confirmar, ...datos } = Object.fromEntries(new FormData(form));

        if (datos.contrasena !== confirmar) {
            mensaje.textContent = 'Las contraseñas no coinciden';
            return;
        }

        boton.disabled = true;
        try {
            await registrar(datos);
            onSuccess();
        } catch (error) {
            mensaje.textContent = mensajeDeError(error);
        } finally {
            boton.disabled = false;
        }
    });

    return form;
};