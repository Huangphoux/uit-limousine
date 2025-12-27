#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Công nghệ phần mềm chuyên sâu - SE214.Q11
Bài tập thực hành lần 2",
  doc-title: "Docker hóa và Deploy ứng dụng từ source code có sẵn",
  author: "Nhóm 5

23521224 Trương Hoàng Phúc
23521736 Bùi Văn Tùng
23520657 Vũ Quốc Huy
23520466 Tạ Hoàng Hiệp
23520682 Đỗ Đình Khang
23520448 Nguyễn Văn Hào
23520557 Dương Quốc Hưng",
  language: "vi",
  compact-mode: false,
  // heading-font: "New Computer Modern",
  heading-color: black,
  show-outline: true,
  it,
)

#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)
// #show raw: set text(font: "JetBrains Mono")
// #set text(font: "New Computer Modern")

#show link: underline


= Phần A: Phân tích source code
== Loại ứng dụng
- Ứng dụng web Full Stack
== Công nghệ sử dụng
- Ngôn ngữ lập trình: JavaScript
- Framework:
  - Front End: #link("https://react.dev/")[React]
  - Back End: #link("https://expressjs.com/")[Express]

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
== Ứng dụng có sử dụng
- Database hay không?
- File upload hay không?

= PHẦN B: DOCKER HÓA ỨNG DỤNG
5.1. Tạo Dockerfile
• Tạo file Dockerfile tại thư mục gốc của project
• Dockerfile phải:
o Cài đặt môi trường chạy phù hợp
o Copy source code
o Expose port cần thiết
o Chạy được ứng dụng
o Không hard-code thông tin nhạy cảm (mật khẩu, token).
5.2. Build Docker image
• Thực hiện build image từ Dockerfile
• Ghi rõ:
o Lệnh build
o Tên image đã tạo
5.3. Chạy Docker container
• Chạy container từ image đã build
• Mapping port để có thể truy cập từ trình duyệt
• Kiểm tra ứng dụng hoạt động đúng
• Bắt buộc chụp màn hình ứng dụng đang chạy

= PHẦN C: DEPLOY BẰNG DOCKER COMPOSE
• Tạo file docker-compose.yml
• Sử dụng Docker Compose để deploy:
o Ứng dụng
o (Nếu có) database hoặc service phụ trợ
• Hệ thống phải chạy được chỉ với một lệnh duy nhất: docker-compose up -d

= PHẦN D: BÁO CÁO VÀ ĐÁNH GIÁ ĐÓNG GÓP CÁ NHÂN
5.4. Báo cáo nhóm
Báo cáo nhóm phải trình bày:
• Phân tích source code
• Quá trình Docker hóa và deploy
• Kết quả đạt được (kèm hình ảnh minh chứng)
