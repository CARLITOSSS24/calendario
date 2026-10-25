import { createRegistroForm } from '../form/registroForm.js';

export const renderRegistroPage = (container, { onRegistrado, onIrALogin }) => {
    const main = document.createElement('main');
    main.className = 'auth-page';
    main.append(createRegistroForm({ onSuccess: onRegistrado, onIrALogin }));
    container.replaceChildren(main);
};