document.addEventListener("DOMContentLoaded", function () {
    // ИГРОВЫЕ ПЕРЕМЕННЫЕ (STATE)
    let balance = 0;
    let hackerLevel = 1;
    let stealth = 100; // Шкала скрытности
    let pcUpgradeLevel = 0; // 0 - Скрипты, 1 - Трояны, 2 - Шпионы
    let aggressionPoints = 0; // Очки гнева борды

    let gameHour = 9;
    let gameMinute = 0;
    let clockInterval = null;
    let currentContract = null;
    let selectedVirusId = 0; 
    let canPostToday = true; 
    let isCompilingNow = false;

    // DOM ЭЛЕ МЕНТЫ
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
    const aggressionStatus = document.getElementById("aggression-status");
    const postingZone = document.getElementById("forum-posting-zone");

    const walletDisplay = document.getElementById("wallet-display");
    const stealthDisplay = document.getElementById("stealth-display");
    const stealthBar = document.getElementById("stealth-bar");
    
    const compilerLog = document.getElementById("compiler-log-box");
    const compileBar = document.getElementById("compile-bar");
    const compileStartBtn = document.getElementById("compile-start-btn");

    // ИНИЦИАЛИЗАЦИЯ И СОГЛАШЕНИЕ
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
            sendBotMessage("Привет, Anon. Я BlackWork. Буду слать контракты. Качай репу, создавай вирусы в NetBreaker и следи за Скрытностью! Лови первый заказ.");
        } else {
            sendBotMessage("Работаешь соло? Первые контракты уже в чате. Открывай NetBreaker и пиши софт.");
        }
        generateNewContract();
        clockInterval = setInterval(updateGameClock, 1000); // 1 сек = 1 мин игровая
        setInterval(passiveThreatLogic, 6000); // Проверка скрытности каждые 6 игровых часов
    };

    function updateGameClock() {
        gameMinute += 1;
        if (gameMinute >= 60) { 
            gameMinute = 0; 
            gameHour += 1; 
            if (gameHour >= 24) { 
                gameHour = 0; 
                canPostToday = true;
                postingZone.classList.remove("hidden");
            }
        }
        gameClock.innerText = String(gameHour).padStart(2, '0') + ":" + String(gameMinute).padStart(2, '0');
    }

    // ОТКРЫТИЕ ПРИЛОЖЕНИЙ И ЛОАДЕР VPN
    window.openApp = function (appName) {
        const appWindow = document.getElementById("app-" + appName);
        if (!appWindow) return;
        appWindow.classList.remove("hidden");
        if (appName === "hacknet") {
            hacknetContent.style.display = "none";
            hacknetLoader.classList.remove("hidden");
            runProxyLoader();
        }
        if (appName === "compiler") {
            selectVirusType(selectedVirusId);
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
            "[PROXY] Подключение к прокси-туннелю: Мальдивы... Ок",
            "[VPN] Шифрование трафика AES-256... Стабильно",
            "[TOR] Маршрутизация через луковые узлы... Ок",
            "[SUCCESS] Сессия безопасна. Вход в HackNet разрешен."
        ];
        let index = 0;
        function printLog() {
            if (index < logs.length) {
                connectionLog.innerText += logs[index] + "\n";
                index++;
                setTimeout(printLog, 250);
            } else {
                setTimeout(function() {
                    hacknetLoader.classList.add("hidden");
                    hacknetContent.style.display = "flex";
                    updateUI();
                }, 300);
            }
        }
        printLog();
    }

    // СЕЛЕКТОР ВИРУСОВ В NETBREAKER
    window.selectVirusType = function(typeId) {
        if (typeId > pcUpgradeLevel) return; // Защита от выбора заблокированного
        selectedVirusId = typeId;
        document.querySelectorAll('.virus-select-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById("virus-type-" + typeId).classList.add('active');

        if (typeId === 0) {
            compilerLog.innerText = "[NetBreaker] Архитектура: Простой Скрипт.\nСложность: Низкая\nОжидаемая прибыль: 6-12 BTC\nГотов к компиляции.";
        } else if (typeId === 1) {
            compilerLog.innerText = "[NetBreaker] Архитектура: Троянский конь.\nСложность: Средняя\nОжидаемая прибыль: 12-25 BTC\nГотов к компиляции.";
        } else if (typeId === 2) {
            compilerLog.innerText = "[NetBreaker] Архитектура: Шпионская сигнатура.\nСложность: Высокая\nОжидаемая прибыль: 30-60 BTC\nГотов к компиляции.";
        }
        if (!isCompilingNow) compileStartBtn.disabled = false;
    };
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

    function generateNewContract() {
        const types = ["написание майнера", "создание трояна", "доксинг чиновника", "взлом базы данных"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        let basePrice = Math.floor(Math.random() * 40 + 20) * hackerLevel;
        currentContract = { type: randomType, price: basePrice, haggleCount: 0 };
        sendBotMessage("Новый контракт: [" + currentContract.type + "]. Гонорар: " + currentContract.price + " BTC. Берешь?");
        renderChatActions();
    }

    function renderChatActions() {
        chatActions.innerHTML = "";
        if (!currentContract) return;

        const acceptBtn = document.createElement("button");
        acceptBtn.className = "nav-btn";
        acceptBtn.innerText = "ПРИНЯТЬ ЗАДАНИЕ";
        acceptBtn.onclick = function() {
            sendPlayerMessage("Я в деле.");
            sendBotMessage("Отлично. Переходи в приложение 'NetBreaker' на рабочем столе для сборки софта.");
            chatActions.innerHTML = "";
        };

        const haggleBtn = document.createElement("button");
        haggleBtn.className = "nav-btn";
        haggleBtn.style.color = "#00f0ff";
        haggleBtn.style.borderColor = "#00f0ff";
        haggleBtn.innerText = "МНЕ МАЛО (ТОРГ)";
        haggleBtn.onclick = function() { processHaggle(); };

        const refuseBtn = document.createElement("button");
        refuseBtn.className = "nav-btn cancel-btn";
        refuseBtn.innerText = "ОТКЛОНИТЬ";
        refuseBtn.onclick = function() {
            sendPlayerMessage("Не интересно. Отказ.");
            currentContract = null;
            setTimeout(generateNewContract, 3000);
        };

        chatActions.appendChild(acceptBtn);
        chatActions.appendChild(haggleBtn);
        chatActions.appendChild(refuseBtn);
    }

    function processHaggle() {
        if (!currentContract) return;
        currentContract.haggleCount++;
        sendPlayerMessage("Риски высоки. Требую поднять цену.");
        let failChance = currentContract.haggleCount * 0.35;
        if (Math.random() < failChance) {
            sendBotMessage("Покупатель: 'Ты зажрался. Я отменяю заказ.'");
            currentContract = null;
            chatActions.innerHTML = "";
            setTimeout(generateNewContract, 4000);
        } else {
            let bump = Math.floor(currentContract.price * (Math.random() * 0.15 + 0.25));
            currentContract.price += bump;
            sendBotMessage("Покупатель: 'Ладно, уговорил. Поднимаю до " + currentContract.price + " BTC. По рукам?'");
            renderChatActions();
        }
    }
    window.startCompiling = function() {
        if (isCompilingNow) return;
        isCompilingNow = true;
        compileStartBtn.disabled = true;
        
        let progress = 0;
        compilerLog.innerText = "[SYSTEM] Запуск компиляции ядра...\n";
        
        let interval = setInterval(function() {
            progress += 5 * (pcUpgradeLevel + 1); 
            compileBar.style.width = Math.min(100, progress) + "%";
            compilerLog.innerText += "Загрузка сигнатур... " + Math.min(100, progress) + "%\n";
            compilerLog.scrollTop = compilerLog.scrollHeight;

            if (progress >= 100) {
                clearInterval(interval);
                isCompilingNow = false;
                compileBar.style.width = "0%";
                
                let payout = 0;
                if (selectedVirusId === 0) payout = Math.floor(Math.random() * 7 + 6); 
                else if (selectedVirusId === 1) payout = Math.floor(Math.random() * 14 + 12); 
                else if (selectedVirusId === 2) payout = Math.floor(Math.random() * 31 + 30); 
                
                balance += payout;
                stealth = Math.max(0, stealth - 15); 
                
                compilerLog.innerText = "[SUCCESS] Вирус скомпилирован успешно!\nПолучено: " + payout + " BTC.";
                updateUI();
                
                setTimeout(generateNewContract, 3000);
            }
        }, 200);
    };
    window.submitForumPost = function(optionId) {
        if (!canPostToday) return;
        canPostToday = false;
        postingZone.classList.add("hidden");

        if (optionId === 1) {
            aggressionPoints += 30;
            stealth = Math.max(0, stealth - 20);
            alert("Пост опубликован! Борда в ярости от вашей наглости, копы начали проверку логов.");
        } else if (optionId === 2) {
            aggressionPoints += 15;
            stealth = Math.max(0, stealth - 10);
            alert("Пост опубликован! Вы спровоцировали приток хейтеров.");
        } else if (optionId === 3) {
            aggressionPoints = Math.max(0, aggressionPoints - 15);
            alert("Пост опубликован! Аноны поддерживают вашу идеологию робингуда.");
        }
        generateForumPosts();
        updateUI();
    };

    window.switchTab = function (tabId) {
        const allTabs = document.querySelectorAll('.tab-content');
        const allTabButtons = document.querySelectorAll('.tab-btn');
        allTabs.forEach(function(tab) { tab.classList.remove('active'); });
        allTabButtons.forEach(function(btn) { btn.classList.remove('active'); });
        document.getElementById(tabId).classList.add('active');
    };

    function updateUI() {
        walletDisplay.innerText = balance + " BTC";
        stealthDisplay.innerText = stealth + "%";
        stealthBar.style.width = stealth + "%";
        
        if (stealth > 60) { stealthBar.style.backgroundColor = "#39ff14"; }
        else if (stealth > 30) { stealthBar.style.backgroundColor = "#ffaa00"; }
        else { stealthBar.style.backgroundColor = "#ff3333"; }

        if (aggressionPoints > 50) {
            aggressionStatus.innerText = "КРИТИЧЕСКАЯ УГРОЗА";
            aggressionStatus.style.color = "#ff3333";
        } else if (aggressionPoints > 20) {
            aggressionStatus.innerText = "РАЗДРАЖЕННЫЙ";
            aggressionStatus.style.color = "#ffaa00";
        } else {
            aggressionStatus.innerText = "НЕЙТРАЛЬНЫЙ";
            aggressionStatus.style.color = "#00f0ff";
        }
    }

    window.buyProtection = function (cost, amount) {
        if (balance >= cost) {
            balance -= cost;
            stealth = Math.min(100, stealth + amount);
            updateUI();
            alert("Защита обновлена! Скрытность в сети восстановлена.");
            generateForumPosts();
        } else { alert("Недостаточно BTC!"); }
    };

    window.buyPCUpgrade = function (cost, typeId) {
        if (balance >= cost) {
            balance -= cost;
            pcUpgradeLevel = typeId;
            document.getElementById("pc-item-" + typeId).disabled = true;
            document.getElementById("pc-item-" + typeId).innerText = "КУПЛЕНО";
            
            const lockedBtn = document.getElementById("virus-type-" + typeId);
            lockedBtn.classList.remove("locked");
            lockedBtn.disabled = false;
            
            updateUI();
            alert("Компоненты ПК обновлены! Разблокированы новые типы архитектур в NetBreaker.");
        } else { alert("Недостаточно BTC!"); }
    };

    function generateForumPosts() {
        forumThreads.innerHTML = "";
        const goods = ["Анон: Anonymous взламывает только зажравшихся буржуев! Респект.", "User: Кто-то видел его новые эксплоиты? Это шедевр.", "Anon: Наша борда за свободный интернет!"];
        const bads = ["Шпион: Киберполиция запустила трекеры по поиску Anonymous. Ему конец.", "ФБР: Мы сканируем узлы TOR. Аноним, твоя скрытность падает.", "Хейтер: Ловите деанон Anonymous! Его прокси трещат по швам!"];
        
        if (stealth < 50) {
            forumThreads.innerHTML += "<div class='post' style='border-color:#ff3333; color:#ff8888;'><strong>🚨 УГРОЗА ФОРУМА:</strong> " + bads[Math.floor(Math.random() * bads.length)] + "</div>";
        } else {
            forumThreads.innerHTML += "<div class='post'><strong>🔗 ТРЕД:</strong> " + goods[Math.floor(Math.random() * goods.length)] + "</div>";
        }
    }

    function passiveThreatLogic() {
        if (!agreementModal.classList.contains("hidden") || !tutorialModal.classList.contains("hidden")) return;
        
        let reduction = Math.floor(Math.random() * 3 + 2); 
        stealth = Math.max(0, stealth - reduction);
        
        if (stealth < 50 && stealth >= 30) {
            if (Math.random() < 0.3) generateForumPosts(); 
        } else if (stealth < 30 && stealth > 0) {
            threatContact.classList.remove("hidden");
            if (Math.random() < 0.2) {
                const threatMsg = document.createElement("div");
                threatMsg.className = "msg threat-msg";
                threatMsg.innerText = "ENEMY_HACKER: Мы знаем твои прокси, Anon. Твой банк будет взломан через пару часов. Обнови защиту, или тебе конец.";
                chatMessages.appendChild(threatMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        } else if (stealth <= 0) {
            triggerGameOver(); 
        }
        updateUI();
    }

    function triggerGameOver() {
        clearInterval(clockInterval);
        desktop.innerHTML = "<div class='modal-overlay' style='background:#000; z-index:99999;'><div class='modal-box' style='border-color:#ff3333; box-shadow:0 0 40px #ff3333;'><h1 style='color:#ff3333;'>🛑 ОБЛАВА ПОЛИЦИИ</h1><p style='color:#ff8888; text-align:left; background:#1a0505; padding:15px; border:1px solid #551111;'>[ОШИБКА ДЕАНOНИМИЗАЦИИ]: Ваша скрытность упала до 0%. Конкуренты взломали ваш криптокошелек, а спецслужбы отследили физический адрес шлюза.<br><br><strong>Штурмовой отряд киберполиции взломал вашу дверь. Вы арестованы. Ваша империя уничтожена.</strong></p><button class='nav-btn' style='border-color:#fff; color:#fff;' onclick='location.reload()'>НАЧАТЬ СНАЧАЛА</button></div></div>";
    }

    updateUI();
});
