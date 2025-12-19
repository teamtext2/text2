# Hướng dẫn Tự Động Cập Nhật Bài Viết (Không cần data.js)

## Tổng quan

Hệ thống tự động quét thư mục `post/en` và tạo file `posts.json`. Trang `index.html` sẽ tự động load từ file JSON này. **Không cần file `data.js` nữa!**

## Cách hoạt động

1. **File Watcher** (`watch-posts.js`): Tự động theo dõi thư mục `post/en` và cập nhật `posts.json` mỗi khi có file mới
2. **Manual Update** (`update-posts.js`): Script để cập nhật thủ công khi cần
3. **Auto Load**: Trang `index.html` tự động load từ `posts.json`

## Cách sử dụng

### Phương pháp 1: File Watcher (Tự động hoàn toàn)

Chạy file watcher để tự động cập nhật mỗi khi có file mới:

```bash
cd post
node watch-posts.js
```

File watcher sẽ:
- ✅ Tự động phát hiện khi có file HTML mới được thêm vào `post/en`
- ✅ Tự động cập nhật `posts.json`
- ✅ Chạy liên tục cho đến khi bạn nhấn Ctrl+C

**Lưu ý**: Giữ terminal này mở khi bạn đang làm việc với bài viết.

### Phương pháp 2: Cập nhật thủ công

Khi bạn thêm bài viết mới, chạy script một lần:

```bash
cd post
node update-posts.js
```

Hoặc double-click vào file `update-posts.bat` (Windows)

### Phương pháp 3: Tự động khi deploy (CI/CD)

Nếu bạn có CI/CD pipeline, thêm script này vào build process:

```bash
cd post && node update-posts.js
```

## Thêm bài viết mới

1. **Tạo file HTML** trong thư mục `post/en/`
   - Ví dụ: `post/en/my-new-article.html`

2. **Đảm bảo file có metadata**:
   ```html
   <title>Tiêu đề bài viết</title>
   <meta name="description" content="Mô tả ngắn về bài viết">
   ```
   
   Hoặc có thông tin ngày tháng:
   ```html
   <span>📅 December 19, 2025</span>
   ```

3. **Chạy script cập nhật**:
   - Nếu đang chạy file watcher: Tự động cập nhật
   - Nếu không: Chạy `node update-posts.js`

4. **Refresh trang**: Trang `index.html` sẽ tự động hiển thị bài viết mới

## Tính năng

### ✨ Tự động sắp xếp
- Bài viết được sắp xếp theo ngày (mới nhất trước)
- File `posts.json` được cập nhật tự động

### 🎯 Highlight bài mới nhất
- Bài viết mới nhất từ thư mục `en` sẽ có:
  - Badge "NEW" màu xanh ở góc trên bên phải
  - Border và background được highlight
  - Tiêu đề màu accent (cyan)

### 📅 Xử lý ngày tháng
Script tự động:
- Trích xuất ngày từ HTML (nếu có)
- Sử dụng file modification time nếu không tìm thấy ngày trong HTML
- Format ngày theo định dạng DD/MM/YYYY

## Cấu trúc file

```
post/
├── en/                          # Bài viết tiếng Anh
│   └── *.html                   # Các file HTML bài viết
├── posts.json                   # File dữ liệu (tự động tạo)
├── watch-posts.js               # File watcher (tự động cập nhật)
├── update-posts.js              # Script cập nhật thủ công
├── update-posts.bat             # Batch file cho Windows
└── index.html                   # Trang hiển thị (load từ posts.json)
```

## Lưu ý

1. **File `posts.json`**: File này được tự động tạo và cập nhật, không cần chỉnh sửa thủ công
2. **Metadata**: Đảm bảo mỗi file HTML có ít nhất thẻ `<title>` để script có thể trích xuất thông tin
3. **Tên file**: Tên file sẽ được dùng làm URL, nên đặt tên file rõ ràng và không có ký tự đặc biệt
4. **Cache**: Trình duyệt có thể cache `posts.json`, nên khi test có thể cần hard refresh (Ctrl+F5)

## Troubleshooting

### File watcher không hoạt động
- Kiểm tra Node.js đã được cài đặt chưa
- Đảm bảo thư mục `post/en` tồn tại
- Kiểm tra quyền truy cập file

### Bài viết không hiển thị
- Kiểm tra file `posts.json` đã được tạo/cập nhật chưa
- Refresh trang với hard refresh (Ctrl+F5)
- Kiểm tra console browser để xem lỗi JavaScript
- Đảm bảo file HTML có đúng định dạng và metadata

### Ngày tháng không chính xác
- Thêm thông tin ngày vào HTML: `<span>📅 DD/MM/YYYY</span>`
- Hoặc script sẽ dùng file modification time

## Ví dụ workflow

```bash
# 1. Mở terminal và chạy file watcher
cd post
node watch-posts.js

# 2. Trong một terminal khác hoặc file explorer, thêm file mới vào post/en/
# Ví dụ: post/en/my-article.html

# 3. File watcher tự động phát hiện và cập nhật posts.json

# 4. Refresh trang index.html để xem bài viết mới
```

## Tự động hóa với Git Hooks

Bạn có thể thêm Git hook để tự động chạy script khi commit:

`.git/hooks/post-commit`:
```bash
#!/bin/sh
cd post && node update-posts.js
```

Hoặc với pre-commit:
`.git/hooks/pre-commit`:
```bash
#!/bin/sh
cd post && node update-posts.js
git add posts.json
```
