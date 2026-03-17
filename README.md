# FitCom — Intelligent Fitness Tracker

FitCom — это современное Full-stack приложение для мониторинга физического состояния и тренировочного процесса с использованием ИИ-распознавания данных.

---

## Технологический стек

- **Frontend:** React, Vite, Feature-Sliced Design (FSD)
- **State Management:** TanStack Query (React Query)
- **Charts:** Recharts
- **OCR:** Tesseract.js (Распознавание текста с фото)
- **Backend:** Laravel 12, MySQL
- **Архитектура:** REST API

---

## Структура проекта (FSD)
Проект организован по слоям согласно методологии Feature-Sliced Design:
- `app/` — Инициализация приложения, провайдеры и глобальные стили.
- `pages/` — Композиция страниц из виджетов и фич.
- `widgets/` — Крупные самостоятельные блоки интерфейса (Navbar, Sidebar).
- `features/` — Функциональные действия пользователя (загрузка фото, логика OCR).
- `entities/` — Бизнес-сущности и работа с их данными (User, Workout, Exercise).
- `shared/` — Переиспользуемый инструментарий (UI-kit, API-клиент, утилиты).

---

## Установка и запуск

### 1. Клонирование

``bash
git clone [url]
cd fitcom

---

### 2. Backend (Laravel)

``bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Укажите данные БД в .env
php artisan migrate
php artisan serve

---

### 3. Frontend (React)

``bash
cd ../frontend
npm install
npm run dev

---

### Конвенции и качество кода

* Naming: - Компоненты: PascalCase
  * Хуки: camelCase (с префиксом use)
  * Константы: SCREAMING_SNAKE_CASE
* Инструменты: ESLint, Prettier, Husky (lint-staged).
* Принципы: Соблюдение DRY и SRP.