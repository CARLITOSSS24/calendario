import { createLoginForm } from '../form/loginForm.js';

export const renderLoginPage = (container, onLogin) => {
    const main = document.createElement('main');
    main.className = 'login-page';
    main.append(createLoginForm(onLogin));

    container.replaceChildren(main);
};