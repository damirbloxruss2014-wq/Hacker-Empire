document.addEventListener("DOMContentLoaded", function () {
    // ИГРОВЫЕ ПЕРЕМЕННЫЕ (STATE)
    let balance = 0;           // Деньги в BTC
    let hackerLevel = 1;       // Уровень популярности
    let hackerXP = 0;          // Опыт для лвл-апа
    let anonymity = 100;       // Уровень защиты личности (%)
    let pсQuality = 1.0;       // Множитель качества написания вирусов

    // Переменные времени
    let gameHour = 9;
    let gameMinute = 0;
    let clockInterval = null;

    // Системные переменные для текущего контракта в Anongram
    let currentContract = null;

    // DOM ЭЛЕМЕНТЫ
    const agreementModal = document.getElementById("agreement-modal");
    const tutorialModal = document.getElementById("tutorial-modal");
    const agreementCheckbox = document.getElementById("agreement-checkbox");
    const agreementBtn = document.getElementById("agreement-btn");
    const desktop = document.getElementById("desktop");
    const gameClock = document.getElementById("game-clock");

    const chatMessages = document.getElementById("chat-messages-box");
    const chatActions = document.getElementById("chat-actions-zone");
    const threatContact = document.getElementById("threat-contact");

    const hacknetLoader = document.getElementById("hacknet-loader");
    const connectionLog = document.getElementById("connection-log-box");
    const hacknetContent = document.getElementById("hacknet-content");
    const forumThreads = document.getElementById("forum-threads-box");

    const walletDisplay = document.getElementById("wallet-display");
    const anonDisplay = document.getElementById("anon-display");
    const anonBar = document.getElementById("anon-bar");

    // ЛОГИКА СОГЛАШЕНИЯ И ТУТОРИАЛА
    agreementCheckbox.addEventListener("change", function () {
        agreementBtn.disabled = !this.checked;
    });

    agreementBtn.addEventListener("click", function () {
        if (agreementCheckbox.checked) {
            agreementModal.classList.add("hidden");
            tutorialModal.classList.remove("hidden");
        }
    });

    window.closeTutorial = function (startTutorial) {
        tutorialModal.classList.add("hidden");
        desktop.classList.remove("blurred");
        
        if (startTutorial) {
            sendBotMessage("Приветствую, Anonymous. Я BlackWork. Я буду поставлять тебе контракты в даркнете. Твоя цель — поднимать репутацию и не попасться киберполиции. Для старта я выслал тебе первый заказ.");
        } else {
            sendBotMessage("Решил работать без гида? Смело. Лови первые заказы на доске объявлений.");
        }
        
        generateNewContract();
        clockInterval = setInterval(updateGameClock, 1000); // 1 реальная сек = 1 игровой час
        setInterval(passiveThreatLogic, 5000); // Проверка защиты каждые 5 игровых часов
    };

    // СИСТЕМА ВРЕМЕНИ
    function updateGameClock() {
        gameMinute += 1;
        if (gameMinute >= 60) { gameMinute = 0; gameHour += 1; }
        if (gameHour >= 24) { gameHour = 0; }

        gameClock.innerText = String(gameHour).padStart(2, '0') + ":" + String(gameMinute).padStart(2, '0');
    }

    // УПРАВЛЕНИЕ ОКНАМИ И ИМИТАЦИЯ ЗАГРУЗКИ VPN/PROXY
    window.openApp = function (appName) {
        const appWindow = document.getElementById("app-" + appName);
        if (!appWindow) return;

        appWindow.classList.remove("hidden");

        // Если открываем браузер HackNet — запускаем красивый прокси-лоадер
        if (appName === "hacknet") {
            hacknetContent.style.display = "none";
            hacknetLoader.classList.remove("hidden");
            runProxyLoader();
        }
    };

    window.closeApp = function (appName) {
        const appWindow = document.getElementById("app-" + appName);
        if (appWindow) appWindow.classList.add("hidden");
    };

    function runProxyLoader() {
        connectionLog.innerText = "";
        const logs = [
            "[SYSTEM] Инициализация безопасного шлюза...",
            "[PROXY] Подключение к серверу: Мальдивы (192.168.44.12)... Ок",
            "[VPN] Поднятие туннеля шифрования AES-256... Соединение стабильно",
            "[TOR] Маршрутизация через луковые узлы (Германия -> Сингапур -> Исландия)...",
            "[SYSTEM] Очистка кэша DNS. Смена MAC-адреса завершена.",
            "[SUCCESS] Вход в теневую сеть HackNet разрешен."
        ];

        let index = 0;
        function printLog() {
            if (index < logs.length) {
                connectionLog.innerText += logs[index] + "\n";
                index++;
                setTimeout(printLog, 400);
            } else {
                setTimeout(() => {
                    hacknetLoader.classList.add("hidden");
                    hacknetContent.style.display = "flex";
                    updateUI();
                }, 500);
            }
        }
        printLog();
    }
    // ФУНКЦИИ МЕССЕНДЖЕРА ANONGRAM
    function sendBotMessage(text) {
        const msg = document.createElement("div");
        msg.className = "msg bot-msg";
        msg.innerText = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendPlayerMessage(text) {
        const msg = document.createElement("div");
        msg.className = "msg player-msg";
        msg.innerText = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ГЕНЕРАЦИЯ НОВОГО ХАКЕРСКОГО КОНТРАКТА
    function generateNewContract() {
        const types = ["написание майнера", "создание трояна", "доксинг чиновника", "взлом базы данных"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // Стартовая базовая цена зависит от уровня хакера
        let basePrice = Math.floor(Math.random() * 40 + 20) * hackerLevel;
        
        currentContract = {
            type: randomType,
            price: basePrice,
            basePrice: basePrice,
            haggleCount: 0 // Сколько раз игрок уже торговался по этому заказу
        };

        sendBotMessage("Доступен новый контракт: [" + currentContract.type + "]. Предлагаемый гонорар: " + currentContract.price + " BTC. Твои действия?");
        renderChatActions();
    }

    // ВЫВОД КНОПОК ДЕЙСТВИЯ В ЧАТ
    function renderChatActions() {
        chatActions.innerHTML = "";
        
        if (!currentContract) return;

        // Кнопка: Принять
        const acceptBtn = document.createElement("button");
        acceptBtn.className = "nav-btn";
        acceptBtn.innerText = "ПРИНЯТЬ ЗАДАНИЕ";
        acceptBtn.onclick = function() {
            sendPlayerMessage("Я берусь за этот контракт.");
            sendBotMessage("Отлично. Переходи во вкладку 'Вирусология' на рабочем столе, чтобы начать сборку софта под этот заказ.");
            chatActions.innerHTML = "";
            // Логику самого кодинга свяжем на следующем этапе
        };

        // Кнопка: Торговаться (Повысить цену)
        const haggleBtn = document.createElement("button");
        haggleBtn.className = "nav-btn";
        haggleBtn.style.borderColor = "#00f0ff";
        haggleBtn.style.color = "#00f0ff";
        haggleBtn.innerText = "МНЕ МАЛО (ТОРГОВАТЬСЯ)";
        haggleBtn.onclick = function() {
            processHaggle();
        };

        // Кнопка: Отказаться
        const refuseBtn = document.createElement("button");
        refuseBtn.className = "nav-btn cancel-btn";
        refuseBtn.innerText = "ОТКЛОНИТЬ";
        refuseBtn.onclick = function() {
            sendPlayerMessage("Я пасс, поищи кого-то другого.");
            currentContract = null;
            setTimeout(generateNewContract, 3000);
        };

        chatActions.appendChild(acceptBtn);
        chatActions.appendChild(haggleBtn);
        chatActions.appendChild(refuseBtn);
    }

    // ЛОГИКА ТОРГОВЛИ ЗА ЦЕНУ С ПОКУПАТЕЛЕМ
    function processHaggle() {
        if (!currentContract) return;
        
        currentContract.haggleCount++;
        sendPlayerMessage("Платят гроши. Я требую прибавки к гонорару за риски.");

        // Шанс отказа растет с каждым разом (1 раз — 30% отказа, 2 раз — 60%, 3 раз — 90%)
        let failChance = currentContract.haggleCount * 0.3;
        
        if (Math.random() < failChance) {
            // Покупатель психанул и отменил сделку
            sendBotMessage("Покупатель: 'Ты слишком много о себе возомнил. Сделка отменяется.'");
            currentContract = null;
            chatActions.innerHTML = "";
            setTimeout(generateNewContract, 4000);
        } else {
            // Успешный торг: цена растет на 25-40%
            let bumpPercent = Math.random() * 0.15 + 0.25;
            let priceBump = Math.floor(currentContract.price * bumpPercent);
            currentContract.price += priceBump;
            
            sendBotMessage("Покупатель колеблется, но соглашается: 'Черт с тобой. Поднимаю до " + currentContract.price + " BTC. Больше не проси.'");
            renderChatActions();
        }
    }
    // ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В БРАУЗЕРЕ HACKNET
    window.switchTab = function (tabId) {
        const allTabs = document.querySelectorAll('.tab-content');
        const allTabButtons = document.querySelectorAll('.tab-btn');
        
        allTabs.forEach(tab => tab.classList.remove('active'));
        allTabButtons.forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        
        // Подсвечиваем активную кнопку вкладки
        const activeBtn = Array.from(allTabButtons).find(btn => btn.getAttribute('onclick').includes(tabId));
        if (activeBtn) activeBtn.classList.add('active');
    };

    // ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ДАННЫХ (UI)
    function updateUI() {
        walletDisplay.innerText = balance + " BTC";
        anonDisplay.innerText = anonymity + "%";
        anonBar.style.width = anonymity + "%";
        
        // Меняем цвет индикатора защиты в зависимости от уровня угрозы
        if (anonymity > 60) {
            anonBar.style.backgroundColor = "#39ff14";
        } else if (anonymity > 30) {
            anonBar.style.backgroundColor = "#ffaa00";
        } else {
            anonBar.style.backgroundColor = "#ff3333";
            anonBar.style.boxShadow = "0 0 10px #ff3333";
        }
    }

    // МАГАЗИН: ПОКУПКА ЗАЩИТЫ (VPN / PROXY)
    window.buyProtection = function (cost, amount) {
        if (balance >= cost) {
            balance -= cost;
            anonymity = Math.min(100, anonymity + amount);
            updateUI();
            alert("Пакет прокси обновлен. Анонимность восстановлена на +" + amount + "%!");
            generateForumPosts(); // Обновляем форум, спецслужбы теряют след
        } else {
            alert("Ошибка транзакции: Недостаточно BTC на вашем кошельке!");
        }
    };

    // МАГАЗИН: ПОКУПКА ЖЕЛЕЗА (РАЗГОН ПК)
    window.buyPCUpgrade = function (cost) {
        if (balance >= cost) {
            balance -= cost;
            pсQuality += 0.25;
            updateUI();
            alert("Процессор разогнан. Скорость компиляции вирусов увеличена!");
        } else {
            alert("Ошибка транзакции: Недостаточно BTC!");
        }
    };

    // СИМУЛЯЦИЯ ФОРУМА 5CHAN (Генерация живых постов под уровень игрока)
    function generateForumPosts() {
        forumThreads.innerHTML = "";
        
        const goodPosts = [
            "Анон: Anonymous просто гений, благодаря его майнеру я слил сетку конкурентов!",
            "Скрипт-Кидди: Кто знает контакты Anonymous? Хочу заказать взлом акка бывшей.",
            "Кибер-Панк: Слышал, репутация Чела под ником Anonymous растет в геометрической прогрессии. Уважаю."
        ];
        
        const badPosts = [
            "Шпион: Полиция уже создала спецотдел по поиску Anonymous. Ему хана.",
            "ФБР_Тут: Мы фиксируем подозрительные пачки логов. Anonymous, мы близко.",
            "Анон99: Ребят, на кошелек Anonymous готовится атака, его защита трещит по швам."
        ];

        // Если защита низкая — на форуме паника и угрозы взлома
        if (anonymity < 50) {
            forumThreads.innerHTML += `<div class="post" style="border-color:#ff3333; color:#ff8888;"><strong>🚨 ВНИМАНИЕ:</strong> ${badPosts[Math.floor(Math.random() * badPosts.length)]}</div>`;
        } else {
            forumThreads.innerHTML += `<div class="post"><strong>🔗 ТРЕД:</strong> ${goodPosts[Math.floor(Math.random() * goodPosts.length)]}</div>`;
        }
        
        forumThreads.innerHTML += `<div class="post"><strong>Анон:</strong> Хакеры — герои нашего времени. Свободу информации!</div>`;
    }

    // ЛОГИКА СЛЕДСТВИЯ И ДЕАНOНИМИЗАЦИИ (Каждые 5 игровых секунд)
    function passiveThreatLogic() {
        if (!modal.classList.contains("hidden") || !tutorialModal.classList.contains("hidden")) return;

        // Чем выше ваш уровень хакера, тем быстрее за вами следят и снижают защиту
        let reduction = Math.floor(Math.random() * 3 + 1) * hackerLevel;
        anonymity = Math.max(0, anonymity - reduction);
        
        // Регулярно обновляем форум
        if (Math.random() < 0.4) {
            generateForumPosts();
        }

        // Если защита на нуле — ХАКЕР ВЗЛОМАН. КОНЕЦ ИГРЫ
        if (anonymity <= 0) {
            triggerGameOver();
        }

        updateUI();
    }

    // СЦЕНАРИЙ: КОНЕЦ ИГРЫ (GAME OVER)
    function triggerGameOver() {
        clearInterval(clockInterval); // Останавливаем часы
        desktop.innerHTML = `
            <div class="modal-overlay" style="background:#000;">
                <div class="modal-box" style="border-color:#ff3333; box-shadow: 0 0 40px #ff3333; max-width:600px;">
                    <h1 style="color:#ff3333; font-size:32px; letter-spacing:3px; margin-top:0;">🛑 СИСТЕМА ВЗЛОМАНА</h1>
                    <p style="color:#ff8888; font-size:14px; line-height:1.7; text-align:left; background:#1a0505; padding:15px; border:1px solid #551111;">
                        [КРИТИЧЕСКАЯ ОШИБКА]: Ваша прокси-сеть была деанонимизирована. Спецслужбы совместно с конкурирующей хакерской группировкой вычислили ваш физический IP-адрес. Ваши криптокошельки опустошены, а на личный аккаунт Anongram пришел ордер на арест.<br><br>
                        <strong>Вы проиграли. Ваша хакерская империя пала.</strong>
                    </p>
                    <button class="nav-btn" style="margin-top:20px; border-color:#fff; color:#fff;" onclick="location.reload()">ПЕРЕЗАГРУЗИТЬ СИСТЕМУ</button>
                </div>
            </div>
        `;
    }

    // Первичный запуск UI
    updateUI();
});
