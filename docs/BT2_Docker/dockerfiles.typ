== Tạo tệp Dockerfile
- Tạo file Dockerfile tại thư mục gốc của project
- Dockerfile phải:
  - Cài đặt môi trường chạy phù hợp
  - Copy source code
  - Expose port cần thiết
  - Chạy được ứng dụng
  - Không hard-code thông tin nhạy cảm (mật khẩu, token).


- Các Dockerfile của hệ thống:
  - Client: `client\Dockerfile`
  // #image("Để đường dẫn của hình ảnh Dockerfile vào đây")
  - Server: `server\Dockerfile`
// #image("Để đường dẫn của hình ảnh Dockerfile vào đây")

- Thư mục root không cần Dockerfile do đã có tệp `docker-compose.yml`.

=== Giải thích Dockerfile của Client
// #image("Để đường dẫn của hình ảnh Dockerfile vào đây")

=== Giải thích Dockerfile của Server
// #image("Để đường dẫn của hình ảnh Dockerfile vào đây")


== Build Docker Image

=== Client
- Thực hiện build image từ Dockerfile
  - Lệnh build:
  - Tên image đã tạo:

=== Server
- Thực hiện build image từ Dockerfile
  - Lệnh build:
  - Tên image đã tạo:



== Chạy Docker container
- Chạy container từ image đã build
- Mapping port để có thể truy cập từ trình duyệt
- Kiểm tra ứng dụng hoạt động đúng
- Bắt buộc chụp màn hình ứng dụng đang chạy
// #image("Để đường dẫn của hình ảnh vào đây")

