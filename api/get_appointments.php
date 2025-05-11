<?php
// Подключаем файл конфигурации
require_once 'config.php';

// Устанавливаем заголовки для обработки AJAX-запросов
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Базовая аутентификация - ВАЖНО заменить эти значения на более безопасные
$valid_username = 'admin';
$valid_password = 'admin123';

// Проверяем базовую аутентификацию
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="VarikozOFF Admin"');
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(['success' => false, 'error' => 'Требуется аутентификация']);
    exit;
} else {
    if ($_SERVER['PHP_AUTH_USER'] !== $valid_username || $_SERVER['PHP_AUTH_PW'] !== $valid_password) {
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode(['success' => false, 'error' => 'Неверное имя пользователя или пароль']);
        exit;
    }
}

try {
    // Получаем параметры фильтрации и сортировки
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'created_at';
    $order = isset($_GET['order']) && strtoupper($_GET['order']) === 'ASC' ? 'ASC' : 'DESC';
    
    // Валидация сортировки
    $allowed_sort_fields = ['id', 'name', 'phone', 'appointment_date', 'created_at'];
    if (!in_array($sort, $allowed_sort_fields)) {
        $sort = 'created_at';
    }
    
    // Ограничение лимита для безопасности
    if ($limit > 1000) {
        $limit = 1000;
    }
    
    // Подготавливаем SQL-запрос
    $query = "SELECT * FROM appointments ORDER BY {$sort} {$order} LIMIT :limit OFFSET :offset";
    $stmt = $db->prepare($query);
    $stmt->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $stmt->bindValue(':offset', $offset, SQLITE3_INTEGER);
    
    // Выполняем запрос
    $result = $stmt->execute();
    
    // Формируем массив результатов
    $appointments = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $appointments[] = $row;
    }
    
    // Получаем общее количество записей для пагинации
    $total = $db->querySingle("SELECT COUNT(*) FROM appointments");
    
    // Отправляем успешный ответ
    echo json_encode([
        'success' => true,
        'data' => $appointments,
        'meta' => [
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);
    
} catch (Exception $e) {
    // Если произошла ошибка, отправляем сообщение об ошибке
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при получении заявок: ' . $e->getMessage()
    ]);
}
?> 