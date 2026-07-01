document.addEventListener("DOMContentLoaded", function () {
    // ИГРОВЫЕ ПЕРЕМЕННЫЕ (STATE)
    let balance = 0;
    let localHackerLevel = 1; 
    let stealth = 100;       
    let fatigue = 0;         
    let reputation = 100;    
    let pcUpgradeLevel = 0;  

    let gameHour = 9;
    let gameMinute = 0;
    let clockInterval = null;
    let isSleeping = false;

    let currentContract = null;
    let selectedVirusId = 0; 
    let canPostToday = true; 
    let aggressionPoints = 0;
    let compileProgress = 0;
    let contractTimer = 0;   

    // ПЕРЕМЕННЫЕ ИНТЕРАКТИВНОГО ТУТОРИАЛА
    let isTutorialActive = false;
    let tutorialStep = 0; // 0 - Старт, 1 - Клик по анонграм, 2 - Выбор кнопок, 3 - Кодинг, 4 - Сдача файла, 5 - Хакнет

    // DOM ЭЛЕМЕНТЫ
    const agreementModal = document.getElementById("agreement-modal");
    const tutorialModal = document.getElementById("tutorial-modal");
    const agreementCheckbox = document.getElementById("agreement-checkbox");
    const agreementBtn = document.getElementById("agreement-btn");
    const desktop = document.getElementById("desktop");
    const gameClock = document.getElementById("game-clock");
    const sleepScreen = document.getElementById("sleep-screen");
    const guideBox = document.getElementById("tutorial-guide-box");
    const guideText = document.getElementById("guide-text-msg");
    
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
    const sleepDisplay = document.getElementById("sleep-display");
    const sleepBar = document.getElementById("sleep-bar");
    const reputationDisplay = document.getElementById("reputation-display");
    
    const compilerLog = document.getElementById("compiler-log-box");
    const compileBar = document.getElementById("compile-bar");
    const keyboardHint = document.getElementById("keyboard-hint");

    agreementCheckbox.addEventListener("change", function () {
        agreementBtn.disabled = !this.checked;
    });

    agreementBtn.addEventListener("click", function () {
        if (agreementCheckbox.checked) {
            agreementModal.classList.add("hidden");
            tutorialModal.classList.remove("hidden");
        }
    });

    // ЗАКРЫТИЕ ТУТОРИАЛА (ВЫБОР ДА / НЕТ)
    window.closeTutorial = function (startTutorial) {
        tutorialModal.classList.add("hidden");
        desktop.classList.remove("blurred");
        
        if (startTutorial) {
            isTutorialActive = true;
            tutorialStep = 1;
            guideBox.classList.remove("hidden");
            guideText.innerText = "ИНСТРУКЦИЯ: Нажмите на приложение Anongram. Другие ярлыки заблокированы.";
            sendBotMessage("Система: Запущен интерактивный режим обучения.");
        } else {
            sendBotMessage("BlackWork Bot: Работаешь соло? Первые контракты уже в чате.");
            generateNewContract();
        }
        
        clockInterval = setInterval(updateGameClock, 1000); 
        setInterval(passiveThreatLogic, 60000); // Скрытность падает раз в 2 часа (раз в 60 реальных сек)
    };

    function updateGameClock() {
        if (isSleeping) return; 
        gameMinute += 1;
        
        if (currentContract && currentContract.status === "pending") {
            contractTimer += 1;
            if (contractTimer > 20) { 
                reputation = Math.max(0, reputation - 2);
                updateUI();
            }
        }

        if (gameMinute >= 60) { 
            gameMinute = 0; 
            gameHour += 1; 
            fatigue = Math.min(100, fatigue + 4);
            if (fatigue >= 100) { triggerFaint(); }

            if (gameHour >= 24) { 
                gameHour = 0; 
                canPostToday = true;
                postingZone.classList.remove("hidden");
            }
        }
        gameClock.innerText = String(gameHour).padStart(2, '0') + ":" + String(gameMinute).padStart(2, '0');
        updateUI();
    }

    window.toggleSleep = function() {
        if (isTutorialActive) return alert("Гид: Нельзя лечь спать во время прохождения туториала!");
        if (currentContract && currentContract.status === "active") return alert("Нельзя лечь спать во время компиляции вируса!");
        isSleeping = true;
        sleepScreen.classList.remove("hidden");
        
        setTimeout(function() {
            fatigue = 0; 
            gameHour = (gameHour + 8) % 24; 
            isSleeping = false;
            sleepScreen.classList.add("hidden");
            sendBotMessage("BlackWork Bot: Проснулся? Твоя репутация обновилась. Жду новые вирусы.");
            if (!currentContract) generateNewContract();
            updateUI();
        }, 3000); 
    };

    function triggerFaint() {
        alert("Вы упали в обморок от дикой усталости! Минус 30% BTC за срочное лечение.");
        balance = Math.floor(balance * 0.7); 
        fatigue = 30;
        gameHour = (gameHour + 10) % 24; 
        updateUI();
    }
    // УПРАВЛЕНИЕ ОКНАМИ И БЛОКИРОВКА ЯРЛЫКОВ В ТУТОРИАЛЕ
    window.openApp = function (appName) {
        // Если туториал активен, жестко ограничиваем действия игрока по шагам
        if (isTutorialActive) {
            if (tutorialStep === 1 && appName !== "anongram") {
                alert("Гид: Сначала открой Anongram, как указано в инструкции!");
                return;
            }
            if (tutorialStep === 3 && appName !== "compiler") {
                alert("Гид: Сейчас нужно открыть NetBreaker, чтобы написать вирус!");
                return;
            }
            if (tutorialStep === 5 && appName !== "hacknet") {
                alert("Гид: Открой HackNet, чтобы изучить скрытые вкладки сети!");
                return;
            }
        }

        const appWindow = document.getElementById("app-" + appName);
        if (!appWindow) return;
        appWindow.classList.remove("hidden");

        if (appName === "anongram" && isTutorialActive && tutorialStep === 1) {
            tutorialStep = 2;
            guideText.innerText = "ИНСТРУКЦИЯ: Изучи чат с ботом BlackWork. Прими заказ или попробуй торговаться кнопкой 'Торг'.";
            generateNewContract();
        }

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
        // Умная проверка: запрещаем закрывать окна, ТОЛЬКО если это ломает текущий шаг гида
        if (isTutorialActive) {
            if (tutorialStep === 3 && appName === "compiler") {
                alert("Гид: Сначала допиши вирус до 100%, прежде чем закрывать NetBreaker!");
                return;
            }
        }
        const appWindow = document.getElementById("app-" + appName);
        if (appWindow) appWindow.classList.add("hidden");
    };


    function runProxyLoader() {
        connectionLog.innerText = "";
        const logs = [
            "[SYSTEM] Запуск прокси-туннеля...",
            "[PROXY] Сервер: Мальдивы... Подключено",
            "[VPN] Защита AES-256... Стабильно",
            "[TOR] Маршрутизация пакетов TOR... Ок",
            "[SUCCESS] Шлюз безопасен. Вход разрешен."
        ];
        let index = 0;
        function printLog() {
            if (index < logs.length) {
                connectionLog.innerText += logs[index] + "\n";
                index++;
                setTimeout(printLog, 200);
            } else {
                setTimeout(function() {
                    hacknetLoader.classList.add("hidden");
                    hacknetContent.style.display = "flex";
                    if (isTutorialActive && tutorialStep === 5) {
                        tutorialStep = 6;
                        guideText.innerText = "ИНСТРУКЦИЯ: Переключай вкладки 5chan, Shop и Wallet. Узнай свой баланс и защиту.";
                        setTimeout(finishTutorial, 6000); // Через 6 сек завершаем обучение
                    }
                    updateUI();
                }, 300);
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
        if (isSleeping) return;
        const types = ["написание майнера", "создание трояна", "доксинг чиновника", "взлом базы данных"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        let repModifier = reputation / 100;
        let basePrice = Math.floor((Math.random() * 11 + 9) * repModifier); // 9-19 BTC
        if (basePrice < 5) basePrice = 5;

        currentContract = {
            type: randomType,
            price: basePrice,
            basePrice: basePrice,
            haggleCount: 0,
            status: "pending" 
        };

        contractTimer = 0; 
        sendBotMessage("BlackWork Bot: Новый контракт: [" + currentContract.type + "]. Стартовый гонорар: " + currentContract.price + " BTC. Берешь в работу?");
        renderChatActions();
    }

    function renderChatActions() {
        chatActions.innerHTML = "";
        if (!currentContract) return;

        if (currentContract.status === "pending") {
            const acceptBtn = document.createElement("button");
            acceptBtn.className = "nav-btn";
            acceptBtn.innerText = "ПРИНЯТЬ ЗАДАНИЕ";
            acceptBtn.onclick = function() {
                sendPlayerMessage("Я берусь за этот заказ.");
                currentContract.status = "active";
                sendBotMessage("BlackWork Bot: Отлично. Переходи в приложение 'NetBreaker'. Кликай кнопки на клавиатуре, чтобы написать код ядра.");
                if (isTutorialActive && tutorialStep === 2) {
                    tutorialStep = 3;
                    guideText.innerText = "ИНСТРУКЦИЯ: Открой приложение NetBreaker на рабочем столе для написания кода вируса.";
                }
                renderChatActions();
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
                if (isTutorialActive) return alert("Гид: В туториале нельзя отклонять контракт, нажми 'ПРИНЯТЬ ЗАДАНИЕ'!");
                sendPlayerMessage("Не интересно. Ищи другого.");
                currentContract = null;
                setTimeout(generateNewContract, 4000);
            };

            chatActions.appendChild(acceptBtn);
            chatActions.appendChild(haggleBtn);
            chatActions.appendChild(refuseBtn);
        } 
        else if (currentContract.status === "active") {
            const statusLabel = document.createElement("span");
            statusLabel.style.color = "#ffaa00";
            statusLabel.style.fontSize = "12px";
            statusLabel.innerText = "Выполняется... Код пишется в NetBreaker.";
            chatActions.appendChild(statusLabel);
        } 
        else if (currentContract.status === "compiled") {
            const sendFileBtn = document.createElement("button");
            sendFileBtn.className = "nav-btn";
            sendFileBtn.style.borderColor = "#39ff14";
            sendFileBtn.innerText = "📁 ОТПРАВИТЬ СКОМПИЛИРОВАННЫЙ ФАЙЛ";
            sendFileBtn.onclick = function() {
                sendPlayerMessage("Лови готовый файл. Скрипт зашифрован.");
                balance += currentContract.price;
                reputation = Math.min(200, reputation + 10); 
                sendBotMessage("BlackWork Bot: Файл получен, хэш проверен. Перевожу " + currentContract.price + " BTC на твой TOR-кошелек. Отличная работа!");
                currentContract = null;
                updateUI();
                chatActions.innerHTML = "";
                
                if (isTutorialActive && tutorialStep === 4) {
                    tutorialStep = 5;
                    guideText.innerText = "ИНСТРУКЦИЯ: Молодец! Деньги на базе. Теперь открой браузер HackNet, чтобы проверить даркнет-маркет.";
                } else {
                    setTimeout(generateNewContract, 4000);
                }
            };
            chatActions.appendChild(sendFileBtn);
        }
    }

    function processHaggle() {
        if (!currentContract) return;
        currentContract.haggleCount++;
        sendPlayerMessage("Риски выросли. Моя работа стоит дороже.");

        let failChance = currentContract.haggleCount * 0.35;
        if (isTutorialActive) failChance = 0; // В туториале торг всегда успешен!

        if (currentContract.price >= 30) {
            sendBotMessage("BlackWork Bot: Это мой абсолютный потолок. Больше 30 BTC я не дам.");
            return;
        }

        if (Math.random() < failChance) {
            sendBotMessage("BlackWork Bot: Ты зажрался. Я отменяю заказ.");
            reputation = Math.max(0, reputation - 5); 
            currentContract = null;
            chatActions.innerHTML = "";
            updateUI();
            setTimeout(generateNewContract, 5000);
        } else {
            let bump = Math.floor(currentContract.price * 0.25);
            currentContract.price = Math.min(30, currentContract.price + bump); 
            sendBotMessage("BlackWork Bot: Ладно, уговорил. Повышаю цену до " + currentContract.price + " BTC. По рукам?");
            renderChatActions();
        }
    }
    window.selectVirusType = function(typeId) {
        if (typeId > pcUpgradeLevel) return; 
        selectedVirusId = typeId;
        document.querySelectorAll('.virus-select-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById("virus-type-" + typeId).classList.add('active');

        if (currentContract && currentContract.status === "active") {
            compilerLog.innerText = "[NetBreaker] Ядро готово к кодингу.\n[НАЖИМАЙ ЛЮБЫЕ КЛАВИШИ НА КЛАВИАТУРЕ, ЧТОБЫ НАПИСАТЬ КОД!]\n";
            keyboardHint.classList.remove("hidden");
        } else {
            compilerLog.innerText = "[NetBreaker] Требуется активный контракт в Anongram для начала кодинга.\n";
            keyboardHint.classList.add("hidden");
        }
    };

    // КОДИНГ КЛАВИАТУРОЙ + ОБУЧЕНИЕ ШАГ ЗА ШАГОМ
    document.addEventListener("keydown", function (event) {
        const compilerWindow = document.getElementById("app-compiler");
        if (compilerWindow.classList.contains("hidden") || !currentContract || currentContract.status !== "active") return;
        if (event.repeat) return;

        let speed = 5 * (pcUpgradeLevel + 1);
        compileProgress = Math.min(100, compileProgress + speed);
        compileBar.style.width = compileProgress + "%";

        if (isTutorialActive && tutorialStep === 3) {
            guideText.innerText = "ИНСТРУКЦИЯ: Отлично, код пишется! Нажимай кнопки, пока шкала не дойдет до 100%.";
        }

        const codeLines = [
            "import os, sys, socket",
            "connect_to_gate('192.168.1.1')",
            "payload = generate_payload(aes_256)",
            "bypass_firewall(target_dns)",
            "inject_trojan_signature()",
            "clear_system_logs()"
        ];
        let randomLine = codeLines[Math.floor(Math.random() * codeLines.length)];
        compilerLog.innerText += "\nAnonymous@root:~# " + randomLine;
        compilerLog.scrollTop = compilerLog.scrollHeight;

        if (compileProgress >= 100) {
            compileProgress = 0;
            compileBar.style.width = "0%";
            keyboardHint.classList.add("hidden");
            
            currentContract.status = "compiled";
            stealth = Math.max(0, stealth - 12); 
            
            compilerLog.innerText = "[SUCCESS] Сборка файла завершена!\n\n[ВНИМАНИЕ]: Зайди в Anongram и отправь файл клиенту.";
            
            if (isTutorialActive && tutorialStep === 3) {
                tutorialStep = 4;
                guideText.innerText = "ИНСТРУКЦИЯ: Вирус готов! Теперь вернись в Anongram и нажми 'ОТПРАВИТЬ СКОМПИЛИРОВАННЫЙ ФАЙЛ'.";
            }

            renderChatActions();
            updateUI();
        }
    });

    // ЗАВЕРШЕНИЕ ОБУЧЕНИЯ ГИДОМ
    function finishTutorial() {
        if (!isTutorialActive) return;
        isTutorialActive = false;
        tutorialStep = 0;
        
        guideText.innerHTML = "<span style='color:#39ff14;'>ОБУЧЕНИЕ ЗАВЕРШЕНО!</span> Ниже показаны шкалы: Скрытность (падает каждые 2 часа), Усталость (растет от работы) и Репутация. Спи кнопкой 'ВЫКЛЮЧИТЬ ПК'. Удачи!";
        
        setTimeout(function() {
            guideBox.classList.add("hidden");
            // Закрываем все окна, чтобы игрок начал с чистого листа свободный режим
            document.querySelectorAll('.window').forEach(win => win.classList.add('hidden'));
            sendBotMessage("BlackWork Bot: Инструктаж окончен. Твоя анонимность теперь в твоих руках. Высылаю первый реальный контракт.");
            generateNewContract();
        }, 8000);
    }

    window.submitForumPost = function(optionId) {
        if (!canPostToday) return;
        canPostToday = false;
        postingZone.classList.add("hidden");

        if (optionId === 1) {
            aggressionPoints += 30;
            stealth = Math.max(0, stealth - 20);
            alert("Пост опубликован! Борда в ярости от вашей наглости, полиция начала проверку логов.");
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
        sleepDisplay.innerText = fatigue + "%";
        sleepBar.style.width = fatigue + "%";
        reputationDisplay.innerText = reputation + " XP";
        
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
            aggressionStatus.innerText = "НЕЙТРАЛЬНАЯ";
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
        if (!agreementModal.classList.contains("hidden") || !tutorialModal.classList.contains("hidden") || isSleeping) return;
        
        let reduction = Math.floor(Math.random() * 3 + 2); 
        stealth = Math.max(0, stealth - reduction);
        
        if (stealth < 50 && stealth >= 30) {
            if (Math.random() < 0.4) generateForumPosts(); 
        } else if (stealth < 30 && stealth > 0) {
            threatContact.classList.remove("hidden");
            if (Math.random() < 0.3) {
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
