const fs = require('fs');
const path = require('path');
const { updateDataFile } = require('./update-posts');

/**
 * File Watcher - Tự động cập nhật khi có file mới trong post/en
 * Chạy script này và nó sẽ tự động watch thư mục post/en
 * Mỗi khi có file HTML mới được thêm vào, sẽ tự động cập nhật posts.json
 */

const POST_EN_DIR = path.join(__dirname, 'en');

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(POST_EN_DIR)) {
    console.error(`❌ Thư mục ${POST_EN_DIR} không tồn tại!`);
    process.exit(1);
}

console.log('👀 Đang theo dõi thư mục post/en...');
console.log('   Thêm file HTML mới vào thư mục để tự động cập nhật.\n');

// Generate initial posts.json using update-posts.js
updateDataFile();

// Watch for file changes
fs.watch(POST_EN_DIR, { recursive: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.html')) {
        console.log(`\n📝 Phát hiện thay đổi: ${filename} (${eventType})`);
        setTimeout(() => {
            updateDataFile();
        }, 500); // Delay để đảm bảo file đã được ghi xong
    }
});

console.log('\n✨ File watcher đã sẵn sàng!');
console.log('   Nhấn Ctrl+C để dừng.\n');

