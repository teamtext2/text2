# Hướng dẫn Tự Động Cập Nhật Bài Viết

## Tổng quan

Hệ thống tự động quét thư mục `post/en` và cập nhật danh sách bài viết trong `data.js`. Khi bạn thêm bài viết mới vào thư mục `post/en`, chỉ cần chạy script để cập nhật tự động.

## Cách sử dụng

### 1. Thêm bài viết mới

Khi bạn tạo bài viết mới trong thư mục `post/en`:
- Đảm bảo file HTML có các thẻ meta sau:
  - `<title>` - Tiêu đề bài viết
  - `<meta name="description">` - Mô tả ngắn
  - Hoặc có thông tin ngày tháng trong HTML (ví dụ: `<span>📅 November 21, 2025</span>`)

### 2. Chạy script cập nhật

Mở terminal và chạy lệnh:

```bash
cd post
node update-posts.js
```

Script sẽ:
- ✅ Quét tất cả file HTML trong thư mục `post/en`
- ✅ Trích xuất metadata (title, description, date)
- ✅ Sắp xếp bài viết theo ngày (mới nhất trước)
- ✅ Cập nhật file `js/data.js` tự động

### 3. Xem kết quả

Sau khi chạy script:
- File `js/data.js` sẽ được cập nhật với danh sách bài viết mới nhất
- Trang `index.html` sẽ tự động hiển thị bài viết mới nhất ở đầu danh sách
- Bài viết mới nhất từ thư mục `en` sẽ có badge "NEW" và được highlight

## Tính năng

### ✨ Tự động sắp xếp
- Bài viết được sắp xếp theo ngày (mới nhất trước)
- Bài viết tiếng Anh từ `post/en` được ưu tiên hiển thị

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

## Cấu trúc thư mục

```
post/
├── en/                          # Bài viết tiếng Anh
│   └── *.html                   # Các file HTML bài viết
├── vi/                          # Bài viết tiếng Việt
├── js/
│   └── data.js                  # File dữ liệu (tự động cập nhật)
├── update-posts.js              # Script cập nhật
└── index.html                   # Trang hiển thị danh sách
```

## Lưu ý

1. **Định dạng ngày**: Script hỗ trợ nhiều định dạng ngày, nhưng khuyến nghị sử dụng format chuẩn trong HTML
2. **Metadata**: Đảm bảo mỗi file HTML có ít nhất thẻ `<title>` để script có thể trích xuất thông tin
3. **Tên file**: Tên file sẽ được dùng làm URL, nên đặt tên file rõ ràng và không có ký tự đặc biệt

## Ví dụ

Khi bạn thêm file `post/en/my-new-article.html`, chạy:

```bash
node update-posts.js
```

Script sẽ tự động:
1. Đọc file `my-new-article.html`
2. Trích xuất title, description, date
3. Thêm vào danh sách trong `data.js`
4. Sắp xếp lại theo ngày
5. Hiển thị bài viết mới nhất ở đầu danh sách với badge "NEW"

## Troubleshooting

### Script không tìm thấy bài viết
- Kiểm tra file có đúng định dạng `.html`
- Đảm bảo file nằm trong thư mục `post/en`

### Ngày tháng không chính xác
- Thêm thông tin ngày vào HTML: `<span>📅 DD/MM/YYYY</span>`
- Hoặc script sẽ dùng file modification time

### Bài viết không hiển thị
- Kiểm tra file `data.js` đã được cập nhật chưa
- Refresh trang `index.html`
- Kiểm tra console browser để xem lỗi JavaScript

