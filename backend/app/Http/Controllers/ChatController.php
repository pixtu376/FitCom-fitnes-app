<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatController extends Controller
{
    // Вспомогательная функция для подключения
    private function dbConnect() {
        $conn = mysqli_connect(
            env('DB_HOST', '127.0.0.1'),
            env('DB_USERNAME', 'root'),
            env('DB_PASSWORD', ''),
            env('DB_DATABASE', 'fitcom_db') // Поправил на твой fitcom_db
        );
        
        if (!$conn) {
            return response()->json(['error' => 'Database connection failed'], 500);
        }
        mysqli_set_charset($conn, "utf8mb4");
        return $conn;
    }

    // Получение списка контактов для колеса
    public function getContacts(Request $request) {
        $conn = $this->dbConnect();
        // Используем user_id (UUID), это теперь строка
        $userId = $request->user()->user_id; 

        // JOIN по user_id и таблице 'user'
// Этот запрос найдет контакт, даже если вы просто связаны в одной строке
$sql = "SELECT u.user_id, u.name, u.chat_uuid, uc.is_pinned 
        FROM user_contacts uc 
        JOIN user u ON (uc.contact_id = u.user_id OR uc.user_id = u.user_id)
        WHERE (uc.user_id = ? OR uc.contact_id = ?) 
          AND u.user_id != ? 
        ORDER BY uc.is_pinned DESC, u.name ASC";

$stmt = mysqli_prepare($conn, $sql);
// Передаем ID трижды: для поиска в первой колонке, во второй, и чтобы исключить самого себя из списка
mysqli_stmt_bind_param($stmt, "sss", $userId, $userId, $userId);// "s" т.к. UUID - это строка
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $contacts = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $contacts[] = $row;
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);

        return response()->json($contacts);
    }

    // Отправка нового сообщения
    public function sendMessage(Request $request) {
        $conn = $this->dbConnect();
        $senderId = $request->user()->user_id;
        $receiverId = $request->input('receiver_id'); // Убрал (int), это UUID
        $message = $request->input('message');

        $sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        // "sss" — три строки (UUID, UUID, текст)
        mysqli_stmt_bind_param($stmt, "sss", $senderId, $receiverId, $message);
        
        $success = mysqli_stmt_execute($stmt);
        $insertId = mysqli_insert_id($conn);

        mysqli_stmt_close($stmt);
        mysqli_close($conn);

        if ($success) {
            return response()->json(['success' => true, 'message_id' => $insertId]);
        }
        return response()->json(['success' => false], 500);
    }

    // Получение сообщений
    public function getMessages(Request $request) {
        $conn = $this->dbConnect();
        $userId = $request->user()->user_id;
        $contactId = $request->input('contact_id'); // Убрал (int)
        $lastMessageId = (int) $request->input('last_message_id', 0); 

        // Ищем переписку, где ID — это строки UUID
        $sql = "SELECT id, sender_id, receiver_id, message, created_at 
                FROM messages 
                WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
                AND id > ?
                ORDER BY created_at ASC";
                
        $stmt = mysqli_prepare($conn, $sql);
        // "ssssi" — 4 строки (UUID) и 1 число (ID сообщения)
        mysqli_stmt_bind_param($stmt, "ssssi", $userId, $contactId, $contactId, $userId, $lastMessageId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $messages = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $messages[] = $row;
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);

        return response()->json($messages);
    }

    // Получение расширенного профиля
    public function getUserProfile($uuid) {
        $conn = $this->dbConnect();
        
        // Поправил u.id -> u.user_id и имя таблицы users -> user
        $sql = "SELECT u.name, u.avatar_url, u.birth_day, 
                       tp.bio, tp.experience_years
                FROM user u
                LEFT JOIN trainer_profiles tp ON u.user_id = tp.user_id
                WHERE u.chat_uuid = ?";
                
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $uuid);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $userData = mysqli_fetch_assoc($result);

        mysqli_stmt_close($stmt);
        mysqli_close($conn);

        if (!$userData) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($userData);
    }
}