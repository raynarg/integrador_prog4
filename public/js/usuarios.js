import { setupPaginaProtegida, getUsuarioDelToken, apiFetch } from './auth.js';

const usuario = getUsuarioDelToken();
if (!usuario || usuario.nombre_usuario !== 'admin') {
    alert('Acceso no autorizado.');
    window.location.href = 'dashboard.html';
}

setupPaginaProtegida();

const modalUsuarioEl  = new bootstrap.Modal(document.getElementById('modalUsuario'));
const modalPasswordEl = new bootstrap.Modal(document.getElementById('modalPassword'));
const modalEliminarEl = new bootstrap.Modal(document.getElementById('modalEliminar'));

const formUsuario  = document.getElementById('formUsuario');
const formPassword = document.getElementById('formPassword');
const tablaBody    = document.getElementById('tablaUsuariosBody');

const inputId       = document.getElementById('usuarioId');
const inputNombre   = document.getElementById('inputNombre');
const inputApellido = document.getElementById('inputApellido');
const inputUsername = document.getElementById('inputUsername');
const inputPassword = document.getElementById('inputPassword');
const grupoPassword = document.getElementById('grupoPassword');

let usuarioIdAEliminar = null;

document.getElementById('btnNuevoUsuario').addEventListener('click', () => {
    formUsuario.reset();
    inputId.value = '';
    document.getElementById('modalUsuarioTitulo').innerHTML = '<i class="bi bi-person-plus me-2"></i>Registrar usuario';
    grupoPassword.classList.remove('d-none');
    inputPassword.setAttribute('required', 'true');
});

async function cargarUsuarios() {
    try {
        const res = await apiFetch('/api/v1/usuarios');
        const json = await res.json();

        if (!json.success) {
            alert(json.error || 'Error al obtener usuarios');
            return;
        }

        renderTabla(json.data);
    } catch (err) {
        console.error(err);
        alert('Error de conexión al obtener usuarios');
    }
}

function renderTabla(usuarios) {
    tablaBody.innerHTML = '';

    const listaFiltrada = usuarios.filter(u => u.nombre_usuario !== 'admin');

    if (listaFiltrada.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-secondary">No hay usuarios registrados.</td></tr>`;
        return;
    }

    listaFiltrada.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-4">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style="width:40px;height:40px;">
                        ${u.nombre[0].toUpperCase()}${u.apellido[0].toUpperCase()}
                    </div>
                    <div class="fw-semibold text-dark">${u.nombre} ${u.apellido}</div>
                </div>
            </td>
            <td><code class="text-secondary">${u.nombre_usuario}</code></td>
            <td class="text-end px-4">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-warning py-0 px-2 btn-edit" data-id="${u.id_usuario}" title="Editar"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-primary py-0 px-2 btn-key" data-id="${u.id_usuario}" title="Cambiar contraseña"><i class="bi bi-key"></i></button>
                    <button class="btn btn-outline-danger py-0 px-2 btn-delete" data-id="${u.id_usuario}" title="Dar de baja"><i class="bi bi-person-x"></i></button>
                </div>
            </td>
        `;

        tr.querySelector('.btn-edit').addEventListener('click', () => abrirEditar(u));
        tr.querySelector('.btn-key').addEventListener('click', () => abrirCambiarPassword(u.id_usuario));
        tr.querySelector('.btn-delete').addEventListener('click', () => abrirEliminar(u.id_usuario, `${u.nombre} ${u.apellido}`));

        tablaBody.appendChild(tr);
    });
}

function abrirEditar(u) {
    inputId.value = u.id_usuario;
    inputNombre.value = u.nombre;
    inputApellido.value = u.apellido;
    inputUsername.value = u.nombre_usuario;

    document.getElementById('modalUsuarioTitulo').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar usuario';
    grupoPassword.classList.add('d-none');
    inputPassword.removeAttribute('required');

    modalUsuarioEl.show();
}

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputId.value;
    const body = {
        nombre: inputNombre.value.trim(),
        apellido: inputApellido.value.trim(),
        nombre_usuario: inputUsername.value.trim()
    };

    let url = '/api/v1/usuarios';
    let metodo = 'POST';

    if (id) {
        url += `/${id}`;
        metodo = 'PUT';
    } else {
        body.contrasenia = inputPassword.value;
    }

    try {
        const res = await apiFetch(url, {
            method: metodo,
            body: JSON.stringify(body)
        });
        const json = await res.json();

        if (!json.success) {
            alert(json.error || 'Error al procesar la solicitud');
            return;
        }

        modalUsuarioEl.hide();
        cargarUsuarios();
    } catch (err) {
        console.error(err);
        alert('Error al guardar datos del usuario');
    }
});

function abrirCambiarPassword(userId) {
    document.getElementById('passwordUsuarioId').value = userId;
    formPassword.reset();
    modalPasswordEl.show();
}

formPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('passwordUsuarioId').value;
    const password = document.getElementById('inputPasswordNueva').value;

    try {
        const res = await apiFetch(`/api/v1/usuarios/${id}/password`, {
            method: 'PUT',
            body: JSON.stringify({ contrasenia_nueva: password })
        });
        const json = await res.json();

        if (!json.success) {
            alert(json.error || 'Error al restablecer la contraseña');
            return;
        }

        modalPasswordEl.hide();
        cargarUsuarios();
    } catch (err) {
        console.error(err);
        alert('Error al procesar el cambio de contraseña');
    }
});

function abrirEliminar(id, nombreCompleto) {
    usuarioIdAEliminar = id;
    document.getElementById('nombreUsuarioAEliminar').textContent = nombreCompleto;
    modalEliminarEl.show();
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
    if (!usuarioIdAEliminar) return;

    const spinner = document.getElementById('spinnerEliminar');
    const texto   = document.getElementById('textoEliminar');
    const btn     = document.getElementById('btnConfirmarEliminar');

    btn.disabled = true;
    spinner.classList.remove('d-none');
    texto.textContent = 'Procesando...';

    try {
        const res = await apiFetch(`/api/v1/usuarios/${usuarioIdAEliminar}`, {
            method: 'DELETE'
        });
        const json = await res.json();

        if (!json.success) {
            alert(json.error || 'Error al procesar la baja');
            return;
        }

        modalEliminarEl.hide();
        cargarUsuarios();
    } catch (err) {
        console.error(err);
        alert('Error de conexión al procesar la baja');
    } finally {
        btn.disabled = false;
        spinner.classList.add('d-none');
        texto.textContent = 'Dar de baja';
        usuarioIdAEliminar = null;
    }
});

cargarUsuarios();
