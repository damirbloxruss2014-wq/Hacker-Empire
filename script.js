document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let hackerLevel = 1;
    let anonymity = 100;
    let pcQuality = 1.0;
    let gameHour = 9;
    let gameMinute = 0;
    let clockInterval = null;
    let currentContract = null;

    const agreementModal = document.getElementById("agreement-modal");
    const tutorialModal = document.getElementById("tutorial-modal");
    const agreementCheckbox = document.getElementById("agreement-checkbox");
    const agreementBtn = document.getElementById("agreement-btn");
    const desktop = document.getElementById("desktop");
    const gameClock = document.getElementById("game-clock");
    const chatMessages = document.getElementById("chat-messages-box");
    const chatActions = document.getElementById("chat-actions-zone");
    const hacknetLoader = document.getElementById("hacknet-loader");
    const connectionLog = document.getElementById("connection-log-box");
    const hacknetContent = document.getElementById("hacknet-content");
    const forumThreads = document.getElementById("forum-threads-box");
    const walletDisplay = document.getElementById("wallet-display");
    const anonDisplay = document.getElementById("anon-display");
    const anonBar = document.getElementById("anon-bar");

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
            sendBotMessage("Привет, Anon. Я BlackWork. Буду слать контракты. Качай репу и береги анонимность. Лови первый заказ.");
        } else {
            sendBotMessage("Работаешь соло? Уважаю. Первые контракты уже в чате.");
        }
        generateNewContract();
        clockInterval = setInterval(updateGameClock, 1000);
        setInterval(passiveThreatLogic, 4000);
    };

    function updateGameClock() {
        gameMinute += 1;
        if (gameMinute >= 60) { gameMinute = 0; gameHour += 1; }
        if (gameHour >= 24) { gameHour = 0; }
        gameClock.innerText = String(gameHour).padStart(2, '0') + ":" + String(gameMinute).padStart(2, '0');
    }

    window.openApp = function (appName) {
        const appWindow = document.getElementById("app-" + appName);
        if (!appWindow) return;
        appWindow.classList.remove("hidden");
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
            "[PROXY] Подключение к серверу: Мальдивы... Ок",
            "[VPN] Поднятие туннеля шифрования... Стабильно",
            "[TOR] Маршрутизация через луковые узлы... Ок",
            "[SUCCESS] Вход в сеть HackNet разрешен."
        ];
        let index = 0;
        function printLog() {
            if (index < logs.length) {
                connectionLog.innerText += logs[index] + "\n";
                index++;
                setTimeout(printLog, 300);
            } else {
                setTimeout(function() {
                    hacknetLoader.classList.add("hidden");
                    hacknetContent.style.display = "flex";
                    updateUI();
                }, 400);
            }
        }
        printLog();
    }
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
            sendBotMessage("Отлично. Переходи в приложение 'Вирусология' для сборки софта.");
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

    window.switchTab = function (tabId) {
        const allTabs = document.querySelectorAll('.tab-content');
        const allTabButtons = document.querySelectorAll('.tab-btn');
        allTabs.forEach(function(tab) { tab.classList.remove('active'); });
        allTabButtons.forEach(function(btn) { btn.classList.remove('active'); });
        document.getElementById(tabId).classList.add('active');
        const activeBtn = Array.from(allTabButtons).find(function(btn) { return btn.getAttribute('onclick').includes(tabId); });
        if (activeBtn) activeBtn.classList.add('active');
    };

    function updateUI() {
        walletDisplay.innerText = balance + " BTC";
        anonDisplay.innerText = anonymity + "%";
        anonBar.style.width = anonymity + "%";
        if (anonymity > 60) { anonBar.style.backgroundColor = "#39ff14"; }
        else if (anonymity > 30) { anonBar.style.backgroundColor = "#ffaa00"; }
        else { anonBar.style.backgroundColor = "#ff3333"; }
    }

    window.buyProtection = function (cost, amount) {
        if (balance >= cost) {
            balance -= cost;
            anonymity = Math.min(100, anonymity + amount);
            updateUI();
            alert("Прокси обновлены! Защита восстановлена.");
            generateForumPosts();
        } else { alert("Недостаточно BTC!"); }
    };

    window.buyPCUpgrade = function (cost) {
        if (balance >= cost) {
            balance -= cost;
            pcQuality += 0.25;
            updateUI();
            alert("Процессор разогнан! Скорость кодинга выросла.");
        } else { alert("Недостаточно BTC!"); }
    };

    function generateForumPosts() {
        forumThreads.innerHTML = "";
        const goods = ["Анон: Anonymous гений, его софт уложил сеть конкурентов!", "Юзер: Дайте контакты Anonymous, надо взломать базу.", "Анон: Респект челу Anonymous, его уровень растет."];
        const bads = ["Шпион: Киберполиция вышла на след Anonymous. Ему конец.", "ФБР: Фиксируем подозрительные логи. Мы близко.", "Анон: Кошелек Anonymous под угрозой, защита падает!"];
        if (anonymity < 50) {
            forumThreads.innerHTML += "<div class='post' style='border-color:#ff3333; color:#ff8888;'><strong>🚨 УГРОЗА:</strong> " + bads[Math.floor(Math.random() * bads.length)] + "</div>";
        } else {
            forumThreads.innerHTML += "<div class='post'><strong>🔗 ТРЕД:</strong> " + goods[Math.floor(Math.random() * goods.length)] + "</div>";
        }
        forumThreads.innerHTML += "<div class='post'><strong>Анон:</strong> Хакеры — герои нашего времени. Всем свободы!</div>";
    }

    function passiveThreatLogic() {
        if (!agreementModal.classList.contains("hidden") || !tutorialModal.classList.contains("hidden")) return;
        let reduction = Math.floor(Math.random() * 2 + 1) * hackerLevel;
        anonymity = Math.max(0, anonymity - reduction);
        if (Math.random() < 0.3) { generateForumPosts(); }
        if (anonymity <= 0) { triggerGameOver(); }
        updateUI();
    }

    function triggerGameOver() {
        clearInterval(clockInterval);
        desktop.innerHTML = "<div class='modal-overlay' style='background:#000;'><div class='modal-box' style='border-color:#ff3333; box-shadow:0 0 40px #ff3333;'><h1 style='color:#ff3333;'>🛑 СИСТЕМА ВЗЛОМАНА</h1><p style='color:#ff8888; text-align:left; background:#1a0505; padding:15px; border:1px solid #551111;'>[КРИТИЧЕСКАЯ ОШИБКА]: Ваша прокси-сеть была деанонимизирована. Спецслужбы вычислили ваш физический IP-адрес. Деньги украдены, хакерская империя пала.</p><button class='nav-btn' style='border-color:#fff; color:#fff;' onclick='location.reload()'>ПЕРЕЗАГРУЗКА</button></div></div>";
    }

    updateUI();
});
