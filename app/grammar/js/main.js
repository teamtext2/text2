    const btn = document.getElementById("submitBtn");
    const input = document.getElementById("inputText");
    const output = document.getElementById("outputText");
    const loading = document.getElementById("loading");
    const resultContainer = document.getElementById("resultContainer");
    const placeholder = document.getElementById("placeholder");
    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const charCount = document.getElementById("charCount");
    const wordCount = document.getElementById("wordCount");
    const outputSection = document.getElementById("outputSection");
    const editorGrid = document.getElementById("editorGrid");
    const inputSection = document.getElementById("inputSection");

    const API_KEY = "4cf2ed88b3d39e9f196ab88cefa8bf0bc21d698ce9cdf8f20cf80a596247378c";
    const WORKER_URL = "https://cloudflare-llm.text2team.workers.dev"; 

    let isRequesting = false;

    // Character and word counter
    input.addEventListener("input", () => {
        const text = input.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        charCount.textContent = `${chars} chars`;
        wordCount.textContent = `${words} words`;
        autoResize(input);
    });

    // Auto-resize textarea
    function autoResize(el) {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }

    // Initialize height on load
    window.addEventListener('load', () => autoResize(input));

    // Clear button
    clearBtn.addEventListener("click", () => {
        input.value = "";
        charCount.textContent = "0 chars";
        wordCount.textContent = "0 words";
        
        // Logic UI Reset
        resultContainer.classList.add("hidden");
        placeholder.classList.remove("hidden");
        // In the new layout, we might want to hide the whole output section if cleared?
        // But to keep strict logic, we follow original behavior, or just reset internal state.
        outputSection.classList.add("hidden"); 
        editorGrid.classList.add("lg:grid-cols-1"); // Return to single column
        editorGrid.classList.remove("lg:grid-cols-2");
        
        autoResize(input);
    });

    // Copy button
    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(output.textContent);
            showNotification("Copied to clipboard!", "success");
        } catch (err) {
            showNotification("Could not copy text", "error");
        }
    });

    // typing effect ✨
    function typeOut(el, text) {
        el.textContent = "";
        let i = 0;
        const step = () => {
            if (i < text.length) {
                el.textContent += text[i++];
                // Faster typing for better mobile feel
                setTimeout(step, 5 + Math.random() * 10); 
            }
        };
        step();
    }

    btn.addEventListener("click", async () => {
        if (isRequesting) return;
        
        const userText = input.value.trim();
        if (!userText) {
            showNotification("Please enter text to correct!", "warning");
            return;
        }

        const fullPrompt = "Correct grammar errors with this text and language. Return only the corrected text, no explanation: " + userText;

        isRequesting = true;
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed"); // Visual feedback for disabled button
        
        // UI State Changes
        outputSection.classList.remove("hidden"); // Show the output container
        placeholder.classList.add("hidden"); // Hide the placeholder text
        loading.classList.remove("hidden"); // Show loading spinner
        resultContainer.classList.add("hidden"); // Ensure old result is hidden
        
        output.textContent = "";
        
        // Switch layout to two columns (Desktop) or stacked (Mobile)
        editorGrid.classList.remove("lg:grid-cols-1");
        editorGrid.classList.add("lg:grid-cols-2");

        // Scroll to output on mobile so user sees something is happening
        if(window.innerWidth < 1024) {
            setTimeout(() => {
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        try {
            const response = await fetch(WORKER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: fullPrompt
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Server lỗi (${response.status}): ${errText}`);
            }

            const data = await response.json();

            // 👉 Worker response handling
            let resultText = data?.reply?.response || data?.reply || "Không có phản hồi từ AI 😢";

            // Remove content within <think></think> tags
            resultText = resultText.replace(/<think>.*?<\/think>/gs, '');

            loading.classList.add("hidden"); // Hide loader
            resultContainer.classList.remove("hidden"); // Show result text area
            
            // Hiệu ứng gõ từng chữ
            typeOut(output, resultText);

        } catch (error) {
            console.error("Error:", error);
            loading.classList.add("hidden");
            output.textContent = "🚨 Lỗi: " + error.message;
            resultContainer.classList.remove("hidden");
        } finally {
            isRequesting = false;
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    // Notification system
    function showNotification(message, type = "info") {
        // Remove existing notification if any
        const existing = document.querySelector('.toast-notification');
        if(existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `toast-notification fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 min-w-[300px] justify-center transition-all duration-300 translate-y-[-20px] opacity-0`;
        
        const colors = {
            success: "bg-green-600/90 text-white backdrop-blur",
            error: "bg-red-600/90 text-white backdrop-blur", 
            warning: "bg-amber-500/90 text-white backdrop-blur",
            info: "bg-blue-600/90 text-white backdrop-blur"
        };
        
        notification.className += ` ${colors[type]}`;
        
        // Simple Icons
        let iconSvg = "";
        if (type === 'success') iconSvg = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
        else if (type === 'error') iconSvg = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
        else iconSvg = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
        
        notification.innerHTML = `
            ${iconSvg}
            <span class="font-medium text-sm">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.remove('translate-y-[-20px]', 'opacity-0');
        });
        
        setTimeout(() => {
            notification.classList.add('translate-y-[-20px]', 'opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            btn.click();
        }
    });