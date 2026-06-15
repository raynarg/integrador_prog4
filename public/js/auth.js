// ============================================================
//  public/js/auth.js
//  Módulo compartido de autenticación — Frontend
//
//  Este archivo se importa como módulo ES6 desde cursos.js,
//  estudiantes.js, dashboard.js y login.js para compartir
//  la lógica de manejo del token JWT sin repetir código.
//
//  Exporta:
//    · setToken / getToken / removeToken  → manejo de localStorage
//    · apiFetch                           → fetch con Authorization header automático
//    · getUsuarioDelToken                 → lee el nombre/apellido del payload JWT
//    · requireAuth                        → redirige al login si no hay token
//    · logout                             → borra el token y redirige al login
// ============================================================

// Clave usada para guardar el token en localStorage
// Usando un nombre específico para evitar conflictos con otros proyectos
const TOKEN_KEY = 'fcad_jwt_token';

// ─────────────────────────────────────────────────────────────
//  Manejo del token en localStorage
// ─────────────────────────────────────────────────────────────

/** Guarda el token JWT en localStorage luego de un login exitoso */
export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/** Lee y retorna el token guardado, o null si no existe */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/** Elimina el token del localStorage al hacer logout */
export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// ─────────────────────────────────────────────────────────────
//  apiFetch — wrapper de fetch con Authorization automático
// ─────────────────────────────────────────────────────────────

/**
 * Wrapper sobre fetch que agrega automáticamente el header
 * Authorization: Bearer <token> a cada petición.
 *
 * Si el servidor responde 401 (token expirado o inválido),
 * borra el token y redirige al login.
 *
 * @param {string} url              - URL del endpoint
 * @param {RequestInit} [opciones]  - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, opciones = {}) {
    const token = getToken(); // leer el token actual de localStorage

    // Construir los headers mezclando los defaults con los que pase el caller:
    //  · Content-Type por default (se puede sobreescribir en opciones.headers)
    //  · Authorization con el Bearer token (siempre se agrega si hay token)
    const headers = {
        'Content-Type': 'application/json',          // default para POST/PUT
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // adjuntar token
        ...(opciones.headers || {})                  // headers adicionales del caller
    };

    // Ejecutar el fetch con los headers combinados
    const respuesta = await fetch(url, { ...opciones, headers });

    // Si el servidor responde 401, el token expiró o es inválido
    // → limpiar localStorage y redirigir al login automáticamente
    if (respuesta.status === 401) {
        removeToken(); // borrar el token inválido
        window.location.href = '/index.html'; // redirigir al login
        return; // cortar la ejecución (no retornar la respuesta)
    }

    return respuesta; // retornar la respuesta para que el caller la procese
}

// ─────────────────────────────────────────────────────────────
//  getUsuarioDelToken — decodifica el payload del JWT en el cliente
// ─────────────────────────────────────────────────────────────

/**
 * Decodifica la parte payload del JWT (sin verificar la firma, solo para UI).
 * Útil para mostrar el nombre del usuario logueado sin hacer una llamada a la API.
 *
 * Un JWT tiene el formato: header.payload.firma
 * El payload es un JSON codificado en base64 (parte del medio).
 *
 * @returns {{ id, nombre, apellido, nombre_usuario } | null}
 */
export function getUsuarioDelToken() {
    const token = getToken();
    if (!token) return null; // no hay sesión activa

    try {
        const partesDelToken = token.split('.'); // separar en [header, payload, firma]
        const payloadBase64 = partesDelToken[1]; // tomar solo el payload (índice 1)
        const payloadJson = atob(payloadBase64); // decodificar base64 a string JSON
        return JSON.parse(payloadJson);          // parsear el JSON y retornar el objeto
    } catch {
        return null; // token malformado → tratar como sesión inválida
    }
}

// ─────────────────────────────────────────────────────────────
//  requireAuth — guard de ruta para páginas protegidas
// ─────────────────────────────────────────────────────────────

/**
 * Verifica que exista un token en localStorage.
 * Si no hay token, redirige al login inmediatamente.
 * Llamar al inicio del script de cada página protegida.
 *
 * @returns {boolean} true si hay token, false si no (y redirige)
 */
export function requireAuth() {
    if (!getToken()) {
        window.location.href = '/index.html'; // redirigir al formulario de login
        return false;
    }
    return true; // hay token, continuar con la carga de la página
}

// ─────────────────────────────────────────────────────────────
//  logout — cierra la sesión del usuario
// ─────────────────────────────────────────────────────────────

/**
 * Elimina el token del localStorage y redirige al login.
 * Asociar al botón de "Cerrar sesión" de cada página.
 */
export function logout() {
    removeToken();                        // eliminar el token
    window.location.href = '/index.html'; // ir al login
}

// ─────────────────────────────────────────────────────────────
//  setupPaginaProtegida — inicialización estándar de páginas privadas
// ─────────────────────────────────────────────────────────────

/**
 * Función de inicialización que centraliza las 3 acciones necesarias
 * en toda página protegida por autenticación:
 *   1. Verificar que haya un token (redirige si no lo hay)
 *   2. Mostrar el nombre del usuario logueado en el sidebar
 *   3. Conectar el botón de "Cerrar sesión" al logout real
 *
 * Los IDs que debe tener el HTML de la página:
 *   · id="sidebarUserNombre"  → div con el nombre completo del usuario
 *   · id="sidebarUserInitial" → div del avatar (muestra la inicial del nombre)
 *   · id="btnLogout"          → botón/link de cerrar sesión
 *
 * @returns {boolean} false si redirige al login, true si la sesión es válida
 */
export function setupPaginaProtegida() {
    // 1. Verificar autenticación — si no hay token, redirigir y salir
    if (!requireAuth()) return false;

    // 2. Leer los datos del usuario del token (decodificación base64, sin red)
    const usuario = getUsuarioDelToken();

    if (usuario) {
        // Mostrar nombre y apellido en el sidebar
        const elNombre = document.getElementById('sidebarUserNombre');
        if (elNombre) elNombre.textContent = `${usuario.nombre} ${usuario.apellido}`;

        // Mostrar la inicial del nombre en el círculo del avatar
        const elInicial = document.getElementById('sidebarUserInitial');
        if (elInicial) elInicial.textContent = usuario.nombre?.[0]?.toUpperCase() ?? 'U';

        // En el dashboard también hay un subtexto con el nombre_usuario
        const elUsuario = document.getElementById('sidebarUserUsuario');
        if (elUsuario) elUsuario.textContent = usuario.nombre_usuario;

        // Si el usuario es el administrador global, mostrar la opción del menú
        if (usuario.nombre_usuario === (window.__ADMIN_USERNAME__ || 'admin')) {
            const navAdmin = document.getElementById('navAdministrativos');
            if (navAdmin) navAdmin.classList.remove('d-none');
        }
    }

    // 3. Conectar el botón de cerrar sesión para que use logout() en lugar del href
    //    (así borramos el token antes de redirigir)
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); // evitar la navegación directa del href
            logout();           // borrar token y redirigir al login
        });
    }

    return true; // sesión válida, continuar cargando la página
}
