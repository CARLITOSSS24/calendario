export const renderCalendarioPage = (container, usuario, onLogout) => {
    const main = document.createElement('main');
    main.className = 'calendario-page';

    const titulo = document.createElement('h1');
    titulo.textContent = `Bienvenido, ${usuario.nombres}`;

    const boton = document.createElement('button');
    boton.textContent = 'Cerrar sesión';
    boton.addEventListener('click', onLogout);

    main.append(titulo, boton);
    container.replaceChildren(main);
};