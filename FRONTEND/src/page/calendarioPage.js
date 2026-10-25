import { createCalendario, fechaKey } from '../component/calendario.js';
import { abrirEventoModal } from '../component/eventoModal.js';

const formatoDia = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});
const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const crearItemEvento = (ev) => {
    const li = document.createElement('li');
    li.className = 'evento';

    const hora = document.createElement('span');
    hora.className = 'evento-hora';
    hora.textContent = ev.todo_el_dia ? 'Todo el día' : `${ev.hora_inicio} – ${ev.hora_fin}`;

    const titulo = document.createElement('strong');
    titulo.textContent = ev.titulo;

    li.append(hora, titulo);

    const detalle = [];
    if (ev.es_virtual) detalle.push('Reunión virtual');
    else if (ev.lugar) detalle.push(ev.lugar);
    if (ev.invitados.length) detalle.push(`${ev.invitados.length} invitado(s)`);

    if (detalle.length) {
        const small = document.createElement('small');
        small.textContent = detalle.join(' · ');
        li.append(small);
    }

    if (ev.enlace) {
        const enlace = document.createElement('a');
        enlace.href = ev.enlace; // ya validado como http/https en el formulario
        enlace.target = '_blank';
        enlace.rel = 'noopener noreferrer';
        enlace.textContent = 'Unirse a la reunión';
        li.append(enlace);
    }

    return li;
};

export const renderCalendarioPage = (container, usuario, onLogout) => {
    const page = document.createElement('div');
    page.className = 'calendario-page';

    // Barra superior
    const topbar = document.createElement('header');
    topbar.className = 'topbar';

    const marca = document.createElement('strong');
    marca.textContent = 'Calendario';

    const nombre = document.createElement('span');
    nombre.textContent = usuario.nombre_usuario;

    const salir = document.createElement('button');
    salir.type = 'button';
    salir.textContent = 'Cerrar sesión';
    salir.addEventListener('click', onLogout);

    topbar.append(marca, nombre, salir);

    // Estado (por ahora en memoria: se pierde al recargar)
    const eventos = [];
    let diaSeleccionado = new Date();

    // Panel del día seleccionado
    const panel = document.createElement('aside');
    panel.className = 'panel-dia';

    const botonCrear = document.createElement('button');
    botonCrear.type = 'button';
    botonCrear.className = 'btn-primario';
    botonCrear.textContent = '+ Crear evento';

    const tituloDia = document.createElement('h3');

    const vacio = document.createElement('p');
    vacio.className = 'vacio';
    vacio.textContent = 'No hay eventos para este día.';

    const lista = document.createElement('ul');
    lista.className = 'eventos';

    panel.append(botonCrear, tituloDia, vacio, lista);

    const renderEventos = () => {
        const key = fechaKey(diaSeleccionado);
        const delDia = eventos
            .filter((ev) => ev.fecha === key)
            .sort((a, b) => (a.hora_inicio ?? '').localeCompare(b.hora_inicio ?? ''));

        vacio.hidden = delDia.length > 0;
        lista.replaceChildren(...delDia.map(crearItemEvento));
    };

    const mostrarDia = (fecha) => {
        diaSeleccionado = fecha;
        tituloDia.textContent = capitalizar(formatoDia.format(fecha));
        renderEventos();
    };

    botonCrear.addEventListener('click', () => {
        abrirEventoModal({
            fecha: diaSeleccionado,
            onGuardar: (evento) => {
                eventos.push(evento);
                renderEventos();
            },
        });
    });

    const calendario = createCalendario({ onSelectDay: mostrarDia });
    mostrarDia(diaSeleccionado);

    const layout = document.createElement('main');
    layout.className = 'layout';
    layout.append(calendario, panel);

    page.append(topbar, layout);
    container.replaceChildren(page);
};