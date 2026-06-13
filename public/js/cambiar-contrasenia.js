import { setupPaginaProtegida, apiFetch } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!setupPaginaProtegida()) return;

    const form = document.getElementById('formCambiarContrasenia');
    const alertError = document.getElementById('alertError');
    const alertExito = document.getElementById('alertExito');
    const btnGuardar = document.getElementById('btnGuardar');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const contraseniaActual = document.getElementById('contraseniaActual').value;
        const contraseniaNueva = document.getElementById('contraseniaNueva').value;
        const confirmarContrasenia = document.getElementById('confirmarContrasenia').value;

        alertError.classList.add('d-none');
        alertExito.classList.add('d-none');

        if (contraseniaNueva !== confirmarContrasenia) {
            alertError.textContent = 'La nueva contraseña y la confirmación no coinciden.';
            alertError.classList.remove('d-none');
            return;
        }

        if (contraseniaNueva.length < 6) {
            alertError.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
            alertError.classList.remove('d-none');
            return;
        }

        try {
            btnGuardar.disabled = true;
            btnGuardar.textContent = 'Guardando...';

            const res = await apiFetch('/api/v1/auth/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contrasenia_actual: contraseniaActual,
                    contrasenia_nueva: contraseniaNueva
                })
            });

            const json = await res.json();

            if (res.ok) {
                alertExito.classList.remove('d-none');
                form.reset();
            } else {
                alertError.textContent = json.error || json.message || 'Error al cambiar la contraseña.';
                alertError.classList.remove('d-none');
            }
        } catch (err) {
            alertError.textContent = 'Error de conexión. Intentá de nuevo.';
            alertError.classList.remove('d-none');
        } finally {
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar cambios';
        }
    });
});
