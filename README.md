# FitCon — Intelligent Fitness Tracker

**FitCon** — это современное Full-stack приложение (PWA) для мониторинга физического состояния и тренировочного процесса с использованием ИИ-распознавания данных.

---

## Ключевые возможности

* **AI Workout Parsing:** Автоматическое распознавание бумажных программ тренировок через OCR (Tesseract.js).
* **Dynamic Dashboard:** Интерактивная панель управления с аналитикой веса (Recharts) и умным виджетом ближайшей тренировки.
* **Progressive Web App (PWA):** Возможность установки приложения на мобильные устройства для работы в режиме реального времени в зале.
* **Smart Scheduling:** Автоматический расчет следующего дня тренировки на основе текущей даты и данных из базы.

---

## 🛠 Технологический стек

- **Frontend:** - React 18 (Vite)
  - Feature-Sliced Design (FSD)
  - TanStack Query v5 (React Query)
  - Recharts
  - Tesseract.js
- **Backend:** - Laravel 12
  - REST API
  - MySQL / MariaDB (XAMPP / OpenServer)
- **Инструменты:** - Axios
  - CSS Modules

---

## Структура проекта (FSD)

Проект организован по слоям согласно методологии **Feature-Sliced Design**:

* `app/` — Инициализация приложения, провайдеры (QueryClient) и глобальные стили.
* `pages/` — Композиция страниц (Dashboard, Profile) из виджетов и фич.
* `widgets/` — Крупные блоки: `Sidebar`, `NextWorkout` (логика выбора дня), `CalendarWidget`, `WeightChart`.
* `features/` — Функциональные действия: логика распознавания OCR, обновление веса.
* `entities/` — Бизнес-сущности: `User`, `Workout`, `Exercise`, `Nutrition`.
* `shared/` — Переиспользуемые утилиты: API-клиент, UI-kit, общие хуки.

---

## Установка и запуск

### 1. Клонирование
# bash
git clone [repository-url]
cd fitcon
---

### 2. Backend (Laravel)
# bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Укажите данные БД в .env (например, для XAMPP/OpenServer)
php artisan migrate --seed
php artisan serve

### 3. Frontend (React)
# bash
cd ../frontend
npm install
npm run dev

### Конвенции и качество кода
* Naming:

 * Компоненты: PascalCase

 * Хуки и переменные: camelCase

 * Константы: SCREAMING_SNAKE_CASE

* Архитектура: Строгое соблюдение слоев FSD (запрещены перекрестные импорты между слайсами одного слоя).

* Принципы: Следование правилам DRY и SRP (Single Responsibility Principle).
### Ссылки на источники

* Макет (Figma) - https://www.figma.com/design/nNIjV2mYyv7wsmxBIKldq3/Untitled?node-id=0-1&p=f&t=COE0Jy7hYvIcnxgW-0