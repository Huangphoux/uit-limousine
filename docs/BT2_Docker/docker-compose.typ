- Tạo tệp `docker-compose.yml`
// #image("Để đường dẫn của hình ảnh vào đây")

- Sử dụng Docker Compose để deploy:
  - Ứng dụng
  - (Nếu có) database hoặc service phụ trợ
// #image("Để đường dẫn của hình ảnh vào đây")

- Hệ thống phải chạy được chỉ với một lệnh duy nhất: `docker-compose up -d`

== TODO
- Sửa lại `docker-compose.yml`
  - Đồ án không còn dùng Postgres nữa, mà xài SQLite trực tiếp trong `/server` luôn
