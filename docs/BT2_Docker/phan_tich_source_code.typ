== Loại ứng dụng
- Ứng dụng web Full Stack
== Công nghệ sử dụng
- Ngôn ngữ lập trình: JavaScript
- Framework:
  - Client: #link("https://react.dev/")[React]
  - Server: #link("https://expressjs.com/")[Express]

== Cách chạy ứng dụng không sử dụng Docker
- Tải về #link("https://github.com/Huangphoux/uit-limousine/archive/refs/heads/main.zip")[source code] của đồ án

=== Dành cho người dùng Windows
- Truy cập thư mục `scripts`
- Nhấn đúp chuột để chạy các script sau
  - `0_download_node.bat`: Tải NVM, Node Version Manager, trình quản lý phiên bản của Node trên Windows.
  - `1_install_node.bat`: Tải Node phiên bản 22.18.0 (LTS)
  - `2_install_dependencies.bat`: Cài đặt các package phụ thuộc mà client, server và hệ thống cần để vận hành.
  - `4_dev.bat`: Cho client lẫn server chạy cùng lúc

== Port mà ứng dụng sử dụng
- Client: `5173`
- Server: `3000`

== Ứng dụng có sử dụng
- Database: #link("https://sqlite.org/np1queryprob.html")[SQLite]
- File upload: bài nộp của học viên sẽ được lưu tại `/server/uploads/submissions/{studentId}/{assignmentId}/`
