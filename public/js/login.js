// ============================================================
//  public/js/login.js
//  Script del formulario de login
//
//  Responsabilidades:
//    · Escuchar el submit del formulario de login
//    · Enviar las credenciales al endpoint POST /api/v1/auth/login
//    · Si el login es exitoso: guardar el token y redirigir al dashboard
//    · Si falla: mostrar el mensaje de error debajo del formulario
//    · Si ya hay un token válido al cargar la página: redirigir al dashboard
//      (evita que un usuario logueado vea el login de nuevo)
// ============================================================

import { setToken, getToken } from './auth.js'; // funciones de manejo del token

document.addEventListener('DOMContentLoaded', () => {

    // Si el usuario ya tiene una sesión activa, redirigir directamente al dashboard
    // (por ejemplo, al recargar la página del login estando ya logueado)
    if (getToken()) {
        window.location.href = '/dashboard.html';
        return; // no seguir ejecutando el resto del script
    }

    // Referencia al formulario de login definido en index.html
    const form = document.getElementById('loginForm');

    // Escuchar el evento submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // evitar que el formulario recargue la página

        // Leer los valores ingresados por el usuario
        const nombre_usuario = document.getElementById('username').value.trim();
        const contrasenia    = document.getElementById('password').value;

        // Ocultar el error anterior si existía (para no acumular mensajes)
        ocultarError();

        try {
            // Enviar las credenciales al backend como JSON
            const respuesta = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_usuario, contrasenia })
            });

            const json = await respuesta.json(); // parsear la respuesta JSON del servidor

            if (respuesta.ok) {
                // Login exitoso: el servidor devuelve { success: true, token: "...", usuario: {...} }
                setToken(json.token); // guardar el token en localStorage para futuras peticiones
                window.location.href = '/dashboard.html'; // redirigir al dashboard
            } else {
                // Login fallido: el servidor devuelve { success: false, error: "Credenciales inválidas" }
                mostrarError(json.error || 'Credenciales incorrectas. Intentá de nuevo.');
            }

        } catch (error) {
            // Error de red (servidor caído, sin conexión, etc.)
            mostrarError('No se pudo conectar con el servidor. Intentá de nuevo.');
        }
    });

    // ─── Funciones de UI ──────────────────────────────────────

    /** Muestra un mensaje de error debajo del formulario */
    function mostrarError(mensaje) {
        let alerta = document.getElementById('loginError'); // buscar si ya existe

        if (!alerta) {
            // Crear el elemento de alerta si no existía
            alerta = document.createElement('div');
            alerta.id = 'loginError';
            alerta.className = 'alert alert-danger mt-3 mb-0'; // estilo Bootstrap
            form.appendChild(alerta); // agregar después del botón
        }

        alerta.textContent = mensaje; // mostrar el mensaje de error
        alerta.classList.remove('d-none'); // asegurarse de que sea visible
    }

    /** Oculta el mensaje de error si existe */
    function ocultarError() {
        const alerta = document.getElementById('loginError');
        if (alerta) alerta.classList.add('d-none'); // ocultar con clase Bootstrap
    }
});
