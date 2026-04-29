// Esqueleto de lógica para `cursos.html`.
// Contiene constantes y hooks DOM mínimos. Completa las funciones de render y eventos.

window.CURSO_ESTADOS = window.CURSO_ESTADOS || {
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

  const tablaBody = document.getElementById('tablaCursosBody');
  console.log(tablaBody);
  if (tablaBody) {
    tablaBody.innerHTML = '';
  }
});


