(function() {
    // Create styles
    const style = document.createElement('style');
    style.textContent = `
        .chatbot-bubble-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
        }
        .chatbot-greeting {
            background: linear-gradient(135deg, rgba(26, 11, 46, 0.98), rgba(45, 27, 105, 0.95));
            color: white;
            padding: 12px 18px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(107, 70, 193, 0.4);
            border: 1px solid rgba(212, 175, 55, 0.3);
            font-size: 14px;
            cursor: pointer;
            animation: chatbotFloat 3s ease-in-out infinite;
        }
        .chatbot-greeting.hidden { display: none; }
        @keyframes chatbotFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .chatbot-bubble {
            width: 60px;
            height: 60px;
            background: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(107, 70, 193, 0.5);
            transition: transform 0.3s;
        }
        .chatbot-bubble:hover { transform: scale(1.1); }
        .chatbot-bubble img {
            width: 54px;
            height: 54px;
            border-radius: 50%;
        }
        .chatbot-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 320px;
            height: 450px;
            background: linear-gradient(145deg, rgba(15, 5, 36, 0.98), rgba(26, 11, 46, 0.98));
            border-radius: 20px;
            display: none;
            flex-direction: column;
            z-index: 999998;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .chatbot-window.active { display: flex; }
        .chatbot-header {
            background: linear-gradient(135deg, #1a0b2e, #6b46c1);
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            border-radius: 20px 20px 0 0;
        }
        .chatbot-header h3 {
            font-size: 13px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin: 0;
        }
        .chatbot-close {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: #d4af37;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
        }
        .chatbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: rgba(10, 3, 24, 0.9);
        }
        .chatbot-msg {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }
        .chatbot-msg.user { flex-direction: row-reverse; }
        .chatbot-msg img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
        }
        .chatbot-msg-text {
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 13px;
            max-width: 70%;
        }
        .chatbot-msg.bot .chatbot-msg-text {
            background: linear-gradient(135deg, rgba(26, 11, 46, 0.9), rgba(45, 27, 105, 0.8));
            color: #e8e0f7;
        }
        .chatbot-msg.user .chatbot-msg-text {
            background: linear-gradient(135deg, #6b46c1, #8b5cf6);
            color: white;
        }
        .chatbot-input-area {
            padding: 14px;
            background: rgba(15, 5, 36, 0.95);
            border-radius: 0 0 20px 20px;
            display: flex;
            gap: 8px;
        }
        .chatbot-input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid rgba(212, 175, 55, 0.4);
            border-radius: 18px;
            background: rgba(26, 11, 46, 0.6);
            color: white;
            font-size: 13px;
            outline: none;
        }
        .chatbot-send {
            background: linear-gradient(135deg, #d4af37, #f4e5b8);
            color: #1a0b2e;
            border: none;
            padding: 10px 18px;
            border-radius: 18px;
            cursor: pointer;
            font-weight: 700;
            font-size: 12px;
        }
        @media (max-width: 768px) {
            .chatbot-bubble-container.mobile-hidden { display: none; }
            .chatbot-window {
                bottom: 0;
                right: 0;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create HTML
    const root = document.getElementById('chatbot-root');
    root.innerHTML = `
        <div class="chatbot-bubble-container" id="chatbotContainer">
            <div class="chatbot-greeting" id="chatbotGreeting">👋 Need help? Chat with us!</div>
            <div class="chatbot-bubble" id="chatbotBubble">
                <img src="https://denniysa.github.io/-wix-chatbot/chatbot-icon.png.jpg" alt="Chat">
            </div>
        </div>
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <h3>AI Assistant</h3>
                <button class="chatbot-close" id="chatbotClose">×</button>
            </div>
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="chatbot-msg bot">
                    <img src="https://denniysa.github.io/-wix-chatbot/chatbot-icon.png.jpg" alt="AI">
                    <div class="chatbot-msg-text">Hi, I'm Claude. How can I assist you today?</div>
                </div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Ask me anything...">
                <button class="chatbot-send" id="chatbotSend">Send</button>
            </div>
        </div>
    `;

    // JavaScript
    const container = document.getElementById('chatbotContainer');
    const greeting = document.getElementById('chatbotGreeting');
    const bubble = document.getElementById('chatbotBubble');
    const window = document.getElementById('chatbotWindow');
    const close = document.getElementById('chatbotClose');
    const input = document.getElementById('chatbotInput');
    const send = document.getElementById('chatbotSend');
    const messages = document.getElementById('chatbotMessages');

    setTimeout(() => greeting.classList.add('hidden'), 60000);

    function openChat() {
        greeting.classList.add('hidden');
        if (window.innerWidth <= 768) container.classList.add('mobile-hidden');
        window.classList.add('active');
    }

    function closeChat() {
        window.classList.remove('active');
        container.classList.remove('mobile-hidden');
    }

    greeting.addEventListener('click', openChat);
    bubble.addEventListener('click', openChat);
    close.addEventListener('click', closeChat);

    function addMsg(text, isUser) {
        const msg = document.createElement('div');
        msg.className = 'chatbot-msg' + (isUser ? ' user' : ' bot');
        msg.innerHTML = `
            <img src="https://denniysa.github.io/-wix-chatbot/chatbot-icon.png.jpg">
            <div class="chatbot-msg-text">${text}</div>
        `;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    async function sendMsg() {
        const text = input.value.trim();
        if (!text) return;
        
        addMsg(text, true);
        input.value = '';
        send.disabled = true;

        try {
            const res = await fetch('https://chatbot-backend-coral.vercel.app/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            addMsg(data.reply || 'Sorry, something went wrong.', false);
        } catch (e) {
            addMsg('Connection issues. Please try again.', false);
        }

        send.disabled = false;
    }

    send.addEventListener('click', sendMsg);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMsg();
    });
})();
