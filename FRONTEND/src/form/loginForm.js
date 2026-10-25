import { api } from '../service/api.js';   

export const createLoginForm = (onSuccess) => {
    const form = document.createElement('form');
    form.className = 'login-form';
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
    `;

    const mensaje = form.querySelector('.mensaje');
    const boton = form.querySelector('button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensaje.textContent = '';
        boton.disabled = true;

        const datos = Object.fromEntries(new FormData(form));

        try {
            const { data } = await api.post('/login', datos);
            onSuccess(data.usuario);
        } catch (error) {
            mensaje.textContent =
                error.response?.data?.mensaje ?? 'No se pudo conectar con el servidor';
        } finally {
            boton.disabled = false;
        }
    });

    return form;
};