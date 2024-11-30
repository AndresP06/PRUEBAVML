<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "proyecto_vml";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener tarea por su ID
            $id = (int)$_GET['id'];
            $stmt = $conn->prepare("SELECT * FROM tareas WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $tarea = $result->fetch_assoc();
    
            if ($tarea) {
                echo json_encode([$tarea]); // Retornar como array para mantener la compatibilidad con el frontend
            } else {
                echo json_encode(["error" => "Tarea no encontrada"]);
            }
        } else {
            // Obtener todas las tareas si no se pasa el parámetro ID
            $result = $conn->query("SELECT * FROM tareas");
            $tareas = [];
            while ($row = $result->fetch_assoc()) {
                $tareas[] = $row;
            }
            echo json_encode($tareas);
        }
        break;

    case 'POST':
        // Crear nueva tarea
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO tareas (Nombre, descripcion, feclimit, prioridad) VALUES (?, ?, ?, ?)");

        $stmt->bind_param("ssss", $data['vNombre'], $data['vDescripcion'], $data['vFecLimit'], $data['vPrioridad']);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;

    case 'PUT':
        // Editar tarea existente
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE tareas SET Nombre = ?, descripcion = ?, feclimit = ?, prioridad = ?, estado = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $data['vNombre'], $data['vDescripcion'], $data['vFecLimit'], $data['vPrioridad'], $data['vEstado'], $data['id']);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;

    case 'DELETE':
        // Eliminar tarea
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
        $stmt->bind_param("i", $data['id']);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;
}
$conn->close();
?>
