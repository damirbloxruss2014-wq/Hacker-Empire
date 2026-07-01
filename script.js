document.addEventListener("DOMContentLoaded", function () {
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

    let isTutorialActive = false;
    let tutorialStep = 0; 

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
        setInterval(passiveThreatLogic, 1000); 
    };

    function updateGameClock() {
        if (isSleeping) return; 
        gameMinute += 1;
        if (currentContract && currentContract.status === "pending") {
            contractTimer += 1;
            if (contractTimer > 20) { reputation = Math.max(0, reputation - 2); updateUI(); }
        }
        if (gameMinute >= 60) { 
            gameMinute = 0; gameHour += 1; 
            fatigue = Math.min(100, fatigue + 4);
            if (fatigue >= 100) { triggerFaint(); }
            if (gameHour >= 24) { gameHour = 0; canPostToday = true; postingZone.classList.remove("hidden"); }
        }
        gameClock.innerText = String(gameHour).padStart(2, '0') + ":" + String(gameMinute).padStart(2, '0');
        updateUI();
    }

    window.toggleSleep = function() {
        if (isTutorialActive) return alert("Гид: Нельзя лечь спать во время туториала!");
        if (currentContract && currentContract.status === "active") return alert("Нельзя лечь спать во время сборки вируса!");
        isSleeping = true;
        sleepScreen.classList.remove("hidden");
        setTimeout(function() {
            fatigue = 0; gameHour = (gameHour + 8) % 24; isSleeping = false; sleepScreen.classList.add("hidden");
            sendBotMessage("BlackWork Bot: Проснулся? Твоя репутация обновилась. Жду новые вирусы.");
            if (!currentContract) generateNewContract();
            updateUI();
        }, 3000); 
    };

    function triggerFaint() {
        alert("Вы упали в обморок от усталости! Минус 30% BTC за лечение.");
        balance = Math.floor(balance * 0.7); fatigue = 30; gameHour = (gameHour + 10) % 24; updateUI();
    }

    window.openApp = function (appName) {
        if (isTutorialActive) {
            if (tutorialStep === 1 && appName !== "anongram") return alert("Гид: Сначала открой Anongram!");
            if (tutorialStep === 3 && appName !== "compiler") return alert("Гид: Сейчас нужно открыть NetBreaker!");
            if (tutorialStep === 5 && appName !== "hacknet") return alert("Гид: Открой HackNet!");
        }
        const appWindow = document.getElementById("app-" + appName);
        if (!appWindow) return;
        appWindow.classList.remove("hidden");
        if (appName === "anongram" && isTutorialActive && tutorialStep === 1) {
            tutorialStep = 2;
            guideText.innerText = "ИНСТРУКЦИЯ: Прими заказ или поторгуйся кнопкой 'Торг'.";
            generateNewContract();
        }
        if (appName === "hacknet") { hacknetContent.style.display = "none"; hacknetLoader.classList.remove("hidden"); runProxyLoader(); }
        if (appName === "compiler") { selectVirusType(selectedVirusId); }
    };

    window.closeApp = function (appName) {
        if (isTutorialActive && tutorialStep === 3 && appName === "compiler") {
            alert("Гид: Сначала допиши вирус до 100%!"); return;
        }
        const appWindow = document.getElementById("app-" + appName);
        if (appWindow) appWindow.classList.add("hidden");
    };

    function runProxyLoader() {
        connectionLog.innerText = "";
        const logs = ["[SYSTEM] Запуск прокси...", "[PROXY] Сервер: Мальдивы... Ок", "[VPN] Защита AES-256... Стабильно", "[TOR] Маршрутизация TOR... Ок", "[SUCCESS] Вход разрешен."];
        let index = 0;
        function printLog() {
            if (index < logs.length) { connectionLog.innerText += logs[index] + "\n"; index++; setTimeout(printLog, 150); }
            else {
                setTimeout(function() {
                    hacknetLoader.classList.add("hidden"); hacknetContent.style.display = "flex";
                    if (isTutorialActive && tutorialStep === 5) {
                        tutorialStep = 6; guideText.innerText = "ИНСТРУКЦИЯ: Изучи вкладки 5chan, Shop и Wallet. Узнай свой баланс.";
                        setTimeout(finishTutorial, 6000); 
                    }
                    updateUI();
                }, 200);
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
        let basePrice = Math.floor((Math.random() * 11 + 9) * repModifier); 
        if (basePrice < 5) basePrice = 5;

        currentContract = { type: randomType, price: basePrice, basePrice: basePrice, haggleCount: 0, status: "pending" };
        contractTimer = 0; 
        sendBotMessage("BlackWork Bot: Новый контракт: [" + currentContract.type + "]. Стартовый гонорар: " + currentContract.price + " BTC. Берешь?");
        renderChatActions();
    }

    function renderChatActions() {
        chatActions.innerHTML = "";
        if (!currentContract) return;

        if (currentContract.status === "pending") {
            const acceptBtn = document.createElement("button");
            acceptBtn.className = "nav-btn"; acceptBtn.innerText = "ПРИНЯТЬ ЗАДАНИЕ";
            acceptBtn.onclick = function() {
                sendPlayerMessage("Я берусь за этот заказ.");
                currentContract.status = "active";
                sendBotMessage("BlackWork Bot: Отлично. Переходи в NetBreaker и кликай кнопки для кодинга.");
                if (isTutorialActive && tutorialStep === 2) {
                    tutorialStep = 3; guideText.innerText = "ИНСТРУКЦИЯ: Открой NetBreaker на рабочем столе для написания кода.";
                }
                renderChatActions();
            };

            const haggleBtn = document.createElement("button");
            haggleBtn.className = "nav-btn"; haggleBtn.style.color = "#00f0ff"; haggleBtn.style.borderColor = "#00f0ff";
            haggleBtn.innerText = "МНЕ МАЛО (ТОРГ)"; haggleBtn.onclick = function() { processHaggle(); };

            const refuseBtn = document.createElement("button");
            refuseBtn.className = "nav-btn cancel-btn"; refuseBtn.innerText = "ОТКЛОНИТЬ";
            refuseBtn.onclick = function() {
                if (isTutorialActive) return alert("Гид: В туториале нельзя отклонять контракт!");
                sendPlayerMessage("Не интересно. Ищи другого.");
                currentContract = null; chatActions.innerHTML = "";
                setTimeout(generateNewContract, 4000);
            };
            chatActions.appendChild(acceptBtn); chatActions.appendChild(haggleBtn); chatActions.appendChild(refuseBtn);
        } 
        else if (currentContract.status === "active") {
            chatActions.innerHTML = "<span style='color:#ffaa00; font-size:12px;'>Выполняется... Код пишется в NetBreaker.</span>";
        } 
        else if (currentContract.status === "compiled") {
            const sendFileBtn = document.createElement("button");
            sendFileBtn.className = "nav-btn"; sendFileBtn.style.borderColor = "#39ff14";
            sendFileBtn.innerText = "📁 ОТПРАВИТЬ СКОМПИЛИРОВАННЫЙ ФАЙЛ";
            sendFileBtn.onclick = function() {
                sendPlayerMessage("Лови готовый файл.");
                balance += currentContract.price; reputation = Math.min(200, reputation + 10); 
                sendBotMessage("BlackWork Bot: Файл получен. Перевожу " + currentContract.price + " BTC на твой TOR-кошелек.");
                currentContract = null; updateUI(); chatActions.innerHTML = "";
                if (isTutorialActive && tutorialStep === 4) {
                    tutorialStep = 5; guideText.innerText = "ИНСТРУКЦИЯ: Деньги на базе! Теперь открой браузер HackNet, чтобы проверить маркет.";
                } else { setTimeout(generateNewContract, 4000); }
            };
            chatActions.appendChild(sendFileBtn);
        }
    }

    function processHaggle() {
        if (!currentContract) return;
        currentContract.haggleCount++;
        sendPlayerMessage("Риски выросли. Моя работа стоит дороже.");
        let failChance = isTutorialActive ? 0 : currentContract.haggleCount * 0.35;
        if (currentContract.price >= 30) {
            sendBotMessage("BlackWork Bot: Это мой абсолютный потолок (30 BTC)."); return;
        }
        if (Math.random() < failChance) {
            sendBotMessage("BlackWork Bot: Ты зажрался. Сделка отменена.");
            reputation = Math.max(0, reputation - 5); currentContract = null; chatActions.innerHTML = ""; updateUI();
            setTimeout(generateNewContract, 5000);
        } else {
            let bump = Math.floor(currentContract.price * 0.25);
            currentContract.price = Math.min(30, currentContract.price + bump); 
            sendBotMessage("BlackWork Bot: Ладно. Повышаю цену до " + currentContract.price + " BTC. По рукам?");
            renderChatActions();
        }
    }
    window.selectVirusType = function(typeId) {
        if (typeId > pcUpgradeLevel) return; 
        selectedVirusId = typeId;
        document.querySelectorAll('.virus-select-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById("virus-type-" + typeId).classList.add('active');

        if (currentContract && currentContract.status === "active") {
            compilerLog.innerText = "[NetBreaker] Ядро готово к кодингу.\n[НАЖИМАЙ ЛЮБЫЕ КЛАВИШИ НА КЛАВИАТУРЕ!]\n";
            keyboardHint.classList.remove("hidden");
        } else {
            compilerLog.innerText = "[NetBreaker] Требуется активный контракт в Anongram.\n";
            keyboardHint.classList.add("hidden");
        }
    };

    document.addEventListener("keydown", function (event) {
        const compilerWindow = document.getElementById("app-compiler");
        if (compilerWindow.classList.contains("hidden") || !currentContract || currentContract.status !== "active") return;
        if (event.repeat) return;

        let speed = 5 * (pcUpgradeLevel + 1);
        compileProgress = Math.min(100, compileProgress + speed);
        compileBar.style.width = compileProgress + "%";

        if (isTutorialActive && tutorialStep === 3) {
            guideText.innerText = "ИНСТРУКЦИЯ: Нажимай кнопки, пока шкала не дойдет до 100%.";
        }
        compilerLog.innerText += "\nAnonymous@root:~# inject_payload_aes256_success_gate";
        compilerLog.scrollTop = compilerLog.scrollHeight;

        if (compileProgress >= 100) {
            compileProgress = 0; compileBar.style.width = "0%"; keyboardHint.classList.add("hidden");
            currentContract.status = "compiled"; stealth = Math.max(0, stealth - 12); 
            compilerLog.innerText = "[SUCCESS] Сборка завершена!\n\n[ВНИМАНИЕ]: Закрой NetBreaker, зайди в Anongram и отправь файл.";
            
            if (isTutorialActive && tutorialStep === 3) {
                tutorialStep = 4; guideText.innerText = "ИНСТРУКЦИЯ: Вирус готов! Закрой NetBreaker, вернись в Anongram и нажми 'ОТПРАВИТЬ СКОМПИЛИРОВАННЫЙ ФАЙЛ'.";
            }
            renderChatActions(); updateUI();
        }
    });

    function finishTutorial() {
        if (!isTutorialActive) return;
        isTutorialActive = false; tutorialStep = 0;
        guideText.innerHTML = "<span style='color:#39ff14;'>ОБУЧЕНИЕ ЗАВЕРШЕНО!</span> Следи за Скрытностью, Усталостью и Репутацией. Спи кнопкой 'ВЫКЛЮЧИТЬ ПК'. Удачи!";
        setTimeout(function() {
            guideBox.classList.add("hidden");
            document.querySelectorAll('.window').forEach(win => win.classList.add('hidden'));
            sendBotMessage("BlackWork Bot: Инструктаж окончен. Высылаю первый реальный контракт.");
            generateNewContract();
        }, 8000);
    }

    window.submitForumPost = function(optionId) {
        if (!canPostToday) return;
        canPostToday = false; postingZone.classList.add("hidden");
        if (optionId === 1) { aggressionPoints += 30; stealth = Math.max(0, stealth - 20); } 
        else if (optionId === 2) { aggressionPoints += 15; stealth = Math.max(0, stealth - 10); } 
        else if (optionId === 3) { aggressionPoints = Math.max(0, aggressionPoints - 15); }
        generateForumPosts(); updateUI();
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
        stealthDisplay.innerText = Math.round(stealth) + "%";
        stealthBar.style.width = stealth + "%";
        sleepDisplay.innerText = fatigue + "%";
        sleepBar.style.width = fatigue + "%";
        reputationDisplay.innerText = reputation + " XP";
        
        if (stealth > 60) { stealthBar.style.backgroundColor = "#39ff14"; }
        else if (stealth > 30) { stealthBar.style.backgroundColor = "#ffaa00"; }
        else { stealthBar.style.backgroundColor = "#ff3333"; }

        if (aggressionPoints > 50) { aggressionStatus.innerText = "КРИТИЧЕСКАЯ УГРОЗА"; aggressionStatus.style.color = "#ff3333"; }
        else if (aggressionPoints > 20) { aggressionStatus.innerText = "РАЗДРАЖЕННЫЙ"; aggressionStatus.style.color = "#ffaa00"; }
        else { aggressionStatus.innerText = "NEUTRAL"; aggressionStatus.style.color = "#00f0ff"; }
    }

    window.buyProtection = function (cost, amount) {
        if (balance >= cost) {
            balance -= cost; stealth = Math.min(100, stealth + amount); updateUI();
            alert("Зашата обновлена! Скрытность восстановлена."); generateForumPosts();
        } else { alert("Недостаточно BTC!"); }
    };

    window.buyPCUpgrade = function (cost, typeId) {
        if (balance >= cost) {
            balance -= cost; pcUpgradeLevel = typeId;
            document.getElementById("pc-item-" + typeId).disabled = true;
            document.getElementById("pc-item-" + typeId).innerText = "КУПЛЕНО";
            const lockedBtn = document.getElementById("virus-type-" + typeId);
            lockedBtn.classList.remove("locked"); lockedBtn.disabled = false;
            updateUI(); alert("Компоненты ПК обновлены!");
        } else { alert("Недостаточно BTC!"); }
    };

    function generateForumPosts() {
        forumThreads.innerHTML = "";
        const goods = ["Анон: Anonymous гений взлома!", "Anon: Наша борда за свободный интернет!"];
        const bads = ["Шпион: Киберполиция запустила трекеры логов.", "Хейтер: Ловите деанон Anonymous! Защита падает!"];
        if (stealth < 50) {
            forumThreads.innerHTML += "<div class='post' style='border-color:#ff3333; color:#ff8888;'><strong>🚨 УГРОЗА ФОРУМА:</strong> " + bads[Math.floor(Math.random() * bads.length)] + "</div>";
        } else {
            forumThreads.innerHTML += "<div class='post'><strong>🔗 ТРЕД:</strong> " + goods[Math.floor(Math.random() * goods.length)] + "</div>";
        }
    }

    function passiveThreatLogic() {
        if (isSleeping || isTutorialActive) return;
        let reduction = (Math.random() * 3 + 2) / 60; 
        stealth = Math.max(0, stealth - reduction);
        let roundedStealth = Math.round(stealth);

        if (roundedStealth < 50 && roundedStealth >= 30) {
            if (Math.random() < 0.05) generateForumPosts(); 
        } else if (roundedStealth < 30 && roundedStealth > 0) {
            threatContact.classList.remove("hidden");
            if (Math.random() < 0.04) {
                const threatMsg = document.createElement("div"); threatMsg.className = "msg threat-msg";
                threatMsg.innerText = "ENEMY_HACKER: Твой кошелек под угрозой. Копы выехали.";
                chatMessages.appendChild(threatMsg); chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        } else if (roundedStealth <= 0) { triggerGameOver(); }
        updateUI();
    }

    function triggerGameOver() {
        clearInterval(clockInterval);
        desktop.innerHTML = "<div class='modal-overlay' style='background:#000; z-index:99999;'><div class='modal-box' style='border-color:#ff3333; box-shadow:0 0 40px #ff3333;'><h1 style='color:#ff3333;'>🛑 ОБЛАВА ПОЛИЦИИ</h1><p style='color:#ff8888; text-align:left; background:#1a0505; padding:15px; border:1px solid #551111;'>[ОШИБКА ДЕАНOНИМИЗАЦИИ]: Ваша скрытность упала до 0%. Спецслужбы отследили адрес шлюза.<br><br><strong>Штурмовой отряд киберполиции выбил вашу дверь. Вы арестованы.</strong></p><button class='nav-btn' style='border-color:#fff; color:#fff;' onclick='location.reload()'>НАЧАТЬ СНАЧАЛА</button></div></div>";
    }

    updateUI();
});
