# Quick Start - Tự Động Cập Nhật Bài Viết

## ⚡ Cách nhanh nhất

### Option 1: File Watcher (Khuyến nghị)
```bash
cd post
node watch-posts.js
```
Giữ terminal này mở, mỗi khi thêm file HTML vào `post/en/`, nó sẽ tự động cập nhật!

### Option 2: Cập nhật thủ công
```bash
cd post
node update-posts.js
```
Hoặc double-click `update-posts.bat` (Windows)

## 📝 Thêm bài viết mới

1. Tạo file HTML trong `post/en/` (ví dụ: `my-article.html`)
2. Đảm bảo có `<title>` và `<meta name="description">`
3. Chạy script cập nhật (hoặc file watcher sẽ tự động làm)
4. Refresh trang `index.html`

## ✅ Đã hoàn thành

- ✅ Không cần `data.js` nữa
- ✅ Tự động load từ `posts.json`
- ✅ Tự động sắp xếp bài viết mới nhất
- ✅ Highlight bài viết mới nhất

## 🔍 Kiểm tra

Sau khi chạy script, kiểm tra file `posts.json` đã được tạo/cập nhật chưa.

