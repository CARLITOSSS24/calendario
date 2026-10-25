import './src/style/style.css';
import { renderLoginPage } from './src/page/loginPage.js';
import { renderRegistroPage } from './src/page/registroPage.js';
import { renderCalendarioPage } from './src/page/calendarioPage.js';

const app = document.getElementById('app');

const mostrarLogin = (aviso = '') =>
    renderLoginPage(app, {
        aviso,
        onLogin: (usuario) => {
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            mostrarCalendario(usuario);
        },
        onIrARegistro: () => mostrarRegistro(),
    });

const mostrarRegistro = () =>
    renderRegistroPage(app, {
        onRegistrado: () => mostrarLogin('Cuenta creada. Ya puedes iniciar sesión.'),
        onIrALogin: () => mostrarLogin(),
    });

const mostrarCalendario = (usuario) =>
    renderCalendarioPage(app, usuario, () => {
        sessionStorage.removeItem('usuario');
        mostrarLogin();
    });

const guardado = JSON.parse(sessionStorage.getItem('usuario') ?? 'null');
guardado ? mostrarCalendario(guardado) : mostrarLogin();