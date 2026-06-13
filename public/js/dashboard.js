import { setupPaginaProtegida, apiFetch } from './auth.js';

document.addEventListener("DOMContentLoaded", async function () {
    if (!setupPaginaProtegida()) return;

    try {
        const [resCursos, resEstudiantes, resInscripciones] = await Promise.all([
            apiFetch("/api/v1/cursos?limit=100"),
            apiFetch("/api/v1/estudiantes?activo=1&limit=1"),
            apiFetch("/api/v1/inscripciones?limit=1000")
        ]);

        const jsonCursos = await resCursos.json();
        const jsonEstudiantes = await resEstudiantes.json();
        const jsonInscripciones = await resInscripciones.json();

        const cursos = jsonCursos.data || [];
        const inscripciones = jsonInscripciones.data || [];

        // Contar inscripciones reales por curso para la barra de ocupación
        const inscriptosPorCurso = {};
        inscripciones.forEach(ins => {
            inscriptosPorCurso[ins.id_curso] = (inscriptosPorCurso[ins.id_curso] || 0) + 1;
        });

        // La API ya excluye los dados de baja (es_activo = 0 en cursos_estados)
        const totalCursos = jsonCursos.pagination?.total ?? cursos.length;
        const totalEstudiantes = jsonEstudiantes.pagination?.total ?? 0;
        const totalInscripciones = jsonInscripciones.pagination?.total ?? inscripciones.length;
        const totalActivos = cursos.filter(c => c.estado === 2).length;

        document.getElementById("totalCursos").textContent = totalCursos;
        document.getElementById("totalEstudiantes").textContent = totalEstudiantes;
        document.getElementById("totalInscripciones").textContent = totalInscripciones;
        document.getElementById("totalCursosActivos").textContent = totalActivos;

        const tbodyCursos = document.getElementById("tablaCursosActivosBody");
        tbodyCursos.innerHTML = "";

        if (cursos.length === 0) {
            tbodyCursos.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay cursos registrados</td></tr>`;
            return;
        }

        cursos.slice(0, 5).forEach(curso => {
            const inscriptos = inscriptosPorCurso[curso.id] || 0;
            const porcentaje = curso.inscriptosMax > 0
                ? Math.min(Math.round((inscriptos / curso.inscriptosMax) * 100), 100)
                : 0;

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="fw-semibold font-monospace">${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="progress flex-grow-1" style="height:6px; max-width:180px;">
                            <div class="progress-bar bg-success" style="width:${porcentaje}%"></div>
                        </div>
                        <span class="text-secondary small">${inscriptos}/${curso.inscriptosMax}</span>
                    </div>
                </td>
                <td class="text-end">
                    <a href="inscripciones.html" class="btn btn-outline-secondary btn-sm">Ver Inscripciones</a>
                </td>
            `;
            tbodyCursos.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
    }
});
