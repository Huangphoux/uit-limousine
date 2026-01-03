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
#image("../minh_chung/DockerClient.png")
  - Server: `server\Dockerfile`
#image("../minh_chung/DockerServer3.png")

- Thư mục root không cần Dockerfile do đã có tệp `docker-compose.yml`.

=== Giải thích Dockerfile của Client
#image("../minh_chung/DockerClient2.png")
  - FROM node:latest - Sử dụng image Node.js (nhãn latest) làm môi trường cơ bản để chạy và cài đặt các gói npm.
  - WORKDIR /app - Thiết lập thư mục làm việc bên trong container là /app. Mọi lệnh tiếp theo sẽ thực thi từ thư mục này.
  - COPY package\*.json ./ - Sao chép package.json và package-lock.json vào container. Mục đích là tách bước cài đặt phụ thuộc ra thành một layer riêng để tận dụng cache khi không thay đổi các file này.
  - RUN npm install - Chạy lệnh cài đặt tất cả dependencies được khai báo trong package.json. Sau bước này, node_modules sẽ được cài trong image.
  - COPY . .  - Copy toàn bộ mã nguồn từ thư mục gốc của dự án vào container.
  - EXPOSE 5173 - Khai báo rằng ứng dụng sẽ lắng nghe cổng 5173 (metadata cho người đọc và công cụ; vẫn cần map port khi chạy container).
  - CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] - Lệnh mặc định khi container khởi động: chạy dev server (ví dụ Vite) và truyền --host 0.0.0.0 để server lắng nghe mọi interface, cho phép truy cập từ bên ngoài container.

=== Giải thích Dockerfile của Server
#image("../minh_chung/DockerServer3.png")
  - FROM node:20 - Sử dụng image Node.js phiên bản 20 làm môi trường cơ bản.
  - WORKDIR /app - Đặt thư mục làm việc trong container là /app.
  - COPY package\*.json ./ - Copy các file package.json và package-lock.json từ thư mục gốc của dự án vào thư mục /app trong container.
  - COPY prisma ./prisma - Copy thư mục prisma từ dự án vào container.
  - RUN npm install - Cài đặt tất cả các dependencies được liệt kê trong package.json.
  - COPY . .  - Copy toàn bộ mã nguồn từ thư mục gốc của dự án vào container.
  - EXPOSE 3000 - Mở cổng 3000 trong container để ứng dụng có thể được truy cập từ bên ngoài.
  - CMD ["npm", "run", "dev"] - Chạy ứng dụng bằng lệnh npm run dev.

== Build Docker Image

=== Client
- Thực hiện build image từ Dockerfile
  - Lệnh build: docker build -t client-app:latest .
  - Tên image đã tạo: client-app:latest

=== Server
- Thực hiện build image từ Dockerfile
  - Lệnh build: docker build -t uit-limousine-server .
  - Tên image đã tạo: uit-limousine-server

== Chạy Docker container
- Chạy container từ image đã build
- Mapping port để có thể truy cập từ trình duyệt
- Kiểm tra ứng dụng hoạt động đúng
- Bắt buộc chụp màn hình ứng dụng đang chạy
#image("../minh_chung/DockerServer.png")
#image("../minh_chung/DockerServer2.png")
