import { createLoginForm } from '../form/loginForm.js';

export const renderLoginPage = (container, { onLogin, onIrARegistro, aviso }) => {
    const main = document.createElement('main');
    main.className = 'auth-page';
    main.append(createLoginForm({ onSuccess: onLogin, onIrARegistro, aviso }));
    container.replaceChildren(main);
};