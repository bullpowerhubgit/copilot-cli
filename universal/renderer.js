let conversationHistory = [];
let currentModel = 'groq-llama-70b';
let config = {};
let lastResponse = '';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadModels();
    setupEventListeners();
    setupIPCListeners();
});

async function loadConfig() {
    config = await window.electronAPI.getConfig();
    currentModel = config.defaultModel || 'groq-llama-70b';
    
    if (config.autostart) {
        document.getElementById('autostartCheckbox').checked = true;
    }
}

async function loadModels() {
    const models = await window.electronAPI.getModels();
    const select = document.getElementById('quickModel');
    
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.name;
        if (model.value === currentModel) option.selected = true;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    const input = document.getElementById('messageInput');
    
    // Enter to send
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    });
}

function setupIPCListeners() {
    // Zwischenablage-Anfrage
    window.electronAPI.onClipboardRequest((text) => {
        addSystemMessage(`📋 Zwischenablage analysieren:\n${text.substring(0, 100)}...`);
        document.getElementById('messageInput').value = `Analysiere bitte folgenden Text:\n\n${text}`;
    });
    
    // Screenshot
    window.electronAPI.onScreenshotCaptured((path) => {
        addSystemMessage(`📸 Screenshot erstellt! (Beta - Textanalyse folgt)`);
    });
    
    // Settings öffnen
    window.electronAPI.onOpenSettings(() => {
        openSettings();
    });
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add to UI
    addMessage('user', message);
    conversationHistory.push({ role: 'user', content: message });
    
    input.value = '';
    input.style.height = 'auto';
    
    // Set status
    setStatus('AI denkt nach...');
    
    try {
        const result = await window.electronAPI.sendMessage({
            messages: conversationHistory,
            model: currentModel
        });
        
        if (result.success) {
            addMessage('assistant', result.response);
            conversationHistory.push({ role: 'assistant', content: result.response });
            lastResponse = result.response;
            setStatus('Bereit');
        } else {
            addSystemMessage(`❌ Fehler: ${result.error}`);
            setStatus('Fehler');
        }
    } catch (error) {
        addSystemMessage(`❌ Fehler: ${error.message}`);
        setStatus('Fehler');
    }
}

function addMessage(role, content) {
    const messages = document.getElementById('messages');
    
    // Remove welcome message
    const welcome = messages.querySelector('.system-message');
    if (welcome) welcome.remove();
    
    const div = document.createElement('div');
    div.className = `message ${role}`;
    
    const icon = role === 'user' ? '👤' : '🤖';
    const roleName = role === 'user' ? 'Du' : 'Assistent';
    
    div.innerHTML = `
        <div class="message-header">${icon} ${roleName}</div>
        <div class="message-content">${formatMessage(content)}</div>
    `;
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addSystemMessage(content) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'message';
    div.style.background = 'rgba(255, 159, 10, 0.2)';
    div.style.borderLeft = '3px solid #ff9f0a';
    div.innerHTML = `<div class="message-content">${content}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

function setStatus(text) {
    document.getElementById('statusText').textContent = text;
}

function changeModel() {
    currentModel = document.getElementById('quickModel').value;
    config.defaultModel = currentModel;
    window.electronAPI.saveConfig(config);
    addSystemMessage(`✅ Modell gewechselt zu: ${currentModel}`);
}

async function analyzeClipboard() {
    const text = await window.electronAPI.getClipboard();
    if (text) {
        document.getElementById('messageInput').value = `Analysiere: ${text}`;
        addSystemMessage('📋 Zwischenablage eingefügt');
    }
}

function quickScreenshot() {
    addSystemMessage('📸 Screenshot-Funktion wird vorbereitet...');
    // Wird durch globalen Hotkey ausgelöst
}

async function pasteResponse() {
    if (lastResponse) {
        await window.electronAPI.typeText(lastResponse);
        addSystemMessage('✅ Antwort wurde in aktive App eingefügt!');
        minimizeOverlay();
    } else {
        addSystemMessage('❌ Keine Antwort zum Einfügen verfügbar');
    }
}

async function copyToClipboard() {
    if (lastResponse) {
        await window.electronAPI.setClipboard(lastResponse);
        addSystemMessage('📋 In Zwischenablage kopiert!');
    }
}

async function insertIntoApp() {
    if (lastResponse) {
        await window.electronAPI.typeText(lastResponse);
        addSystemMessage('⌨️ Text wird in aktive App eingefügt...');
        setTimeout(() => minimizeOverlay(), 500);
    }
}

function minimizeOverlay() {
    window.electronAPI.hideOverlay();
}

function closeOverlay() {
    window.electronAPI.hideOverlay();
}

// Settings
function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('active');
    
    // Load values
    document.getElementById('groqApiKey').value = config.groqApiKey || '';
    document.getElementById('googleApiKey').value = config.googleApiKey || '';
    document.getElementById('ollamaHost').value = config.ollamaHost || 'http://localhost:11434';
    document.getElementById('autostartCheckbox').checked = config.autostart || false;
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

async function saveSettings() {
    config.groqApiKey = document.getElementById('groqApiKey').value;
    config.googleApiKey = document.getElementById('googleApiKey').value;
    config.ollamaHost = document.getElementById('ollamaHost').value;
    config.autostart = document.getElementById('autostartCheckbox').checked;
    
    await window.electronAPI.saveConfig(config);
    closeSettings();
    addSystemMessage('✅ Einstellungen gespeichert!');
}

function switchTab(tab) {
    // Remove active from all
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active to selected
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

// Close modal on background click
document.addEventListener('click', (e) => {
    if (e.target.id === 'settingsModal') {
        closeSettings();
    }
});
