document.addEventListener("DOMContentLoaded", async function () {
    try{
        const respuesta = await fetch("js/cursos.json");
        const datos = await respuesta.json();
        
        const tabla = document.getElementById("tablaCursosBody");

        if (!tabla) {
            return;
        }

        tabla.innerHTML = "";

        datos.forEach(curso => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${curso.id_curso}</td>
                <td>${curso.nombre}</td>
                <td>${curso.inscriptos_max}</td>
                <td>${curso.id_curso_estado}</td>
                <td>
                    <!--Asi añado los botones con icono-->
                    <button
                        class="btn btn-sm btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#modalDetalle"
                        title="Ver Detalle"
                    >
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar los cursos:", error);
    }
});
