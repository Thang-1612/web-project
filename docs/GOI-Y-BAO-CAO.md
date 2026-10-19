# Gợi ý nội dung báo cáo - Vina Wear

## 1. Công nghệ
HTML5, CSS3, JavaScript thuần (không framework). Dữ liệu lưu bằng localStorage của trình duyệt. Triển khai bằng GitHub Pages.

## 2. Chức năng đã làm
Tìm kiếm không dấu; lọc theo danh mục, size, màu, khoảng giá; sắp xếp; yêu thích; so sánh sản phẩm; trang chi tiết sản phẩm; giỏ hàng; mã giảm giá (VINA10, FREESHIP); tính phí ship theo tỉnh; đặt hàng có kiểm tra dữ liệu; tra cứu đơn hàng; trang quản trị (thêm, sửa, xóa sản phẩm, đổi trạng thái đơn, thống kê doanh thu, xuất CSV).

## 3. Bảng kiểm thử gợi ý (tự chụp ảnh từng dòng)
| STT | Chức năng | Thao tác | Kết quả mong đợi |
|---|---|---|---|
| 1 | Tìm kiếm không dấu | Gõ "ao thun" | Hiện các áo thun |
| 2 | Lọc | Chọn size M, màu Đen | Chỉ hiện sản phẩm phù hợp |
| 3 | Chi tiết sản phẩm | Bấm vào ảnh | Mở hộp chi tiết |
| 4 | Mã giảm giá | Nhập VINA10 | Tổng tiền giảm đúng |
| 5 | Đặt hàng sai | Bỏ trống/nhập sai SĐT | Hiện thông báo lỗi |
| 6 | Đặt hàng đúng | Điền đủ thông tin | Hiện mã đơn VW000x |
| 7 | Tra cứu đơn | Nhập mã đơn + SĐT | Hiện trạng thái đơn |
| 8 | Quản trị | Đăng nhập, đổi trạng thái | Trạng thái cập nhật |
| 9 | Xuất CSV | Bấm "Xuất đơn hàng (CSV)" | Tải file mở được bằng Excel |

## 4. Hạn chế
- Dữ liệu (sản phẩm, đơn hàng) lưu trong trình duyệt của từng người, không dùng chung giữa các máy.
- Đăng nhập quản trị chỉ kiểm tra trong mã JavaScript nên chưa bảo mật.
- Chưa có thanh toán trực tuyến, chưa có tài khoản khách hàng, chưa quản lý tồn kho.
- Phường/xã, quận/huyện nhập tay, chưa có danh sách chọn theo tỉnh.
- Ảnh sản phẩm dùng đường dẫn tới file, chưa có chức năng tải ảnh lên.

## 5. Hướng phát triển
- Xây dựng backend (Node.js/Express hoặc dịch vụ như Firebase/Supabase) và cơ sở dữ liệu để dùng chung dữ liệu giữa nhiều người.
- Đăng nhập an toàn (mật khẩu băm, JWT/session), tính tiền và kiểm tra mã giảm giá ở phía máy chủ.
- Quản lý tồn kho theo từng size, tài khoản khách hàng, lịch sử mua hàng.
- Tích hợp thanh toán (VNPay, MoMo, PayOS) và gửi email/SMS xác nhận đơn.
- Danh sách địa giới hành chính đầy đủ đến phường/xã; biểu đồ thống kê doanh thu; kết nối Power BI từ file CSV.
