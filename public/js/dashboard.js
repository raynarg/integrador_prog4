// ============================================================
//  public/js/dashboard.js
//  Script del Dashboard — Panel de resumen
//
//  Responsabilidades:
//    · Verificar autenticación y mostrar datos del usuario (via setupPaginaProtegida)
//    · Cargar y mostrar los totales reales de cursos y estudiantes desde la API
//    · Cargar y mostrar los cursos con inscripción abierta en la tabla del dashboard
// ============================================================

import { setupPaginaProtegida, apiFetch } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación, mostrar nombre en sidebar y conectar logout.
    // Si el token no existe, redirige al login y detiene la ejecución.
    if (!setupPaginaProtegida()) return;

    // Cargar los datos del dashboard en paralelo para mayor eficiencia
    // Promise.allSettled permite que si una petición falla, la otra igual se muestra
    const [resultadoCursos, resultadoEstudiantes] = await Promise.allSettled([
        apiFetch('/api/v1/cursos?limit=100'),          // traer cursos (usamos limit alto para el total)
        apiFetch('/api/v1/estudiantes?limit=1')        // solo necesitamos el total (pagination.total)
    ]);

    // ── Total de cursos ─────────────────────────────────────────
    if (resultadoCursos.status === 'fulfilled' && resultadoCursos.value?.ok) {
        const json = await resultadoCursos.value.json();

        // Mostrar el total de cursos en la card del dashboard
        const elTotalCursos = document.getElementById('totalCursos');
        if (elTotalCursos) elTotalCursos.textContent = json.pagination?.total ?? '—';

        // Mostrar los cursos con inscripción abierta (id_curso_estado = 2) en la tabla
        const cursosAbiertos = (json.data || []).filter(c => c.estado === 2);
        const elTotalActivos = document.getElementById('totalCursosActivos');
        if (elTotalActivos) elTotalActivos.textContent = cursosAbiertos.length;

        // Renderizar tabla de cursos activos recientes
        const tbody = document.getElementById('tablaCursosActivosBody');
        if (tbody) {
            tbody.innerHTML = ''; // limpiar contenido hardcodeado

            if (cursosAbiertos.length === 0) {
                // Mostrar mensaje si no hay cursos abiertos
                tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">Sin cursos con inscripción abierta</td></tr>`;
            } else {
                // Renderizar una fila por cada curso abierto (máximo 5 para el dashboard)
                cursosAbiertos.slice(0, 5).forEach(curso => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${curso.nombre}</td>
                        <td>${curso.inscriptosMax}</td>
                        <td>
                            <span class="badge text-bg-success-subtle text-success border border-success-subtle">
                                Abierta
                            </span>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });
            }
        }
    }

    // ── Total de estudiantes ────────────────────────────────────
    if (resultadoEstudiantes.status === 'fulfilled' && resultadoEstudiantes.value?.ok) {
        const json = await resultadoEstudiantes.value.json();

        // El total de estudiantes viene en la metadata de paginación
        const elTotalEstudiantes = document.getElementById('totalEstudiantes');
        if (elTotalEstudiantes) elTotalEstudiantes.textContent = json.pagination?.total ?? '—';
    }
});
