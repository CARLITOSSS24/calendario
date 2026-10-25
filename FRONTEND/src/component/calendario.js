const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const pad = (n) => String(n).padStart(2, '0');

// Clave local "2026-10-25" (sin toISOString, que usa UTC y puede cambiar el día)
export const fechaKey = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const createCalendario = ({ onSelectDay } = {}) => {
    const hoy = new Date();
    const hoyKey = fechaKey(hoy);

    let mesMostrado = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    let seleccionado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const root = document.createElement('section');
    root.className = 'calendario';
    root.innerHTML = `
        <header class="cal-header">
            <button type="button" class="cal-nav" data-accion="prev"
                    aria-label="Mes anterior">‹</button>
            <h2 class="cal-titulo"></h2>
            <button type="button" class="cal-nav" data-accion="next"
                    aria-label="Mes siguiente">›</button>
            <button type="button" class="cal-hoy" data-accion="hoy">Hoy</button>
        </header>
        <div class="cal-semana">
            ${DIAS_SEMANA.map((d) => `<span>${d}</span>`).join('')}
        </div>
        <div class="cal-grid"></div>
    `;

    const titulo = root.querySelector('.cal-titulo');
    const grid = root.querySelector('.cal-grid');
    const formatoMes = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' });

    const render = () => {
        const año = mesMostrado.getFullYear();
        const mes = mesMostrado.getMonth();
        const desfase = (mesMostrado.getDay() + 6) % 7; // lunes = 0

        titulo.textContent = capitalizar(formatoMes.format(mesMostrado));

        const celdas = [];
        for (let i = 0; i < 42; i++) {
            const fecha = new Date(año, mes, 1 - desfase + i);
            const key = fechaKey(fecha);

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'cal-dia';
            boton.textContent = fecha.getDate();
            boton.dataset.fecha = key;

            if (fecha.getMonth() !== mes) boton.classList.add('fuera');
            if (key === hoyKey) boton.classList.add('hoy');
            if (key === fechaKey(seleccionado)) boton.classList.add('seleccionado');

            celdas.push(boton);
        }
        grid.replaceChildren(...celdas);
    };

    const seleccionar = (fecha) => {
        seleccionado = fecha;
        mesMostrado = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        render();
        onSelectDay?.(seleccionado);
    };

    root.querySelector('.cal-header').addEventListener('click', (e) => {
        const accion = e.target.closest('[data-accion]')?.dataset.accion;
        if (!accion) return;

        if (accion === 'prev') {
            mesMostrado = new Date(mesMostrado.getFullYear(), mesMostrado.getMonth() - 1, 1);
            render();
        } else if (accion === 'next') {
            mesMostrado = new Date(mesMostrado.getFullYear(), mesMostrado.getMonth() + 1, 1);
            render();
        } else if (accion === 'hoy') {
            seleccionar(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));
        }
    });

    grid.addEventListener('click', (e) => {
        const boton = e.target.closest('.cal-dia');
        if (!boton) return;
        const [a, m, d] = boton.dataset.fecha.split('-').map(Number);
        seleccionar(new Date(a, m - 1, d));
    });

    render();
    return root;
};