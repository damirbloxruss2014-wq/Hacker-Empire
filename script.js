document.addEventListener("DOMContentLoaded", function () {
    // Переменные времени
    let gameHour = 9;
    let gameMinute = 0;

    // DOM Элементы
    const agreementModal = document.getElementById("agreement-modal");
    const tutorialModal = document.getElementById("tutorial-modal");
    const agreementCheckbox = document.getElementById("agreement-checkbox");
    const agreementBtn = document.getElementById("agreement-btn");
    const desktop = document.getElementById("desktop");
    const gameClock = document.getElementById("game-clock");

    // 1. ЛОГИКА ПОЛЬЗОВАТЕЛЬСКОГО СОГЛАШЕНИЯ
    agreementCheckbox.addEventListener("change", function () {
        agreementBtn.disabled = !this.checked;
    });

    agreementBtn.addEventListener("click", function () {
        if (agreementCheckbox.checked) {
            agreementModal.classList.add("hidden");
            // После соглашения сразу показываем окно туториала
            tutorialModal.classList.remove("hidden");
        }
    });

    // 2. ЛОГИКА ТУТОРИАЛА (Вызов функций Да / Нет)
    window.closeTutorial = function (startTutorial) {
        tutorialModal.classList.add("hidden");
        desktop.classList.remove("blurred"); // Разблокируем рабочий стол
        
        if (startTutorial) {
            alert("Запуск обучения системы... (Логику настроим на следующем этапе)");
            // Сюда мы добавим пошаговое объяснение, когда ты распишешь логику
        } else {
            console.log("Пользователь отказался от туториала. Свободный режим.");
        }
        
        // Запускаем игровые часы только после закрытия всех окон
        setInterval(updateGameClock, 1000); // 1 реальная секунда = 1 игровой час
    };

    // 3. СИСТЕМА ИГРОВОГО ВРЕМЕНИ (1 минута реального времени = 1 час игрового)
    // Чтобы играть было динамично, 1 минута (60 сек) делится на 60 игровых минут.
    // Получается, что каждую 1 реальную секунду игровой счетчик прибавляет 1 минуту.
    function updateGameClock() {
        gameMinute += 1;

        if (gameMinute >= 60) {
            gameMinute = 0;
            gameHour += 1;
        }

        if (gameHour >= 24) {
            gameHour = 0; // Наступил следующий день
        }

        // Форматируем время, чтобы всегда было две цифры (например, 09:05)
        const hourString = String(gameHour).padStart(2, '0');
        const minuteString = String(gameMinute).padStart(2, '0');
        
        gameClock.innerText = hourString + ":" + minuteString;
    }

    // Заглушка для открытия приложений
    window.openApp = function (appName) {
        alert("Запуск приложения " + appName + "... (Добавим окна на следующем этапе)");
    };
});
