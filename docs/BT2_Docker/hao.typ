#set heading(offset: 2)

= Công việc cá nhân
- Thiết lập file `docker-compose.yml` để quản lý đồng thời hai service: Client và Server
- Cấu hình Volume và biến môi trường (`CHOKIDAR_USEPOLLING`) để kích hoạt Hot Reload cho Frontend
- Build và chạy hệ thống bằng lệnh: `docker-compose up -d --build`
- Kiểm tra trạng thái container qua `docker ps` và xác nhận web chạy ổn định trên localhost

= Kiến thức nắm rõ
- Hiểu rõ cấu trúc Docker Compose để điều phối nhiều container cùng lúc
- Nắm vững cơ chế Volume Mapping để đồng bộ mã nguồn giữa máy host và container
- Biết cách sử dụng Anonymous Volume để tránh xung đột thư mục `node_modules`
- Hiểu cách debug lỗi cơ bản thông qua log của container

= Khó khăn gặp phải
- Gặp lỗi `EADDRINUSE: address already in use` do cổng 3000 bị chiếm dụng bởi tiến trình chạy ngầm
- Giải quyết bằng cách tắt các tiến trình Node.js đang chạy local hoặc dùng `docker-compose down` để giải phóng tài nguyên trước khi khởi động lại

= Mức độ đóng góp
- 25% - Chịu trách nhiệm xây dựng file Docker Compose hoàn chỉnh, đảm bảo môi trường phát triển (Dev Environment) chạy đồng bộ cho cả Client và Server
