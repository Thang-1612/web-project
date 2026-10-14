# Vina Wear - website bán quần áo mẫu

## Cấu trúc thư mục
vina-wear/
├── index.html      (khung trang, cửa sổ giỏ hàng/so sánh/quản trị)
├── css/style.css   (giao diện, hỗ trợ chế độ sáng/tối theo hệ thống)
├── js/app.js       (toàn bộ logic: lọc, giỏ hàng, đặt hàng, quản trị)
└── README.md

## Thư viện phụ thuộc
Không có thư viện JavaScript hay framework. Chỉ dùng JavaScript thuần.
Duy nhất một tài nguyên ngoài: phông Be Vietnam Pro từ Google Fonts (cần Internet).
Khi offline, trình duyệt tự dùng phông hệ thống, chức năng không ảnh hưởng.

## Cách chạy trên Windows
Cách 1: bấm đúp index.html (Chrome, Edge hoặc Firefox bản mới).
Cách 2 (khuyên dùng khi phát triển): mở PowerShell trong thư mục vina-wear, chạy
    python -m http.server 8000
rồi mở http://localhost:8000

## Đã có code triển khai
- Tìm kiếm không dấu; lọc danh mục, size, màu, khoảng giá; sắp xếp
- Yêu thích (lưu localStorage); so sánh 2-3 sản phẩm
- Giỏ hàng: thêm, tăng/giảm, xóa; mã VINA10 (-10%) và FREESHIP
- Phí vận chuyển: 20.000đ (TP.HCM, Hà Nội), 35.000đ (nơi khác), miễn phí từ 500.000đ
- Biểu mẫu đặt hàng có kiểm tra hợp lệ; đơn lưu vào localStorage
- Quản trị (admin / 123456): thêm/xóa sản phẩm, xem đơn, đổi trạng thái, tổng doanh thu

## Cần backend hoặc chưa có
- Đăng nhập chỉ là so sánh chuỗi trong JavaScript, KHÔNG bảo mật. Cần backend thật.
- Dữ liệu sản phẩm, đơn hàng, giỏ hàng nằm trong localStorage của từng trình duyệt,
  không chia sẻ giữa các máy. Cần cơ sở dữ liệu + API.
- Chưa có thanh toán trực tuyến (chỉ ghi nhận "thanh toán khi nhận"), chưa gửi email/SMS.
- Chưa có ảnh sản phẩm thật (hình áo vẽ bằng SVG theo màu), chưa có tải ảnh lên.
- Chưa có tài khoản khách hàng, chưa theo dõi tồn kho.
- Địa chỉ chỉ có 5 nhóm tỉnh/thành mẫu với vài quận/huyện, chưa đủ 34 tỉnh/thành, chưa có phường/xã.
- Chưa xuất dữ liệu ra Excel/CSV cho Power BI.
- Nút "So sánh" chỉ lưu tạm trong phiên, tải lại trang sẽ mất.
