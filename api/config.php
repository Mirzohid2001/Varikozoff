<?php
// Включаем вывод ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Параметры подключения к базе данных SQLite3
$dbPath = __DIR__ . '/../database/varikozoff.db';

// Убедимся, что директория существует
$dbDir = dirname($dbPath);
if (!file_exists($dbDir)) {
    if (!mkdir($dbDir, 0777, true)) {
        die("Ошибка создания директории для базы данных");
    }
}

// Проверка прав на запись в директорию
if (!is_writable($dbDir)) {
    chmod($dbDir, 0777);
    if (!is_writable($dbDir)) {
        die("Нет прав на запись в директорию базы данных");
    }
}

try {
    // Создаем соединение с базой данных SQLite
    $db = new SQLite3($dbPath);
    
    // Настраиваем базу данных
    $db->exec('PRAGMA foreign_keys = ON');
    
    // Создаем таблицу для записей на прием, если она еще не существует
    $result = $db->exec('
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT,
            appointment_date TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ');
    
    if (!$result) {
        throw new Exception("Ошибка создания таблицы: " . $db->lastErrorMsg());
    }
    
} catch (Exception $e) {
    // Логируем ошибку
    file_put_contents(__DIR__ . '/../logs/errors.log', date('Y-m-d H:i:s') . " - DB Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}
?> 