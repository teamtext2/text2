(function(){
	// AI chat -> send query to Cloudflare Worker and show response
	const WORKER_URL = "https://backup-llm.giacmobongdatv.workers.dev"; // 🔥 Change to your actual Worker URL

	const promptEl = document.getElementById("searchInput");
	const sendBtn = document.getElementById("searchButton");
	const resultEl = document.getElementById("searchResults");

	if (!promptEl || !sendBtn || !resultEl) return;

	let isRequesting = false;

	async function sendPrompt() {
		if (isRequesting) return;
		const prompt = (promptEl.value || "").trim();
		if (!prompt) {
			resultEl.textContent = "⚠️ Please enter a question first!";
			return;
		}

		isRequesting = true;
		sendBtn.disabled = true;
		resultEl.innerHTML = '<span class="typing">⏳ Text2 AI is thinking...</span>';

		try {
			const res = await fetch(WORKER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt })
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

