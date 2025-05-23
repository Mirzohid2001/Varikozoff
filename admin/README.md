# Инструкция по настройке админ-панели VarikozOFF

## Настройка базы данных
База данных SQLite создается автоматически при первом обращении к API. 
Файл базы данных будет находиться в директории `database/varikozoff.db`.

## Настройка защиты паролем для админ-панели

Для максимальной безопасности рекомендуется настроить два уровня защиты:

### 1. Защита через .htaccess (серверная защита)

1. Отредактируйте файл `.htaccess` в директории `admin/`
2. Создайте файл с паролями `.htpasswd` с помощью команды:
   ```
   htpasswd -c /path/to/.htpasswd admin
   ```
   Замените `/path/to/.htpasswd` на реальный путь к файлу. Файл должен быть недоступен через веб.
3. Укажите путь к файлу `.htpasswd` в файле `.htaccess`

### 2. Авторизация через JavaScript (клиентская защита)

Эта защита уже настроена в файле `api/get_appointments.php`. 
По умолчанию используются следующие учетные данные:

- Логин: `admin`
- Пароль: `varikozoff2025`

Для изменения учетных данных отредактируйте следующие строки в файле `api/get_appointments.php`:

```php
// Базовая аутентификация - ВАЖНО заменить эти значения на более безопасные
$valid_username = 'admin';
$valid_password = 'varikozoff2025';
```

## Техническая информация

Админ-панель использует:
- HTML/CSS/JavaScript для интерфейса
- SQLite3 для хранения данных
- PHP для API
- Bootstrap 5 для стилей
- Font Awesome для иконок

## Функциональность
- Просмотр всех заявок на прием
- Сортировка и постраничная навигация
- Фильтрация по различным полям
- Авторизация для доступа
- Защита от несанкционированного доступа 