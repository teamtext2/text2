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
const WORKER_URL = "https://cloudflare-llm.text2team.workers.dev"; // 🔥 Đổi thành URL Worker thật của bạn

let isRequesting = false;

// Character and word counter
input.addEventListener("input", () => {
  const text = input.value;
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  charCount.textContent = `${chars} characters`;
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
  charCount.textContent = "0 characters";
  wordCount.textContent = "0 words";
  resultContainer.classList.add("hidden");
  placeholder.classList.remove("hidden");
  copyBtn.classList.add("hidden");
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
      setTimeout(step, 10 + Math.random() * 20);
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
  loading.classList.remove("hidden");
  resultContainer.classList.add("hidden");
  placeholder.classList.add("hidden");
  output.textContent = "";
  outputSection.classList.remove("hidden"); // Show output section
  // Switch layout to two columns and align input to the left when result appears
  editorGrid.classList.remove("lg:grid-cols-1");
  editorGrid.classList.add("lg:grid-cols-2");
  inputSection.classList.remove("lg:max-w-3xl", "lg:mx-auto");

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

    // 👉 Worker trả về dạng { reply: { response: "..." } }
    let resultText = data?.reply?.response || data?.reply || "Không có phản hồi từ AI 😢";

    // Remove content within <think></think> tags
    resultText = resultText.replace(/<think>.*?<\/think>/gs, '');

    resultContainer.classList.remove("hidden");
    copyBtn.classList.remove("hidden");
    
    // Hiệu ứng gõ từng chữ
    typeOut(output, resultText);

  } catch (error) {
    console.error("Error:", error);
    output.textContent = "🚨 Lỗi: " + error.message;
    resultContainer.classList.remove("hidden");
    copyBtn.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
    isRequesting = false;
    btn.disabled = false;
  }
});

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm animate-fade-in-up`;
  
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600", 
    warning: "bg-yellow-600",
    info: "bg-blue-600"
  };
  
  notification.className += ` ${colors[type]} text-white`;
  
  const iconPaths = {
    success: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    error: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
  };
  
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <svg class="icon" viewBox="0 0 24 24">
        <path d="${iconPaths[type]}"/>
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    btn.click();
  }
});