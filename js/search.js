(function(){
	// AI chat -> send query to Cloudflare Worker and show response
	const WORKER_URL = "https://backup-llm.giacmobongdatv.workers.dev"; // 🔥 Change to your actual Worker URL

	const promptEl = document.getElementById("searchInput");
	const sendBtn = document.getElementById("searchButton");
	const resultEl = document.getElementById("searchResults");

	// Shortcuts map — add more entries here as needed
	const SHORTCUTS = {
		'1412': 'kaito kid',
		'nhật anh đẹp trai': 'link nè mấy xếp: à quên từ từ chờ xíu quên cập nhật ròi',
		'adobe': 'https://text02.com/redirect/adobe-free.html',
		'Adobe': 'https://text02.com/redirect/adobe-free.html',
		'kỳ duyên': 'bạn của nhật anh'
	};

	if (!promptEl || !sendBtn || !resultEl) return;

	let isRequesting = false;

	async function sendPrompt() {
		if (isRequesting) return;
		const prompt = (promptEl.value || "").trim();
		if (!prompt) {
			resultEl.textContent = "⚠️ Please enter a question first!";
			return;
		}

		// Shortcut handling:
		// - Define a new shortcut using the format: "code:response" (e.g. "9999:hello world").
		//   This will save the mapping in `SHORTCUTS` for the current session.
		// - Trigger a saved shortcut by sending exactly the code (e.g. "1412").
		const colonIndex = prompt.indexOf(':');
		if (colonIndex > 0) {
			const key = prompt.slice(0, colonIndex).trim();
			const val = prompt.slice(colonIndex + 1).trim();
			if (key && val) {
				SHORTCUTS[key] = val;
				resultEl.textContent = `Shortcut saved: ${key} → ${val}`;
				return;
			}
		}
		if (Object.prototype.hasOwnProperty.call(SHORTCUTS, prompt)) {
			// Use the existing typing effect for shortcuts too
			typeOut(resultEl, SHORTCUTS[prompt]);
			return;
		}

		isRequesting = true;
		sendBtn.disabled = true;
		resultEl.innerHTML = '<span class="typing">⏳ Text2 AI is thinking...</span>';

		// Instruction to append to the user's original prompt. Keeps original question unchanged.
		const appendedInstruction = "reply in the user's national language and reply briefly and Respond as you are Text2 — someone is asking you.";
		const fullPrompt = prompt + '\n\n' + appendedInstruction;

		try {
			const res = await fetch(WORKER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				// send the original question + the appended instruction
				body: JSON.stringify({ prompt: fullPrompt })
			});

			if (!res.ok) {
				const errText = await res.text();
				throw new Error(`Server error (${res.status}): ${errText}`);
			}

			const data = await res.json();

			// 👉 Worker returns format { reply: { response: "..." } }
			const text = (data && data.reply && data.reply.response) ? data.reply.response : (data && data.reply) ? data.reply : "No response from AI 😢";

			// Typing effect character by character
			typeOut(resultEl, String(text));

		} catch (err) {
			resultEl.textContent = "🚨 Error: " + (err && err.message ? err.message : String(err));
		} finally {
			isRequesting = false;
			sendBtn.disabled = false;
		}
	}

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

	// Attach events
	sendBtn.addEventListener("click", sendPrompt);
	// Support pressing Enter on input
	promptEl.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			sendPrompt();
		}
	});
})();

