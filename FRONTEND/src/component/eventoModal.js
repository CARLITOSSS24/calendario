import { fechaKey } from './calendario.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esUrlValida = (texto) => {
    try {
        return ['http:', 'https:'].includes(new URL(texto).protocol);
    } catch {
        return false;
    }
};

export const abrirEventoModal = ({ fecha, onGuardar }) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    dialog.innerHTML = `
        <form class="evento-form" novalidate>
            <h2>Crear evento</h2>

            <label for="ev-titulo">Título</label>
            <input id="ev-titulo" name="titulo" type="text" maxlength="100" />

            <label for="ev-fecha">Fecha</label>
            <input id="ev-fecha" name="fecha" type="date" />

            <label class="check">
                <input type="checkbox" name="todo_el_dia" /> Todo el día
            </label>

            <div class="fila" data-horas>
                <div>
                    <label for="ev-inicio">Hora de inicio</label>
                    <input id="ev-inicio" name="hora_inicio" type="time" value="09:00" />
                </div>
                <div>
                    <label for="ev-fin">Hora de finalización</label>
                    <input id="ev-fin" name="hora_fin" type="time" value="10:00" />
                </div>
            </div>

            <label for="ev-tipo">Lugar</label>
            <select id="ev-tipo" name="tipo_lugar">
                <option value="presencial">Presencial</option>
                <option value="virtual">Reunión virtual</option>
            </select>
            <input id="ev-lugar" name="lugar" type="text"
                   placeholder="Dirección o lugar" maxlength="150" />
            <input id="ev-enlace" name="enlace" type="url"
                   placeholder="Enlace de la reunión (opcional)" hidden />

            <label for="ev-recordatorio">Recordatorio</label>
            <select id="ev-recordatorio" name="recordatorio_min">
                <option value="">Sin recordatorio</option>
                <option value="10">10 minutos antes</option>
                <option value="30">30 minutos antes</option>
                <option value="60">1 hora antes</option>
                <option value="1440">1 día antes</option>
            </select>

            <label for="ev-invitado">Invitar personas</label>
            <div class="invitar">
                <input id="ev-invitado" type="email" placeholder="correo@ejemplo.com" />
                <button type="button" class="btn-secundario" data-accion="agregar">Agregar</button>
            </div>
            <ul class="chips"></ul>

            <fieldset class="notificaciones">
                <legend>Notificaciones</legend>
                <label class="check">
                    <input type="checkbox" name="notif_correo" /> Por correo electrónico
                </label>
                <label class="check">
                    <input type="checkbox" name="notif_push" /> Notificación push
                </label>
            </fieldset>

            <p class="mensaje" role="alert"></p>

            <div class="acciones">
                <button type="button" class="btn-secundario" data-accion="cancelar">Cancelar</button>
                <button type="submit" class="btn-primario">Guardar evento</button>
            </div>
        </form>
    `;

    const form = dialog.querySelector('form');
    const mensaje = dialog.querySelector('.mensaje');
    const horas = dialog.querySelector('[data-horas]');
    const inputLugar = dialog.querySelector('#ev-lugar');
    const inputEnlace = dialog.querySelector('#ev-enlace');
    const inputInvitado = dialog.querySelector('#ev-invitado');
    const chips = dialog.querySelector('.chips');

    form.elements.fecha.value = fechaKey(fecha);

    // --- Todo el día: oculta las horas ---
    form.elements.todo_el_dia.addEventListener('change', (e) => {
        horas.hidden = e.target.checked;
    });

    // --- Presencial / virtual ---
    form.elements.tipo_lugar.addEventListener('change', (e) => {
        const virtual = e.target.value === 'virtual';
        inputLugar.hidden = virtual;
        inputEnlace.hidden = !virtual;
    });

    // --- Invitados ---
    let invitados = [];

    const renderInvitados = () => {
        chips.replaceChildren(
            ...invitados.map((correo) => {
                const li = document.createElement('li');
                li.textContent = correo;

                const quitar = document.createElement('button');
                quitar.type = 'button';
                quitar.textContent = '×';
                quitar.setAttribute('aria-label', `Quitar ${correo}`);
                quitar.addEventListener('click', () => {
                    invitados = invitados.filter((c) => c !== correo);
                    renderInvitados();
                });

                li.append(quitar);
                return li;
            })
        );
    };

    const agregarInvitado = () => {
        const correo = inputInvitado.value.trim().toLowerCase();
        if (!correo) return true;

        if (!EMAIL_REGEX.test(correo)) {
            mensaje.textContent = 'El correo del invitado no es válido';
            return false;
        }
        if (!invitados.includes(correo)) invitados.push(correo);

        inputInvitado.value = '';
        mensaje.textContent = '';
        renderInvitados();
        return true;
    };

    dialog.querySelector('[data-accion="agregar"]').addEventListener('click', agregarInvitado);

    inputInvitado.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // que Enter no envíe todo el formulario
            agregarInvitado();
        }
    });

    // --- Envío ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        mensaje.textContent = '';

        // Si dejó un correo escrito sin pulsar "Agregar", lo sumamos
        if (!agregarInvitado()) return;

        const datos = new FormData(form);
        const titulo = datos.get('titulo').trim();
        const fechaEvento = datos.get('fecha');
        const todoElDia = datos.get('todo_el_dia') === 'on';
        const horaInicio = datos.get('hora_inicio');
        const horaFin = datos.get('hora_fin');
        const virtual = datos.get('tipo_lugar') === 'virtual';
        const enlace = datos.get('enlace').trim();

        if (!titulo) return void (mensaje.textContent = 'El título es obligatorio');
        if (!fechaEvento) return void (mensaje.textContent = 'La fecha es obligatoria');

        if (!todoElDia) {
            if (!horaInicio || !horaFin) {
                return void (mensaje.textContent = 'Indica la hora de inicio y de finalización');
            }
            if (horaFin <= horaInicio) {
                return void (mensaje.textContent =
                    'La hora de finalización debe ser posterior a la de inicio');
            }
        }

        if (virtual && enlace && !esUrlValida(enlace)) {
            return void (mensaje.textContent = 'El enlace debe empezar por http:// o https://');
        }

        onGuardar({
            titulo,
            fecha: fechaEvento,
            todo_el_dia: todoElDia,
            hora_inicio: todoElDia ? null : horaInicio,
            hora_fin: todoElDia ? null : horaFin,
            es_virtual: virtual,
            lugar: virtual ? null : datos.get('lugar').trim() || null,
            enlace: virtual ? enlace || null : null,
            recordatorio_min: datos.get('recordatorio_min')
                ? Number(datos.get('recordatorio_min'))
                : null,
            invitados: [...invitados],
            notif_correo: datos.get('notif_correo') === 'on',
            notif_push: datos.get('notif_push') === 'on',
        });

        dialog.close();
    });

    // --- Cerrar ---
    dialog.querySelector('[data-accion="cancelar"]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close(); // clic en el fondo oscuro
    });
    dialog.addEventListener('close', () => dialog.remove());

    document.body.append(dialog);
    dialog.showModal();
};