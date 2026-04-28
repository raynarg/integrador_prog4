// Esqueleto de lógica para `cursos.html`.
// Contiene constantes y hooks DOM mínimos. Completa las funciones de render y eventos.

const CURSO_ESTADOS = {
  1: 'BORRADOR',
  2: 'INSCRIPCIÓN ABIERTA',
  3: 'INSCRIPCIÓN CERRADA',
  4: 'ELIMINADO'
};

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar datos (mock o real según API.useMock)
  try {
    const cursos = await window.API.getAll();
    // TODO: reemplazar la tabla estática por renderTable(cursos)
    console.log('Cursos cargados (mock):', cursos);
  } catch (err) {
    console.error('Error cargando cursos:', err);
  }
});

// Placeholders para que completes:
function renderTable(cursos) {
  // 1) Limpiar #tablaCursosBody
  // 2) Iterar cursos y crear filas usando campos: id_curso, nombre, inscriptos_max, id_curso_estado
}

function openDetalle(id) {
  // cargar curso por id y rellenar modal (#detalleNombre, #detalleDescripcion, etc.)
}

window.renderTable = renderTable;
window.openDetalle = openDetalle;
