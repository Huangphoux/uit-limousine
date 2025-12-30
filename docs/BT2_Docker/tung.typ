#set heading(offset: 2)

= Công việc cá nhân
- Thiết lập Docker cho server trong dự án Limousine
- Build Docker image cho server bằng lệnh: docker build -t uit-limousine-server .
- Chạy container từ image với cấu hình port mapping: docker run -d -p 8080:3000 --name uit-limousine-server uit-limousine-server
- Kiểm tra ứng dụng hoạt động trên localhost:8080 và ghi lại kết quả

= Kiến thức nắm rõ
- Hiểu được quy trình tạo Dockerfile, build image và chạy container
- Nắm vững cách sử dụng Docker trong quá trình deploy ứng dụng Node.js
- Biết cách ánh xạ port từ container ra máy tính để truy cập ứng dụng
- Hiểu mục đích của từng lệnh trong Dockerfile cho server

= Khó khăn gặp phải
- Docker Desktop không được cài đặt hoặc chưa thêm đường dẫn vào PATH
- Giải quyết bằng cách cài đặt Docker Desktop từ trang chính thức và kiểm tra với docker --version
- Ban đầu gặp lỗi khi container không nhận diện lệnh npm run dev, nhưng sau khi chạy npm install trong Dockerfile đã khắc phục

= Mức độ đóng góp
- 25% - Chịu trách nhiệm thiết lập và chạy server trên Docker, đảm bảo môi trường hoạt động đúng để các thành viên khác có thể test
