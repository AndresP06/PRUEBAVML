$(document).ready(function () {

    // Inicializar flatpickr en el input de fecha límite
    flatpickr("#vFecLimit", {
        dateFormat: "Y-m-d", // Formato de fecha
        minDate: "today" // Fecha mínima (hoy)
    });

    // Cargar tareas al inicio
    cargarTareas();

    // Manejar el formulario de creación de tareas
    $("#frmTareas").on("submit", function (e) {
        e.preventDefault();

        const data = {
            vNombre: $("#vNombre").val(),
            vPrioridad: $("#vPrioridad").val(),
            vFecLimit: $("#vFecLimit").val(),
            vDescripcion: $("#vDescripcion").val(),
            vEstado: $("#vEstado").val(),
        };

        $.ajax({
            url: "api/tareas.php",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                // Mostrar mensaje de éxito con SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Tarea creada',
                    text: 'La tarea se creó correctamente.',
                    timer: 2000,
                    showConfirmButton: false,
                });

                $('#modalFormulario').modal('hide');


                // Resetear el formulario y recargar las tareas
                $("#frmTareas")[0].reset();
                cargarTareas();
            },
            error: function (xhr, status, error) {
                // Mostrar mensaje de error con SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear tarea',
                    text: `No se pudo crear la tarea. Error: ${xhr.responseText || status}`,
                });
            }
        });
    });


    // Filtrar tareas por estado
    $("#filter").on("change", function () {
        cargarTareas($(this).val());
    });

    $("#btn-actualizar").hide();
    $("#btn-ingreso").show();
    $("#vEstado").hide();

    $("#btnAgregar").click(function () {

        $("#vNombre").val("");
        $("#vPrioridad").val("").trigger("change");
        $("#vFecLimit").val("");
        $("#vDescripcion").val("");
        $("#vEstado").val("").trigger("change");
        $("#vNombre").prop("disabled", false);
        $("#vPrioridad").prop("disabled", false);
        $("#vFecLimit").prop("disabled", false);
        $("#vDescripcion").prop("disabled", false);
        $("#vEstado").prop("disabled", false);
        $("#btn-ingreso").show();
        $("#btn-actualizar").hide();
        $(".cEstado").hide();


    });

    $("#btnPdf").click(function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Añade contenido al PDF (por ejemplo, desde tu tabla)
        doc.text("Información de la Tabla", 10, 10);

        // Obtén los datos de la tabla
        const rows = [];
        document.querySelectorAll("#taskTable tbody tr").forEach((row) => {
            const rowData = [];
            row.querySelectorAll("td").forEach((cell) => {
                rowData.push(cell.innerText);
            });
            rows.push(rowData);
        });

        // Formatea la tabla en el PDF
        doc.autoTable({
            head: [["ID", "Nombre", "Prioridad", "Fecha Límite", "Descripción", "Estado"]],
            body: rows,
        });

        // Genera el archivo
        doc.save("tareas.pdf");
    });

    $("#btnXls").click(function () {
        // Obtén los datos de la tabla
        const rows = [];
        document.querySelectorAll("#taskTable tbody tr").forEach((row) => {
            const rowData = [];
            row.querySelectorAll("td").forEach((cell) => {
                rowData.push(cell.innerText);
            });
            rows.push(rowData);
        });

        // Define los encabezados
        const data = [
            ["ID", "Nombre", "Prioridad", "Fecha Límite", "Descripción", "Estado"],
            ...rows,
        ];

        // Crea la hoja de trabajo
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");

        // Genera el archivo
        XLSX.writeFile(workbook, "tareas.xlsx");
    });


});

function cargarTareas(filter = "") {
    $.get("api/tareas.php", function (tareas) {
        let html = "";
        tareas.forEach(tarea => {
            if (filter && tarea.estado !== filter) return;
            html += `
                <tr>
                    <td>${tarea.id}</td>
                    <td>${tarea.Nombre}</td>
                    <td style="background-color: ${traerPrioridad(tarea.prioridad)}">${tarea.prioridad}</td>
                    <td>${tarea.feclimit}</td>
                    <td>${tarea.descripcion}</td>
                    <td style="background-color: ${traerEstado(tarea.estado)}">${tarea.estado}</td>
                    <td>
                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalFormulario" onclick="consultarTareas(${tarea.id})">Consultar</button>
                        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#modalFormulario" onclick="editarTareas(${tarea.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarTareas(${tarea.id})">Eliminar</button>
                    </td>
                </tr>`;
        });
        $("#taskTable tbody").html(html);
    });
}

function eliminarTareas(id) {
    $.ajax({
        url: "api/tareas.php",
        method: "DELETE",
        data: JSON.stringify({ id }),
        success: function () {
            // Mostrar mensaje de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Tarea eliminada',
                text: 'La tarea se eliminó correctamente.',
                timer: 2000,
                showConfirmButton: false,
            });
            // Resetear formulario y recargar tareas
            $("#frmTareas")[0].reset();
            cargarTareas();
        },
        error: function (xhr, status, error) {
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: `No se pudo eliminar la tarea. Error: ${xhr.responseText || status}`,
            });
        }
    });
}


