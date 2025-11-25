/**
 * Text2 Global Navigation
 * Tự động chèn Header và Menu App vào bất kỳ trang nào trong hệ sinh thái.
 * Yêu cầu: Phải nhúng js/data.js trước file này.
 */

(function() {
    // 1. Kiểm tra data
    if (typeof appData === 'undefined') {
        console.error("🚨 Text2 Error: Chưa load file data.js! Hãy nhúng data.js trước global-nav.js");
        return;
    }

    document.addEventListener("DOMContentLoaded", function() {
        initGlobalHeader();
    });

    function initGlobalHeader() {
        // CSS Style bổ sung cho cái Menu Dropdown (Vì trong styles.css gốc chưa có cái popup nhỏ này)
        const customStyle = `
            <style>
                /* Style cho nút Grid App */
                .text2-app-grid-btn {
                    background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; color: #fff;
                }
                .text2-app-grid-btn:hover { background: rgba(255,255,255,0.1); }
                
                /* Style cho Dropdown Menu */
                .text2-app-dropdown {
                    display: none;
                    position: fixed;
                    top: 50px; /* Chiều cao header + chút khoảng cách */
                    right: 20px;
                    width: 320px;
                    max-height: 80vh;
                    overflow-y: auto;
                    background: linear-gradient(135deg,#1e1e1e,#242424); /* Màu nền chuẩn Text2 */
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                    z-index: 10002;
                    padding: 15px;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }
                
                .text2-app-dropdown.active { display: grid; animation: fadeInDropdown 0.2s ease-out; }

                /* Style cho từng Icon trong Dropdown */
                .text2-app-item {
                    display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #fff; padding: 10px 5px; border-radius: 10px; transition: background 0.2s;
                }
                .text2-app-item:hover { background: rgba(79,195,247,0.2); }
                .text2-app-item img { width: 48px; height: 48px; border-radius: 10px; margin-bottom: 8px; object-fit: cover; }
                .text2-app-item span { font-size: 11px; text-align: center; color: #ccc; line-height: 1.2; }
                .text2-app-item:hover span { color: #fff; }

                @keyframes fadeInDropdown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Đẩy nội dung web xuống để không bị Header che mất */
                body { padding-top: 50px; } 
            </style>
        `;

        // HTML cấu trúc Header (Tận dụng class cũ của ông để ăn khớp CSS)
        const headerHTML = `
            <header style="position: fixed; top: 0; left: 0; width: 100%; z-index: 10000; box-sizing: border-box;">
                <div class="taskbar-left">
                    <a href="https://text2.pro" class="start-button" style="text-decoration:none;">
                        <img src="https://text2.pro/favicon.ico" alt="Text2 Logo" />
                        <span>Text2</span>
                    </a>
                </div>

                <div class="taskbar-right">
                    <button id="globalAppGridBtn" class="text2-app-grid-btn" title="Text2 Ecosystem">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                    
                    <div class="taskbar-icon" title="Notifications" onclick="alert('Tính năng đang phát triển ở Hub chính!')">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </div>
                </div>

                <div id="globalAppDropdown" class="text2-app-dropdown">
                    ${appData.map(app => `
                        <a href="${app.url}" class="text2-app-item">
                            <img src="${app.icon}" alt="${app.name}" loading="lazy">
                            <span>${app.name}</span>
                        </a>
                    `).join('')}
                </div>
            </header>
        `;

        // Inject vào đầu trang
        document.head.insertAdjacentHTML("beforeend", customStyle);
        document.body.insertAdjacentHTML("afterbegin", headerHTML);

        // Xử lý sự kiện bấm nút Grid
        const gridBtn = document.getElementById('globalAppGridBtn');
        const dropdown = document.getElementById('globalAppDropdown');

        gridBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Bấm ra ngoài thì đóng dropdown
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !gridBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

})();