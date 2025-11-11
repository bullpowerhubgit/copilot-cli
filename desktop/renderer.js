let conversationHistory = [];
let currentModel = 'groq-llama-70b';
let config = {};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadModels();
    setupEventListeners();
});

async function loadConfig() {
    config = await window.electronAPI.getConfig();
    currentModel = config.defaultModel || 'groq-llama-70b';
    updateProviderDisplay();
}

async function loadModels() {
    const models = await window.electronAPI.getModels();
    const modelSelect = document.getElementById('modelSelect');
    
    modelSelect.innerHTML = '';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.name;
        if (model.value === currentModel) {
            option.selected = true;
        }
        modelSelect.appendChild(option);
    });
}

function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const modelSelect = document.getElementById('modelSelect');

    // Enter to send, Shift+Enter for new line
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    // Model change
    modelSelect.addEventListener('change', (e) => {
        currentModel = e.target.value;
        config.defaultModel = currentModel;
        window.electronAPI.saveConfig(config);
        updateProviderDisplay();
    });
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;

    // Add user message to UI
    addMessageToUI('user', message);
    conversationHistory.push({ role: 'user', content: message });
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Disable send button
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;

    // Show loading
    const loadingId = addLoadingMessage();

    try {
        const result = await window.electronAPI.sendMessage({
            messages: conversationHistory,
            model: currentModel
        });

        removeMessage(loadingId);

        if (result.success) {
            addMessageToUI('assistant', result.response);
            conversationHistory.push({ role: 'assistant', content: result.response });
        } else {
            addErrorMessage(result.error);
        }
    } catch (error) {
        removeMessage(loadingId);
        addErrorMessage(error.message);
    }

    sendButton.disabled = false;
    updateStats();
}

function addMessageToUI(role, content) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Remove welcome message if exists
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.dataset.role = role;

    const now = new Date().toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-role ${role}">${role === 'user' ? '👤 Du' : '🤖 Assistent'}</span>
            <span class="message-time">${now}</span>
        </div>
        <div class="message-content ${role}">${formatMessage(content)}</div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

function addLoadingMessage() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message';
    loadingDiv.id = 'loading-message';

    loadingDiv.innerHTML = `
        <div class="message-header">
            <span class="message-role assistant">🤖 Assistent</span>
        </div>
        <div class="message-content assistant">
            <span class="loading">Denkt nach</span>
        </div>
    `;

    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return 'loading-message';
}

function removeMessage(id) {
    const message = document.getElementById(id);
    if (message) {
        message.remove();
    }
}

function addErrorMessage(error) {
    const chatMessages = document.getElementById('chatMessages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message';

    errorDiv.innerHTML = `
        <div class="message-content assistant" style="border-left-color: var(--danger);">
            ❌ <strong>Fehler:</strong> ${error}
        </div>
    `;

    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(content) {
    // Simple markdown-like formatting
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');

    // Code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    return formatted;
}

function updateStats() {
    const messageCount = document.getElementById('messageCount');
    messageCount.textContent = conversationHistory.length;
}

function updateProviderDisplay() {
    const providerSpan = document.getElementById('currentProvider');
    let provider = 'Unbekannt';

    if (currentModel.startsWith('groq-')) provider = 'Groq';
    else if (currentModel.startsWith('google-')) provider = 'Google';
    else if (currentModel.startsWith('openrouter-')) provider = 'OpenRouter';
    else if (currentModel.startsWith('huggingface-')) provider = 'HuggingFace';
    else if (currentModel.startsWith('ollama-')) provider = 'Ollama';

    providerSpan.textContent = provider;
}

function clearChat() {
    if (confirm('Möchtest du wirklich den gesamten Chat löschen?')) {
        conversationHistory = [];
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <h2>Chat wurde gelöscht</h2>
                <p>Beginne eine neue Konversation!</p>
            </div>
        `;
        updateStats();
    }
}

function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('active');

    // Load current settings
    document.getElementById('groqApiKey').value = config.groqApiKey || '';
    document.getElementById('googleApiKey').value = config.googleApiKey || '';
    document.getElementById('openrouterApiKey').value = config.openrouterApiKey || '';
    document.getElementById('huggingfaceApiKey').value = config.huggingfaceApiKey || '';
    document.getElementById('ollamaHost').value = config.ollamaHost || 'http://localhost:11434';
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('active');
}

async function saveSettings() {
    config.groqApiKey = document.getElementById('groqApiKey').value;
    config.googleApiKey = document.getElementById('googleApiKey').value;
    config.openrouterApiKey = document.getElementById('openrouterApiKey').value;
    config.huggingfaceApiKey = document.getElementById('huggingfaceApiKey').value;
    config.ollamaHost = document.getElementById('ollamaHost').value;

    await window.electronAPI.saveConfig(config);
    closeSettings();
    
    // Show confirmation
    const chatMessages = document.getElementById('chatMessages');
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'message';
    confirmDiv.innerHTML = `
        <div class="message-content assistant" style="border-left-color: var(--success);">
            ✅ Einstellungen wurden gespeichert!
        </div>
    `;
    chatMessages.appendChild(confirmDiv);
    
    setTimeout(() => confirmDiv.remove(), 3000);
}

function exportChat() {
    const chatData = JSON.stringify({
        timestamp: new Date().toISOString(),
        model: currentModel,
        messages: conversationHistory
    }, null, 2);

    const blob = new Blob([chatData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copilot-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('settingsModal');
    if (e.target === modal) {
        closeSettings();
    }
});
