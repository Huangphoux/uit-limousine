#set heading(offset: 2)

= Nội dung bản tự đánh giá cá nhân
= Phần công việc cá nhân đã trực tiếp thực hiện trong nhóm
- Build Docker image cho server với lệnh:
  ```bash
  docker build -t uit-limousine-server .
  ```
- Chạy container từ image đã build:
  ```bash
  docker run -d -p 8080:3000 --name uit-limousine-server uit-limousine-server
  ```
- Kiểm tra ứng dụng hoạt động đúng trên localhost (http://localhost:8080).
- Đính kèm hình ảnh minh chứng vào báo cáo.

= Phần kiến thức cá nhân nắm rõ nhất trong bài thực hành
- Nắm được khái niệm và ứng dụng của Docker.
- Docker image và container:
  - Hiểu cách tạo image từ Dockerfile.
  - Hiểu cách chạy container từ image.
- Quy trình deploy:
  - Từ viết Dockerfile, build image, chạy container, đến kiểm tra ứng dụng.

= Một khó khăn kỹ thuật đã gặp trong quá trình thực hiện và cách giải quyết
- Khó khăn: Lỗi không nhận diện lệnh `docker` do Docker chưa được cài đặt hoặc chưa thêm vào `PATH`.
- Cách giải quyết:
  - Cài đặt Docker Desktop từ trang chính thức.
  - Thêm đường dẫn Docker vào biến môi trường `PATH`.
  - Kiểm tra lại bằng lệnh `docker --version`.

= Tự đánh giá mức độ đóng góp của bản thân trong nhóm
- Mức độ đóng góp: 10%
- Đã hoàn thành công việc liên quan đến Dockerfile và kiểm chứng ứng dụng.