function consultarTareas(id) {
    // Obtener los datos de la tarea por su ID
    $.get(`api/tareas.php?id=${id}`, function (response) {
        // La respuesta parece ser un array, seleccionamos el primer elemento
        const tarea = response[0];

        if (tarea) {
            // Prellenar el formulario con los datos de la tarea
            $("#vNombre").val(tarea.Nombre);
            $("#vPrioridad").val(tarea.prioridad).trigger("change"); // Actualiza select2
            $("#vFecLimit").val(tarea.feclimit);
            $("#vDescripcion").val(tarea.descripcion);
            $("#vEstado").val(tarea.estado).trigger("change");
            // deshabilitamos los campos para la consulta
            $("#vNombre").prop("disabled", true);
            $("#vPrioridad").prop("disabled", true)
            $("#vFecLimit").prop("disabled", true);
            $("#vDescripcion").prop("disabled", true);
            $("#vEstado").prop("disabled", true);
            $(".cEstado").show();



            $("#btn-actualizar").hide();
            $("#btn-ingreso").hide();
            $("#vEstado").show();


        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al consultar',
                text: `No se pudo consultar la tarea.`,
            });
        }
    });
}

function editarTareas(id) {
    // Obtener los datos de la tarea por su ID

    $.get(`api/tareas.php?id=${id}`, function (response) {
        // La respuesta parece ser un array, seleccionamos el primer elemento
        const tarea = response[0];

        if (tarea) {
            // Prellenar el formulario con los datos de la tarea
            $("#vNombre").val(tarea.Nombre);
            $("#vPrioridad").val(tarea.prioridad).trigger("change"); // Actualiza select2
            $("#vFecLimit").val(tarea.feclimit);
            $("#vDescripcion").val(tarea.descripcion);
            $("#vEstado").val(tarea.estado).trigger("change");

            // deshabilitamos los campos para la consulta
            $("#vNombre").prop("disabled", false);
            $("#vPrioridad").prop("disabled", false)
            $("#vFecLimit").prop("disabled", false);
            $("#vDescripcion").prop("disabled", false);
            $("#vEstado").prop("disabled", false);


            $("#btn-actualizar").show();
            $("#btn-ingreso").hide();
            $("#vEstado").show();
            $(".cEstado").show();

            // Cambiar el evento del formulario para actualizar en lugar de crear
            $("#frmTareas").off("submit").on("submit", function (e) {
                e.preventDefault();

                const updatedData = {
                    id: tarea.id,
                    vNombre: $("#vNombre").val(),
                    vPrioridad: $("#vPrioridad").val(),
                    vFecLimit: $("#vFecLimit").val(),
                    vDescripcion: $("#vDescripcion").val(),
                    vEstado: $("#vEstado").val(),
                };

                // Enviar los datos actualizados al backend
                $.ajax({
                    url: "api/tareas.php",
                    method: "PUT",
                    data: JSON.stringify(updatedData),
                    success: function () {
                        // Mostrar mensaje de éxito con SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: 'Tarea actualizada',
                            text: 'La actualizada con exito.',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        // Resetear formulario y recargar tareas
                        $("#frmTareas")[0].reset();
                        cargarTareas();
                        $("#btn-actualizar").hide();
                        $("#btn-ingreso").show();
                        $("#vEstado").hide();
                        $('#modalFormulario').modal('hide');


                        // Restaurar el evento original del formulario
                        $("#frmTareas").off("submit").on("submit", function (e) {
                            e.preventDefault();
                            const data = {
                                vNombre: $("#vNombre").val(),
                                vPrioridad: $("#vPrioridad").val(),
                                vFecLimit: $("#vFecLimit").val(),
                                vDescripcion: $("#vDescripcion").val(),
                                vEstado: $("#vEstado").val(),
                            };



                            $.post("api/tareas.php", JSON.stringify(data), function () {
                                $("#frmTareas")[0].reset();
                                cargarTareas();
                            });


                        });
                    },
                    error: function (xhr, status, error) {
                        // Mostrar mensaje de error con SweetAlert
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al editar',
                            text: `No se pudo editar la tarea. Error: ${xhr.responseText || status}`,
                        });
                    }
                });
            });
        } else {
            alert("No se pudo cargar la tarea. Verifica el ID.");
        }
    });
}


function traerPrioridad(prioridad) {
    if (prioridad === 'Alta') {
        return 'lightcoral'; /* Alta prioridad - rojo */
    } else if (prioridad === 'Media') {
        return 'yellow'; /* Prioridad media - amarillo */
    } else if (prioridad === 'Baja') {
        return 'lightgreen'; /* Baja prioridad - verde claro */
    }
    return ''; // Sin color si no se reconoce la prioridad
}

function traerEstado(estado) {
    if (estado === 'Pendiente') {
        return 'lightcoral'; /* Alta prioridad - rojo */
    } else if (estado === 'Completada') {
        return 'lightgreen'; /* Prioridad media - amarillo */
    }
    return ''; // Sin color si no se reconoce la prioridad
}