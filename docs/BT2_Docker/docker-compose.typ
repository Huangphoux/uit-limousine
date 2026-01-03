- Tạo tệp `docker-compose.yml`
#image("../minh_chung/DockerCompose.png")

- Sử dụng Docker Compose để deploy:
  - Ứng dụng
  - (Nếu có) database hoặc service phụ trợ
#image("../minh_chung/DockerCompose2.png")

- Hệ thống phải chạy được chỉ với một lệnh duy nhất: `docker-compose up -d`

=== Giải thích docker-compose.yml
#image("../minh_chung/DockerCompose.png")
- services: - Khai báo danh sách các service (container) sẽ được Docker Compose
quản lý và triển khai trong hệ thống.
- lms_server: - Định nghĩa service backend của hệ thống.
- container_name: lms_server - Đặt tên container backend là lms_server để dễ quản lý và nhận diện.
- build: ./server - Chỉ định Docker build image từ thư mục ./server. Docker sẽ sử dụng Dockerfile trong thư mục này để tạo image backend.
- ports: - Khai báo các cổng được ánh xạ giữa máy host và container.
- "3000:3000" -  Ánh xạ cổng 3000 của máy host vào cổng 3000 của container,
cho phép truy cập backend thông qua http://localhost:3000.
- volumes: - Khai báo các volume dùng để chia sẻ dữ liệu giữa host và container.
- ./server:/app - Gắn thư mục mã nguồn ./server trên máy host vào thư mục /app trong container,
giúp đồng bộ mã nguồn trong quá trình phát triển.
- /app/node_modules - Tạo volume riêng cho thư mục node_modules trong container,
tránh việc thư mục node_modules trên host ghi đè lên node_modules trong container.
- env_file: - Khai báo file chứa các biến môi trường cho container.
- ./server/.env - Nạp các biến môi trường từ file .env trong thư mục server
vào container backend khi khởi động.
- lms_client: - Định nghĩa service frontend của hệ thống.
- container_name: lms_client - Đặt tên container frontend là lms_client.
- build: ./client - Chỉ định Docker build image từ thư mục ./client,
nơi chứa Dockerfile của frontend.
- ports: - Khai báo các cổng được ánh xạ cho frontend.
- "5173:5173" - Ánh xạ cổng 5173 của máy host vào cổng 5173 của container,
cho phép truy cập frontend qua địa chỉ http://localhost:5173.
- volumes: - Khai báo các volume dùng cho frontend.
- ./client:/app - Gắn thư mục mã nguồn frontend từ host vào thư mục /app trong container,
hỗ trợ cơ chế hot reload khi phát triển.
- /app/node_modules - Tạo volume riêng cho thư mục node_modules trong container frontend,
tránh xung đột dependency với máy host.
- environment: - Khai báo các biến môi trường cho container frontend.
- NODE_ENV=development - Thiết lập môi trường chạy ứng dụng Node.js ở chế độ development.
- CHOKIDAR_USEPOLLING=true - Bật chế độ polling để theo dõi thay đổi file,
giúp hot reload hoạt động ổn định trong Docker.
- CHOKIDAR_INTERVAL=1000 - Thiết lập chu kỳ polling là 1000ms (1 giây).
- VITE_FORCE_HMR=true -   Ép Vite sử dụng cơ chế Hot Module Replacement
để tự động reload giao diện khi mã nguồn thay đổi.
- depends_on: - Khai báo sự phụ thuộc giữa các service.
- lms_server: - Chỉ định rằng service lms_client chỉ khởi động sau khi lms_server
đã được khởi động.
=== Lệnh để build image và tên image đã được tạo ra
- Lệnh build tất cả service: docker-compose build
- Kiểm tra image đã được tạo: docker images
- Tên image đã tạo: uit-limousine-lms_client và uit-limousine-lms_server
=== Chạy Docker container
#image("../minh_chung/DockerCompose3.png")
