document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let localHackerLevel = 1;
    let stealth = 100;
    let fatigue = 0;
    let reputation = 100;
    let pcUpgradeLevel = 0;
    let workersCount = 0;
    let hasQuantumPC = false;
    let isGameOver = false;
    let isSleeping = false;

    let gameHour = 9;
    let gameMinute = 0;
    let clockInterval = null;
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
    const workersDisplay = document.getElementById("workers-display");
    const compilerLog = document.getElementById("compiler-log-box");
    const compileBar = document.getElementById("compile-bar");
    const keyboardHint = document.getElementById("keyboard-hint");

    function updateUI() {
        if (walletDisplay) walletDisplay.innerText = balance + " BTC";
        if (stealthDisplay) stealthDisplay.innerText = Math.round(stealth) + "%";
        if (stealthBar) stealthBar.style.width = stealth + "%";
        if (sleepDisplay) sleepDisplay.innerText = fatigue + "%";
        if (sleepBar) sleepBar.style.width = fatigue + "%";
        if (reputationDisplay) reputationDisplay.innerText = reputation + " XP";
        if (workersDisplay) workersDisplay.innerText = workersCount + " ХАКЕРОВ";
        
        if (stealthBar) {
            stealthBar.style.backgroundColor = stealth > 60 ? "#39ff14" : (stealth > 30 ? "#ffaa00" : "#ff3333");
        }

        if (aggressionStatus) {
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
    }

        stealthDisplay.innerText = Math.round(stealth) + "%";
        stealthBar.style.width = stealth + "%";
        sleepDisplay.innerText = fatigue + "%";
        sleepBar.style.width = fatigue + "%";
        reputationDisplay.innerText = reputation + " XP";
        workersDisplay.innerText = workersCount + " ХАКЕРОВ";
        
        if (stealth > 60) {
            stealthBar.style.backgroundColor = "#39ff14";
        } else if (stealth > 30) {
            stealthBar.style.backgroundColor = "#ffaa00";
        } else {
            stealthBar.style.backgroundColor = "#ff3333";
        }

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
    const chatMessages = document.getElementById("chat-messages-box");
    const chatActions = document.getElementById("chat-actions-zone");
    const threatContact = document.getElementById("threat-contact");
    const hacknetLoader = document.getElementById("hacknet-loader");
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
    const workersDisplay = document.getElementById("workers-display");
    const compilerLog = document.getElementById("compiler-log-box");
    const compileBar = document.getElementById("compile-bar");
    const keyboardHint = document.getElementById("keyboard-hint");

    function updateUI() {
        if (!walletDisplay) return;
        walletDisplay.innerText = balance + " BTC";
        stealthDisplay.innerText = Math.round(stealth) + "%";
        stealthBar.style.width = stealth + "%";
        sleepDisplay.innerText = fatigue + "%";
        sleepBar.style.width = fatigue + "%";
        reputationDisplay.innerText = reputation + " XP";
        workersDisplay.innerText = workersCount + " ХАКЕРОВ";
        
        if (stealth > 60) {
            stealthBar.style.backgroundColor = "#39ff14";
        } else if (stealth > 30) {
            stealthBar.style.backgroundColor = "#ffaa00";
        } else {
            stealthBar.style.backgroundColor = "#ff3333";
        }

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
    window.toggleSleep = function() {
        if (isTutorialActive) return alert("Гид: Сон заблокирован в туториале!");
        if (currentContract && currentContract.status === "active") return alert("Нельзя спать во время кодинга!");
        isSleeping = true;
        sleepScreen.classList.remove("hidden");
        setTimeout(function() {
            fatigue = 0;
            gameHour = (gameHour + 8) % 24;
            isSleeping = false;
            sleepScreen.classList.add("hidden");
            sendBotMessage("BlackWork Bot: С силами порядок. Жду вирусы.");
            if (!currentContract) generateNewContract();
            updateUI();
        }, 3000); 
    };

    function triggerFaint() {
        alert("Обморок! Штраф -30% BTC за срочное лечение.");
        balance = Math.floor(balance * 0.7);
        fatigue = 30;
        gameHour = (gameHour + 10) % 24;
        updateUI();
    }

    window.openApp = function (appName) {
        if (isTutorialActive) {
            if (tutorialStep === 1 && appName !== "anongram") return alert("Гид: Открой Anongram!");
            if (tutorialStep === 3 && appName !== "compiler") return alert("Гид: Открой NetBreaker!");
            if (tutorialStep === 5 && appName !== "hacknet") return alert("Гид: Открой HackNet!");
        }
        const appWindow = document.getElementById("app-" + appName);
        if (!appWindow) return;
        appWindow.classList.remove("hidden");
        
        if (appName === "anongram" && isTutorialActive && tutorialStep === 1) {
            tutorialStep = 2;
            guideText.innerText = "ИНСТРУКЦИЯ: Прими заказ бота или нажми 'Торг'.";
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
        if (isTutorialActive && tutorialStep === 3 && appName === "compiler") {
            alert("Гид: Допиши вирус до 100%!");
            return;
        }
        const appWindow = document.getElementById("app-" + appName);
        if (appWindow) appWindow.classList.add("hidden");
    };
    function runProxyLoader() {
        connectionLog.innerText = ""; 
        const logs = ["[SYSTEM] Шлюз...", "[PROXY] Мальдивы... Ок", "[VPN] AES-256... Ок", "[TOR] Луковые узлы... Ок", "[SUCCESS] Вход разрешен."];
        let index = 0;
        function printLog() {
            if (index < logs.length) { 
                connectionLog.innerText += logs[index] + "\n"; 
                index++; 
                setTimeout(printLog, 120); 
            } else {
                setTimeout(function() {
                    hacknetLoader.classList.add("hidden"); 
                    hacknetContent.style.display = "flex";
                    if (isTutorialActive && tutorialStep === 5) { 
                        tutorialStep = 6; 
                        guideText.innerText = "ИНСТРУКЦИЯ: Изучи вкладки 5chan, Shop и Wallet."; 
                        setTimeout(finishTutorial, 5000); 
                    }
                    document.getElementById("tab-5chan").classList.add("active");
                    updateUI();
                }, 150);
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
        const types = ["написание майнера", "создание трояна", "взлом базы данных"]; 
        const randomType = types[Math.floor(Math.random() * types.length)];
        let basePrice = Math.floor((Math.random() * 11 + 9) * (reputation / 100)); 
        if (basePrice < 5) basePrice = 5;
        
        currentContract = { 
            type: randomType, 
            price: basePrice, 
            basePrice: basePrice, 
            haggleCount: 0, 
            status: "pending" 
        }; 
        contractTimer = 0;
        sendBotMessage("BlackWork Bot: Контракт [" + currentContract.type + "]. Гонорар: " + currentContract.price + " BTC. Берешь?"); 
        renderChatActions();
    }
    function renderChatActions() {
        chatActions.innerHTML = ""; 
        if (!currentContract) return;
        
        if (currentContract.status === "pending") {
            const acceptBtn = document.createElement("button"); 
            acceptBtn.className = "nav-btn"; 
            acceptBtn.innerText = "ПРИНЯТЬ";
            acceptBtn.onclick = function() {
                sendPlayerMessage("Я в деле."); 
                currentContract.status = "active"; 
                sendBotMessage("BlackWork Bot: Отлично. Кликай буквы в NetBreaker.");
                if (isTutorialActive && tutorialStep === 2) { 
                    tutorialStep = 3; 
                    guideText.innerText = "ИНСТРУКЦИЯ: Открой NetBreaker и пиши код."; 
                }
                renderChatActions();
            };

            const haggleBtn = document.createElement("button"); 
            haggleBtn.className = "nav-btn"; 
            haggleBtn.style.color = "#00f0ff"; 
            haggleBtn.innerText = "ТОРГ"; 
            haggleBtn.onclick = function() { processHaggle(); };

            const refuseBtn = document.createElement("button"); 
            refuseBtn.className = "nav-btn cancel-btn"; 
            refuseBtn.innerText = "ОТКАЗ";
            refuseBtn.onclick = function() { 
                if (isTutorialActive) return alert("Гид: Прими контракт!"); 
                sendPlayerMessage("Отказ."); 
                currentContract = null; 
                chatActions.innerHTML = ""; 
                setTimeout(generateNewContract, 4000); 
            };

            chatActions.appendChild(acceptBtn); 
            chatActions.appendChild(haggleBtn); 
            chatActions.appendChild(refuseBtn);
        } else if (currentContract.status === "active") { 
            chatActions.innerHTML = "<span>Код пишется в NetBreaker...</span>"; 
        } else if (currentContract.status === "compiled") {
            const fBtn = document.createElement("button"); 
            fBtn.className = "nav-btn"; 
            fBtn.innerText = "📁 ОТПРАВИТЬ ФАЙЛ";
            fBtn.onclick = function() {
                sendPlayerMessage("Лови файл."); 
                balance += currentContract.price; 
                reputation = Math.min(200, reputation + 10);
                sendBotMessage("BlackWork Bot: Получено. Перевожу " + currentContract.price + " BTC."); 
                currentContract = null; 
                updateUI(); 
                chatActions.innerHTML = "";
                if (isTutorialActive && tutorialStep === 4) { 
                    tutorialStep = 5; 
                    guideText.innerText = "ИНСТРУКЦИЯ: Открой браузер HackNet."; 
                } else { 
                    setTimeout(generateNewContract, 4000); 
                }
            };
            chatActions.appendChild(fBtn);
        }
    }

    function processHaggle() {
        if (!currentContract) return; 
        currentContract.haggleCount++; 
        sendPlayerMessage("Мало денег.");
        if (currentContract.price >= 30) return sendBotMessage("BlackWork Bot: 30 BTC — мой макс. потолок.");
        
        let failChance = isTutorialActive ? 0 : currentContract.haggleCount * 0.35;
        if (Math.random() < failChance) { 
            sendBotMessage("BlackWork Bot: Сделка отменена."); 
            reputation = Math.max(0, reputation - 5); 
            currentContract = null; 
            chatActions.innerHTML = ""; 
            updateUI(); 
            setTimeout(generateNewContract, 5000); 
        } else { 
            currentContract.price = Math.min(30, currentContract.price + Math.floor(currentContract.price * 0.25)); 
            sendBotMessage("BlackWork Bot: Повышаю до " + currentContract.price + " BTC. По рукам?"); 
            renderChatActions(); 
        }
    }
    window.selectVirusType = function(typeId) {
        if (typeId > pcUpgradeLevel) return; 
        selectedVirusId = typeId; 
        document.querySelectorAll('.virus-select-btn').forEach(b => b.classList.remove('active')); 
        document.getElementById("virus-type-" + typeId).classList.add('active');
        
        if (currentContract && currentContract.status === "active") { 
            compilerLog.innerText = "[NetBreaker] Жду кодинг...\n[НАЖИМАЙ ЛЮБЫЕ КЛАВИШИ НА КЛАВИАТУРЕ!]\n"; 
            keyboardHint.classList.remove("hidden"); 
        } else { 
            compilerLog.innerText = "[NetBreaker] Нужен контракт.\n"; 
            keyboardHint.classList.add("hidden"); 
        }
    };

    document.addEventListener("keydown", function (e) {
        const win = document.getElementById("app-compiler"); 
        if (win.classList.contains("hidden") || !currentContract || currentContract.status !== "active" || e.repeat) return;
        
        compileProgress = Math.min(100, compileProgress + 5 * (pcUpgradeLevel + 1)); 
        compileBar.style.width = compileProgress + "%";
        
        if (isTutorialActive && tutorialStep === 3) guideText.innerText = "ИНСТРУКЦИЯ: Нажимай кнопки до 100%.";
        
        compilerLog.innerText += "\nAnonymous@root:~# inject_payload_gate_aes256_success"; 
        compilerLog.scrollTop = compilerLog.scrollHeight;
        
        if (compileProgress >= 100) {
            compileProgress = 0; 
            compileBar.style.width = "0%"; 
            keyboardHint.classList.add("hidden"); 
            currentContract.status = "compiled"; 
            stealth = Math.max(0, stealth - 12);
            compilerLog.innerText = "[SUCCESS] Сборка готова! Закрой NetBreaker и отправь файл в Anongram.";
            
            if (isTutorialActive && tutorialStep === 3) { 
                tutorialStep = 4; 
                guideText.innerText = "ИНСТРУКЦИЯ: Закрой NetBreaker крестиком и отправь файл в чате."; 
            }
            renderChatActions(); 
            updateUI();
        }
    });
    function finishTutorial() {
        if (!isTutorialActive) return; 
        isTutorialActive = false; 
        tutorialStep = 0; 
        guideText.innerHTML = "<span>ТУТОРИАЛ ЗАВЕРШЕН!</span> Следи за Скрытностью, Сном и Репутацией. Нанимай хакеров в Shop.";
        setTimeout(function() { 
            guideBox.classList.add("hidden"); 
            document.querySelectorAll('.window').forEach(w => w.classList.add('hidden')); 
            sendBotMessage("BlackWork Bot: Начнем работу. Высылаю контракт."); 
            generateNewContract(); 
        }, 6000);
    }

    window.buyWorker = function() {
        if (balance >= 500) { 
            balance -= 500; 
            workersCount += 1; 
            updateUI(); 
            alert("Реферал нанят! (+5 BTC/час)"); 
        } else { 
            alert("Мало BTC!"); 
        }
    };

    window.buyQuantumPC = function() {
        if (balance >= 1500) { 
            balance -= 1500; 
            hasQuantumPC = true; 
            document.getElementById("quantum-pc-btn").disabled = true; 
            document.getElementById("quantum-pc-btn").innerText = "ON"; 
            updateUI(); 
            alert("AI-Quantum запущен! Слежка х2 меньше."); 
        } else { 
            alert("Мало BTC!"); 
        }
    };

    window.buyMansion = function() {
        if (balance >= 4500) { 
            balance -= 4500; 
            reputation = 200; 
            document.getElementById("mansion-btn").disabled = true; 
            updateUI(); 
            alert("Особняк куплен! Репутация 200 XP!"); 
        } else { 
            alert("Мало BTC!"); 
        }
    };
