import './src/style/style.css';   
import { renderLoginPage } from './src/page/loginPage.js';
import { renderCalendarioPage } from './src/page/calendarioPage.js';

const app = document.getElementById('app');

const mostrarLogin = () =>
    renderLoginPage(app, (usuario) => {
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        mostrarCalendario(usuario);
    });

const mostrarCalendario = (usuario) =>
    renderCalendarioPage(app, usuario, () => {
        sessionStorage.removeItem('usuario');
        mostrarLogin();
    });

const guardado = JSON.parse(sessionStorage.getItem('usuario') ?? 'null');
guardado ? mostrarCalendario(guardado) : mostrarLogin();