Documentación de Uso para la Aplicación de Manejo de Tareas
Índice
Introducción

Requisitos Previos

Instalación

Estructura del Proyecto

Uso de la Aplicación

5.1. Crear una Nueva Tarea

5.2. Consultar una Tarea

5.3. Editar una Tarea

5.4. Eliminar una Tarea

5.5. Generar Reportes (PDF y XLS)

Conexión con la Base de Datos

API

7.1. Endpoints

Estilos y Scripts

Consideraciones Finales

1. Introducción
Esta aplicación permite gestionar tareas de manera eficiente, proporcionando opciones para crear, consultar, editar, eliminar y generar reportes de las tareas. Está construida utilizando HTML, CSS, JavaScript, PHP y MySQL.

2. Requisitos Previos
Servidor web con soporte para PHP (ej. XAMPP, WAMP)

Base de datos MySQL

Conexión a Internet para cargar librerías externas (Bootstrap, jQuery, Flatpickr, SweetAlert, jsPDF, XLSX)

3. Instalación
Clonar o descargar el repositorio del proyecto.

Configurar la base de datos: Ejecutar el archivo tareas.sql en tu gestor de bases de datos MySQL para crear la base de datos y la tabla de tareas.

Configurar la conexión a la base de datos en tareas.php:

php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "proyecto_vml";
Ajusta estos parámetros según tu configuración local.

4. Estructura del Proyecto
index.html: Estructura principal de la aplicación.

styles.css: Estilos personalizados.

tareas.php: Lógica del backend para la manipulación de tareas.

main.js: Lógica del frontend para interactuar con la interfaz de usuario.

tareas.sql: Script para la creación de la base de datos y la tabla de tareas.

5. Uso de la Aplicación
5.1. Crear una Nueva Tarea
Haz clic en el botón "Agregar nueva tarea".

Completa el formulario con el nombre de la tarea, prioridad, fecha límite, descripción y estado.

Haz clic en "Guardar" para crear la tarea.

5.2. Consultar una Tarea
Haz clic en el botón "Consultar" junto a la tarea que deseas revisar.

Se abrirá el formulario con los datos de la tarea, los campos estarán deshabilitados.

5.3. Editar una Tarea
Haz clic en el botón "Editar" junto a la tarea que deseas modificar.

Modifica los datos necesarios en el formulario.

Haz clic en "Actualizar" para guardar los cambios.

5.4. Eliminar una Tarea
Haz clic en el botón "Eliminar" junto a la tarea que deseas borrar.

Confirma la eliminación en el diálogo de SweetAlert.

5.5. Generar Reportes (PDF y XLS)
Para generar un PDF de las tareas, haz clic en el botón "Generar PDF".

Para generar un archivo XLS de las tareas, haz clic en el botón "Generar XLS".

6. Conexión con la Base de Datos
La conexión a la base de datos se establece en el archivo tareas.php utilizando los siguientes parámetros:

php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "proyecto_vml";
Ajusta estos parámetros según tu configuración local.

7. API
7.1. Endpoints
GET /api/tareas.php: Obtiene todas las tareas o una tarea específica por ID.

POST /api/tareas.php: Crea una nueva tarea.

PUT /api/tareas.php: Actualiza una tarea existente.

DELETE /api/tareas.php: Elimina una tarea.

8. Estilos y Scripts
styles.css: Contiene los estilos personalizados para la aplicación.

main.js: Contiene la lógica del frontend, incluyendo la interacción con la API y la manipulación del DOM.

9. Consideraciones Finales
Asegúrate de tener todas las librerías necesarias cargadas correctamente para el funcionamiento óptimo de la aplicación. Puedes personalizar los estilos y la lógica según tus necesidades.