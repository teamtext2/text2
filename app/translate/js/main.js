/**
 * Text2 Translate - Ultra Optimized Version
 * Author: Text2 Team
 * Optimization: Short Prompt, Faster Token Usage, Safer Output
 */

// --- CONSTANTS & CONFIG ---
const WORKER_URL = "https://cloudflare-llm.text2team.workers.dev";
const MAX_CHARS = 1000;
const TIMEOUT_MS = 15000;

const supportedLanguages = {
    'auto': 'Auto Detect',
    'vi': 'Vietnamese',
    'en': 'English',
    'zh': 'Chinese (Simplified)',
    'ja': 'Japanese',
    'ko': 'Korean',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
    'ru': 'Russian',
    'th': 'Thai',
    'id': 'Indonesian',
};

// --- DOM ELEMENTS ---
const elements = {
    input: document.getElementById('inputText'),
    output: document.getElementById('outputText'),
    btnTranslate: document.getElementById('translateButton'),
    btnSwap: document.getElementById('swapButton'),
    btnCopy: document.getElementById('copyButton'),
    btnClear: document.getElementById('clearButton'),
    selectSource: document.getElementById('sourceLanguageSelect'),
    selectTarget: document.getElementById('targetLanguageSelect'),
    displaySource: document.getElementById('sourceLangDisplay'),
    displayTarget: document.getElementById('targetLangDisplay'),
    charCount: document.getElementById('charCount'),
    spinner: document.getElementById('loadingSpinner'),
    btnText: document.getElementById('buttonText'),
    btnIcon: document.getElementById('buttonIcon'),
    errorMsg: document.getElementById('errorMessage'),
};

// --- INITIALIZATION ---
function init() {
    populateSelect(elements.selectSource, true);
    populateSelect(elements.selectTarget, false);

    elements.selectSource.value = 'vi';
    elements.selectTarget.value = 'en';
    updateDisplays();

    setupListeners();
    setAppHeight();
}

// --- HELPERS ---
function populateSelect(selectElement, includeAuto) {
    if (!selectElement) return;
    selectElement.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const [code, name] of Object.entries(supportedLanguages)) {
        if (!includeAuto && code === 'auto') continue;
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        fragment.appendChild(option);
    }
    selectElement.appendChild(fragment);
}

function setAppHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

function updateDisplays() {
    if (elements.displaySource)
        elements.displaySource.textContent = elements.selectSource.options[elements.selectSource.selectedIndex].text;

    if (elements.displayTarget)
        elements.displayTarget.textContent = elements.selectTarget.options[elements.selectTarget.selectedIndex].text;
}

function showError(msg) {
    if (!elements.errorMsg) return alert(msg);
    elements.errorMsg.textContent = msg;
    elements.errorMsg.classList.remove('hidden');
    elements.errorMsg.style.display = 'block';
    setTimeout(() => {
        elements.errorMsg.style.display = 'none';
        elements.errorMsg.classList.add('hidden');
    }, 5000);
}

function toggleLoading(isLoading) {
    if (!elements.btnTranslate) return;
    elements.btnTranslate.disabled = isLoading;

    if (isLoading) {
        elements.spinner?.classList.remove('hidden');
        elements.spinner.style.display = 'block';
        elements.btnText.style.display = 'none';
        elements.btnIcon.style.display = 'none';
        elements.btnTranslate.classList.add('opacity-75', 'cursor-wait');
    } else {
        elements.spinner?.classList.add('hidden');
        elements.spinner.style.display = 'none';
        elements.btnText.style.display = 'block';
        elements.btnIcon.style.display = 'block';
        elements.btnTranslate.classList.remove('opacity-75', 'cursor-wait');
    }
}

// --- SHORT & SAFE PROMPT ---
function generateSmartPrompt(sourceLang, targetLang, text) {
    return `
Translate from ${sourceLang} to ${targetLang}.
Use ONLY the official writing system of ${targetLang}.
No romanization, no phonetic transcription, no explanations.
Output only the final translation:

${text}
    `.trim();
}

// --- CLEAN RESPONSE ---
function cleanResponse(rawText) {
    if (!rawText) return "";

    let cleaned = rawText;
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleaned = cleaned.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '');
    cleaned = cleaned.replace(/Here is the translation:?/i, '');
    cleaned = cleaned.replace(/Translation:?/i, '');
    cleaned = cleaned.trim();

    return cleaned;
}

// --- EVENT LISTENERS ---
function setupListeners() {
    if (elements.input) {
        elements.input.addEventListener('input', () => {
            const len = elements.input.value.length;
            elements.charCount.textContent = `${len}/${MAX_CHARS}`;
            elements.charCount.classList.toggle('text-red-500', len > MAX_CHARS);
        });

        elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleTranslate();
            }
        });
    }

    elements.selectSource.addEventListener('change', updateDisplays);
    elements.selectTarget.addEventListener('change', updateDisplays);

    if (elements.btnSwap) {
        elements.btnSwap.addEventListener('click', () => {
            const oldSrc = elements.selectSource.value;
            const oldTgt = elements.selectTarget.value;

            elements.btnSwap.style.transition = 'transform 0.3s ease';
            elements.btnSwap.style.transform = 'rotate(180deg)';
            setTimeout(() => elements.btnSwap.style.transform = 'rotate(0deg)', 300);

            if (oldSrc !== 'auto') {
                elements.selectSource.value = oldTgt;
                elements.selectTarget.value = oldSrc;

                const tmp = elements.input.value;
                elements.input.value = elements.output.value;
                elements.output.value = tmp;
                elements.input.dispatchEvent(new Event('input'));
            } else {
                elements.selectSource.value = oldTgt;
            }
            updateDisplays();
        });
    }

    elements.btnTranslate.addEventListener('click', handleTranslate);

    if (elements.btnCopy) {
        elements.btnCopy.addEventListener('click', async () => {
            const text = elements.output.value;
            if (!text) return;

            try {
                await navigator.clipboard.writeText(text);
                elements.btnCopy.classList.add('text-green-400');
                setTimeout(() => elements.btnCopy.classList.remove('text-green-400'), 1500);
            } catch {
                showError("Could not copy text.");
            }
        });
    }

    if (elements.btnClear) {
        elements.btnClear.addEventListener('click', () => {
            elements.input.value = '';
            elements.output.value = '';
            elements.input.focus();
            elements.input.dispatchEvent(new Event('input'));
        });
    }

    window.addEventListener('resize', setAppHeight);
}

// --- API CORE ---
async function handleTranslate() {
    const text = elements.input.value.trim();
    if (!text) {
        showError("Please enter text to translate!");
        return elements.input.focus();
    }

    if (text.length > MAX_CHARS)
        return showError(`Text too long! Max ${MAX_CHARS} characters.`);

    if (window.innerWidth < 768) elements.input.blur();

    toggleLoading(true);
    elements.output.value = '';

    const sourceName = elements.selectSource.options[elements.selectSource.selectedIndex].text;
    const targetName = elements.selectTarget.options[elements.selectTarget.selectedIndex].text;

    const prompt = generateSmartPrompt(sourceName, targetName, text);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);

        const data = await response.json();
        let raw = data.response || data.reply || data.result || "";

        if (typeof raw === 'object') raw = raw.response || JSON.stringify(raw);

        const finalText = cleanResponse(raw);
        if (!finalText) throw new Error("Empty translation received");

        elements.output.value = finalText;

    } catch (err) {
        if (err.name === 'AbortError') showError("Request timed out.");
        else showError("Translation failed.");
    } finally {
        toggleLoading(false);
    }
}

document.addEventListener('DOMContentLoaded', init);
