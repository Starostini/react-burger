## Основные возможности
- каталог ингредиентов с детальной информацией в модальных окнах
- drag-and-drop конструктор с подсчетом стоимости и валидацией данных
- оформление заказа с авторизацией и отображением номера заказа
- страницы входа, регистрации, восстановления и сброса пароля
- публичная лента заказов и история заказов пользователя с live-обновлениями
- защищенные маршруты профиля и модальные роуты для просмотра заказов и ингредиентов

## Технологии
- React 18, TypeScript, Vite
- React Router 7 с background routes для модальных окон
- Redux Toolkit + собственные типизированные hooks, хранение ингредиентов, конструктора и заказов
- Веб-сокеты через настраиваемый `socketMiddleware` для общей и персональной ленты заказов
- React DnD для перетаскивания ингредиентов
- UI библиотека `@ya.praktikum/react-developer-burger-ui-components`
- Тесты: Jest (юнит) и Cypress (E2E)

## Архитектура проекта
```
src
├── compoments/       // UI-компоненты (бургер, модалки, навигация и т.д.)
├── pages/            // Страницы и layout профиля
├── services/         // Срезы Redux Toolkit, middleware и typed hooks
├── utils/            // Вспомогательные функции и хранилище токенов
├── constants/, images/, styles
└── base.ts           // Конфигурация REST и WebSocket эндпоинтов
```
В `services` находятся основные slices: `ingredientsSlice`, `constructorSlice`, `orderSlice`, `ordersFeedSlice`, `userSlice` и т.д. Для WebSocket-ленты используется фабрика `createSocketMiddleware`, которую можно переиспользовать для других источников данных.

## Быстрый старт
1. Убедитесь, что установлен Node.js LTS (>= 18) и npm.
2. Клонируйте репозиторий и установите зависимости:
   ```bash
   npm install
   ```
3. Запустите dev-сервер Vite:
   ```bash
   npm run dev
   ```
4. Откройте приложение по адресу, который покажет Vite (по умолчанию http://localhost:5173).

> Приложение использует публичный API `https://norma.education-services.ru`. Если нужен другой сервер, скорректируйте константы в `src/base.ts`.

## Скрипты npm
| Скрипт | Назначение |
| --- | --- |
| `npm run dev` | Запуск Vite в режиме разработки с HMR |
| `npm run build` | TypeScript build + production сборка Vite в `dist/` |
| `npm run preview` | Локальный просмотр готовой сборки |
| `npm run lint` | Запуск ESLint по всему проекту |
| `npm run test` | Юнит-тесты Jest (watchman отключен для macOS) |
| `npm run test:watch` | Jest в watch-режиме |
| `npm run cypress:open` | Открыть Cypress GUI для e2e тестов |
| `npm run cypress:run` | Прогнать e2e тесты в headless режиме |
| `npm run deploy` | Сборка и публикация на GitHub Pages (использует `gh-pages`) |

### Тестирование
- **Юнит тесты** расположены в `src/services/*.test.js` и покрывают основные Redux slices и утилиты. Запуск: `npm run test`.
- **E2E тесты** в каталоге `cypress/`. Перед `npm run cypress:open` или `npm run cypress:run` поднимите dev-сервер (`npm run dev`) в отдельном терминале.

## Деплой на GitHub Pages
1. Убедитесь, что в `package.json` задан корректный `homepage` (например, `https://<username>.github.io/<repo>`), а в `vite.config.ts` указан `base` в соответствии с путём публикации.
2. Выполните `npm run deploy`. Скрипт соберёт проект и загрузит содержимое `dist/` в ветку `gh-pages` через пакет `gh-pages`.

## Полезные ссылки
- Production-версия: https://starostini.github.io/react-burger
- Дизайн-система компонентов: [Praktikum UI](https://www.npmjs.com/package/@ya.praktikum/react-developer-burger-ui-components)
