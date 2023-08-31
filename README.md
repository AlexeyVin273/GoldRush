# Проект "GoldRush"
Данный проект выполняется интернами 2-го грейда, проходящими стажировку в "Лига А". Здесь представлен мой вариант реализации.
[Демо](https://alexeyvin273.github.io/GoldRush/)

## Техническое задание
* Реализовать игру Слоты.
* Чтобы сделать ставку - установить сумму ставки счётчиком в левом нижнем углу и нажать кнопку SPIN. До запуска игры можно изменить ставку, выставив новое значение ставки и нажав кнопку SPIN.
* Запуск слотов возможен после того, как сделана ставка, нажатием кнопки AUTO. Чтобы остановить розыгрыш, необходимо повторно нажать кнопку AUTO.
* Ставка сыграет, если по центру будут три одинаковых слота. В этом случае на счёт зачисляется ставка в пятикратном размере.

## Особенности реализации
* Выполнен адаптив на три брейкпойнта с применением медиа-запросов флекс и грид-контейнеров.
* Скрипты реализованы с применением ES6-модулей и классов без фреймворков.

## Работа со сборкой
- Для работы со сборкой необходим Node.js версии 16 и выше
- Установка - `npm i`.
- Запуск локального сервера - `npm start`.

## Структура проекта
- Исходные файлы лежат в директории `source`.
- Итоговый код попадает в директорию `build`.