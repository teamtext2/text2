(function () {
    if (window.__TEXT02_TRANSLATE__) return;
    window.__TEXT02_TRANSLATE__ = true;
  
    // ===== Overlay =====
    const overlay = document.createElement("div");
    overlay.innerHTML = `
    <div id="text02-overlay" style="
      position:fixed;inset:0;z-index:10000;
      display:flex;align-items:center;justify-content:center;
      backdrop-filter:blur(20px) saturate(160%);
      -webkit-backdrop-filter:blur(20px) saturate(160%);
      background:rgba(0,0,0,.4);
      font-family:system-ui,sans-serif;
    ">
      <div style="
        min-width:300px;
        padding:30px 28px;
        border-radius:26px;
        text-align:center;
        background:rgba(255,255,255,.95);
        box-shadow:0 20px 50px rgba(0,0,0,.4);
        color:#222;
      ">
        <div style="font-size:26px;">🌐</div>
        <div style="font-size:18px;font-weight:700;margin:6px 0;">Choose language</div>
        <div style="font-size:13px;color:#555;margin-bottom:16px;">
          Select your language to continue
        </div>
  
        <select id="text02-lang" style="
          width:100%;
          padding:12px 14px;
          border-radius:14px;
          border:1px solid #ddd;
          font-size:14px;
          margin-bottom:18px;
        ">
          <option value="vi">🇻🇳 Tiếng Việt</option>
          <option value="en">🇺🇸 English</option>
          <option value="ja">🇯🇵 日本語</option>
          <option value="ko">🇰🇷 한국어</option>
          <option value="zh-CN">🇨🇳 中文</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="es">🇪🇸 Español</option>
          <option value="pt">🇵🇹 Português</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="ar">🇸🇦 العربية</option>
          <option value="hi">🇮🇳 हिन्दी</option>
          <option value="th">🇹🇭 ไทย</option>
          <option value="id">🇮🇩 Bahasa Indonesia</option>
        </select>
  
        <button id="text02-start" style="
          width:100%;
          padding:12px;
          border-radius:16px;
          border:none;
          background:#111;
          color:#fff;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
        ">Start</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  
    // ===== Holder =====
    const holder = document.createElement("div");
    holder.style.cssText = `
      position:fixed;
      bottom:20px;
      right:20px;
      z-index:9999;
      display:none;
    `;
    holder.innerHTML = `<span id="google_translate_element"></span>`;
    document.body.appendChild(holder);
  
    // ===== Google init =====
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement(
        { pageLanguage: "vi", autoDisplay: false },
        "google_translate_element"
      );
    };
  
    const g = document.createElement("script");
    g.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(g);
  
    // ===== Core auto translate =====
    function translateNow(lang) {
      let tries = 0;
      const timer = setInterval(() => {
        const select = document.querySelector("select.goog-te-combo");
        if (select) {
          select.value = lang;
          select.dispatchEvent(new Event("change"));
          clearInterval(timer);
          console.log("[Text02] Translated to:", lang);
        }
        if (++tries > 40) clearInterval(timer);
      }, 400);
    }
  
    // ===== Button click =====
    document.getElementById("text02-start").onclick = function () {
      const lang = document.getElementById("text02-lang").value;
      localStorage.setItem("text02_lang", lang);
      document.getElementById("text02-overlay").style.display = "none";
      holder.style.display = "block";
  
      // 👉 DỊCH NGAY SAU KHI ẤN
      translateNow(lang);
    };
  
    // ===== If saved before =====
    const saved = localStorage.getItem("text02_lang");
    if (saved) {
      document.getElementById("text02-overlay").style.display = "none";
      holder.style.display = "block";
      translateNow(saved);
    }
  
    // ===== Hide Google bar =====
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate { display:none !important; }
      body { top:0 !important; }
      .goog-te-gadget span { display:none !important; }
    `;
    document.head.appendChild(style);
  
  })();
  