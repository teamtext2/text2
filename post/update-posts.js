const fs = require('fs');
const path = require('path');

/**
 * Script tự động quét thư mục post/en và cập nhật data.js
 * Chạy script này mỗi khi có bài viết mới được thêm vào
 */

const POST_EN_DIR = path.join(__dirname, 'en');
const DATA_JS_PATH = path.join(__dirname, 'js', 'data.js');

/**
 * Đọc và parse HTML file để lấy metadata
 */
function extractMetadata(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath, '.html');
        
        // Extract title từ <title> tag
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : fileName;
        
        // Extract description từ meta description
        const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        const desc = descMatch ? descMatch[1].trim() : '';
        
        // Extract date từ meta-info trong HTML hoặc dùng file modification time
        let dateStr = '';
        const dateMatch = content.match(/<span[^>]*>📅\s*(.*?)<\/span>/i) || 
                         content.match(/<meta\s+property=["']article:published_time["']\s+content=["'](.*?)["']/i) ||
                         content.match(/<meta\s+name=["']date["']\s+content=["'](.*?)["']/i);
        
        if (dateMatch) {
            dateStr = dateMatch[1].trim();
            // Convert date format nếu cần
            try {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    // Format: DD/MM/YYYY
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    dateStr = `${day}/${month}/${year}`;
                }
            } catch (e) {
                // Giữ nguyên format gốc nếu không parse được
            }
        } else {
            // Dùng file modification time làm fallback
            const stats = fs.statSync(filePath);
            const date = new Date(stats.mtime);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            dateStr = `${day}/${month}/${year}`;
        }
        
        return {
            title,
            desc: desc || title,
            url: `./en/${fileName}.html`,
            date: dateStr
        };
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Quét thư mục post/en để lấy tất cả các file HTML
 */
function scanPostDirectory() {
    const posts = [];
    
    if (!fs.existsSync(POST_EN_DIR)) {
        console.error(`Directory ${POST_EN_DIR} does not exist!`);
        return posts;
    }
    
    const files = fs.readdirSync(POST_EN_DIR);
    
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(POST_EN_DIR, file);
            const metadata = extractMetadata(filePath);
            
            if (metadata) {
                posts.push(metadata);
            }
        }
    });
    
    // Sắp xếp theo ngày (mới nhất trước)
    posts.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA; // Descending order
    });
    
    return posts;
}

/**
 * Parse date string DD/MM/YYYY thành Date object
 */
function parseDate(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(0); // Fallback
}

/**
 * Đọc các bài viết từ các thư mục khác (vi, hoanhatanh, etc.)
 */
function getOtherPosts() {
    const otherPosts = [];
    const postDir = __dirname;
    
    // Bài viết tiếng Việt
    const viDir = path.join(postDir, 'vi');
    if (fs.existsSync(viDir)) {
        const viFiles = fs.readdirSync(viDir);
        viFiles.forEach(file => {
            if (file.endsWith('.html')) {
                const filePath = path.join(viDir, file);
                const metadata = extractMetadata(filePath);
                if (metadata) {
                    metadata.url = `./vi/${file}`;
                    otherPosts.push(metadata);
                }
            } else if (fs.statSync(path.join(viDir, file)).isDirectory()) {
                // Thư mục con
                const indexPath = path.join(viDir, file, 'index.html');
                if (fs.existsSync(indexPath)) {
                    const metadata = extractMetadata(indexPath);
                    if (metadata) {
                        metadata.url = `./vi/${file}/index.html`;
                        otherPosts.push(metadata);
                    }
                }
            }
        });
    }
    
    // Các bài viết khác
    const otherDirs = ['hoanhatanh', 'sinh-nhat-ky-duyen'];
    otherDirs.forEach(dir => {
        const dirPath = path.join(postDir, dir);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            const indexPath = path.join(dirPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                const metadata = extractMetadata(indexPath);
                if (metadata) {
                    metadata.url = `./${dir}/index.html`;
                    otherPosts.push(metadata);
                }
            }
        }
    });
    
    return otherPosts;
}

/**
 * Cập nhật file data.js
 */
function updateDataFile() {
    const enPosts = scanPostDirectory();
    const otherPosts = getOtherPosts();
    
    // Gộp tất cả bài viết và sắp xếp lại
    const allPosts = [...enPosts, ...otherPosts];
    allPosts.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA; // Mới nhất trước
    });
    
    // Tạo nội dung file data.js
    const config = {
        siteName: "Text2 Posts",
        siteLogo: "../../logoc.png",
        footerText: "© 2024 Text2. All rights reserved."
    };
    
    let content = 'export const posts = [\n';
    allPosts.forEach((post, index) => {
        content += '    {\n';
        content += `        title: ${JSON.stringify(post.title)},\n`;
        content += `        desc: ${JSON.stringify(post.desc)},\n`;
        content += `        url: ${JSON.stringify(post.url)},\n`;
        content += `        date: ${JSON.stringify(post.date)}\n`;
        content += '    }';
        if (index < allPosts.length - 1) {
            content += ',';
        }
        content += '\n';
    });
    content += '];\n\n';
    content += 'export const config = {\n';
    content += `    siteName: ${JSON.stringify(config.siteName)},\n`;
    content += `    siteLogo: ${JSON.stringify(config.siteLogo)},\n`;
    content += `    footerText: ${JSON.stringify(config.footerText)}\n`;
    content += '};\n';
    
    // Ghi file
    fs.writeFileSync(DATA_JS_PATH, content, 'utf-8');
    
    console.log(`✅ Đã cập nhật ${allPosts.length} bài viết vào data.js`);
    console.log(`   - Bài viết tiếng Anh (en): ${enPosts.length}`);
    console.log(`   - Bài viết khác: ${otherPosts.length}`);
    if (enPosts.length > 0) {
        console.log(`\n📌 Bài viết mới nhất: "${enPosts[0].title}" (${enPosts[0].date})`);
    }
}

// Chạy script
if (require.main === module) {
    console.log('🔄 Đang quét thư mục post/en...\n');
    updateDataFile();
    console.log('\n✨ Hoàn thành!');
}

module.exports = { updateDataFile, scanPostDirectory };

