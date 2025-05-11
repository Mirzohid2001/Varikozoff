<?php
// Устанавливаем заголовки для обработки AJAX-запросов и CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Обработка preflight запросов (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Всегда возвращаем успешный ответ, имитируя работу формы
echo json_encode([
    'success' => true, 
    'message' => 'Заявка успешно отправлена',
    'appointment_id' => time() // Используем текущее время как ID
]);
?> 