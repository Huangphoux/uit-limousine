#set heading(offset: 2)

= Nội dung bản tự đánh giá cá nhân
= Phần công việc cá nhân đã trực tiếp thực hiện trong nhóm
- Mục tiêu: Kiểm thử Dockerfile cho phần client của dự án UIT-LIMOUSINE, build image, chạy container độc lập và thu bằng chứng (ảnh chụp) để đính kèm vào báo cáo.

- Các bước thực hiện chính:
  - Kiểm tra cấu trúc thư mục client/ (có package.json, package-lock.json, src/, public/, index.html, vite.config.js, v.v.).
  - Kiểm tra nội dung Dockerfile hiện có và đề xuất chỉnh sửa (bổ sung COPY . . để đưa source vào image).
  - Thử build image và chạy container (nếu Docker có sẵn trên máy).
  - Khi gặp lỗi (Windows: 'docker' is not recognized...), thực hiện khắc phục (cài Docker Desktop / bật WSL2 / khởi động Docker).
  - Ghi lại các lệnh đã sử dụng, kết quả kiểm thử và chụp ảnh làm bằng chứng.
- Lệnh build image (tên image đã tạo):
  - Truy cập thư mục client/
    docker build -t client-app:latest .
  - Tên image: client-app:latest
- Lệnh chạy container:
  docker run --rm -d -p 5173:5173 --name client-container client-app:latest
- Kiểm tra ứng dụng hoạt động:
- Mở trình duyệt: http://localhost:5173 (hoặc http://<host-ip>:5173 nếu test trên máy khác).
- Kiểm tra logs:
  docker logs -f client-container

= Phần kiến thức cá nhân nắm rõ nhất trong bài thực hành
- Hiểu rõ workflow Docker cơ bản: Viết Dockerfile -> build image -> run container -> map port -> kiểm tra service.
- Hiểu vai trò từng phần trong Dockerfile
- Hiểu cách debug khi lỗi phát sinh

= Một khó khăn kỹ thuật đã gặp trong quá trình thực hiện và cách giải quyết
- Khó khăn: Khi chạy lệnh build trên máy Windows báo lỗi:
  The term 'docker' is not recognized as the name of a cmdlet, function, script file, or operable program.
- Nguyên nhân: Docker CLI/Docker Desktop chưa được cài hoặc Docker Desktop chưa chạy / PATH chưa cập nhật.
- Cách giải quyết:
  - Cài đặt Docker Desktop từ trang chính thức.
  - Nếu hệ điều hành là Windows Home, bật WSL2 và cài WSL2 backend (chạy các lệnh DISM nếu cần, khởi động lại máy).
  - Mở Docker Desktop và chờ trạng thái Docker is running. Mở lại terminal PowerShell / CMD và kiểm tra

= Tự đánh giá mức độ đóng góp của bản thân trong nhóm
- Mức độ đóng góp: 10%
- Đã hoàn thành công việc liên quan đến kiểm chứng việc chạy Dockerfile do \@OopsNooob đã chỉnh sửa trên máy khác
