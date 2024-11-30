CREATE DATABASE proyecto_vml;

USE proyecto_vml;

CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    feclimit DATE NOT NULL,
    prioridad ENUM('Alta', 'Media', 'Baja') NOT NULL,
    estado ENUM('Pendiente', 'Completada') DEFAULT 'Pendiente'
);
