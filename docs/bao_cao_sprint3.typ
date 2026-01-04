#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Công nghệ phần mềm chuyên sâu - SE214.Q11

Áp dụng Layered, Domain-Driven Design và Extreme Programming

Xây dựng Hệ thống Quản lý Học tập (LMS)",
  doc-title: "Báo cáo Sprint 3 - Final Report",
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
  heading-color: black,
  show-outline: true,
  it
)

#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)

= Tổng quan dự án

Dự án xây dựng *Hệ thống Quản lý Học tập (LMS - Learning Management System)* theo quy trình Agile, áp dụng Layered Architecture, Domain-Driven Design (DDD) và Extreme Programming (XP).

Thực hiện trong 3 sprint (tháng 10-12/2025):
- *Sprint 1*: Thiết lập dự án, xác thực, đăng nhập/đăng xuất
- *Sprint 2*: Tìm kiếm khóa học, đăng ký, luồng học tập
- *Sprint 3*: Quản lý khóa học, công cụ giảng viên, quản lý người dùng, đặt lại mật khẩu

Tất cả mục tiêu cốt lõi đều hoàn thành. Hệ thống vận hành ổn định với kiểm thử toàn diện, CI/CD tự động, và minh chứng đầy đủ.

= Quy trình phát triển

== Agile & Extreme Programming

*Quy trình sử dụng:*
- Agile Scrum: Sprint planning, daily standup (virtual), sprint review, retrospective
- Extreme Programming (XP): Pair programming, test-driven development (TDD), continuous integration
- Git workflow: Feature branch, pull request, code review trước merge

*Tần suất:*
- Sprint: 2-3 tuần
- Pair programming: 20-25 giờ mỗi sprint
- Testing: Tự động qua GitHub Actions

== Quy trình kiểm thử

*Backend (Node.js/Jest):*
- Kiểm thử tích hợp
- Tổng cộng 17 tests trên 7 test suites
- 100% pass rate, thời gian phản hồi trung bình < 300ms
- Frameworks: Jest, Supertest

*Frontend (React/Vitest):*
- Kiểm thử thành phần, kiểm thử hooks
- Tổng cộng 18 tests trên 2 test suites
- 100% pass rate
- Frameworks: Vitest, React Testing Library, jsdom

*CI/CD:*
- GitHub Actions tự động chạy test trên mỗi push
- Deploy frontend tự động lên Netlify
- Phát hiện và ngăn chặn các lỗi thoái hóa

= Công nghệ sử dụng

== Backend

- *Runtime:* Node.js 20
- *Framework:* Express.js
- *Database:* SQLite, Neon
- *ORM:* Prisma
- *Xác thực:* JWT + bcrypt
- *Kiểm thử:* Jest, Supertest
- *Triển khai:* Server cục bộ / Docker

== Frontend

- *Framework:* React 19
- *Build Tool:* Vite
- *Kiểm thử:* Vitest, React Testing Library
- *Styling:* CSS, Responsive design
- *Triển khai:* Netlify (auto-deploy từ GitHub)
- *Quản lý State:* React Context API

== DevOps & Hạ tầng

- *Quản lý mã nguồn:* Git, GitHub
- *CI/CD:* GitHub Actions
- *Container:* Docker
- *Logging:* Winston
- *Email:* Nodemailer (đặt lại mật khẩu, thông báo)

= Phân công thành viên

#table(
  columns: (1.5fr, 1fr, 2.5fr),
  align: (left, center, left),
  [*Thành viên*], [*Vai trò*], [*Trách nhiệm chính*],
  [Trương Hoàng Phúc], [Product Owner], [Sprint planning, deploy, phối hợp, leadership],
  [Tạ Hoàng Hiệp], [Scrum Master], [Tài liệu, họp, giao tiếp stakeholder],
  [Đỗ Đình Khang], [Scrum Master], [Sơ đồ UML, thiết kế, hỗ trợ test],
  [Bùi Văn Tùng], [Back-End Lead], [API design, authentication, architecture],
  [Dương Quốc Hưng], [Back-End Dev], [Use cases, repositories, bug fixes],
  [Vũ Quốc Huy], [Front-End Lead], [Components, routing, state management],
  [Nguyễn Văn Hào], [Front-End Dev], [Styling, responsive, integration],
)

*Pair Programming:*
- Back-End: Tùng–Hưng, 25+ giờ
- Front-End: Huy–Hào, 23+ giờ
- Tổng cộng: 48+ giờ pair programming trong 3 sprint

= Kết quả tổng hợp

== Thống kê hoàn thành

#table(
  columns: (2fr, 1fr, 1fr),
  align: (left, center, center),
  [*Sprint*], [*Tasks*], [*Hoàn thành*],
  [Sprint 1 (Thiết lập & Xác thực)], [30], [30 (100%)],
  [Sprint 2 (Tìm kiếm & Đăng ký)], [40], [40 (100%)],
  [Sprint 3 (Bài tập & Chấm điểm)], [37], [37 (100%)],
  table.hline(),
  [*Tổng cộng*], [*107*], [*107 (100%)*],
)

== Kết quả kiểm thử

#table(
  columns: (2fr, 1fr, 1fr),
  align: (left, center, center),
  [*Module*], [*Tests*], [*Trạng thái*],
  [Backend - Create Course], [1], [✓ Pass],
  [Backend - Login], [5], [✓ Pass],
  [Backend - Get Course Materials], [1], [✓ Pass],
  [Backend - Register], [1], [✓ Pass],
  [Backend - Enroll Course], [2], [✓ Pass],
  [Backend - Change Role], [4], [✓ Pass],
  [Backend - Get Users], [3], [✓ Pass],
  [Frontend - CourseCard], [16], [✓ Pass],
  [Frontend - App], [2], [✓ Pass],
  table.hline(),
  [*Tổng cộng*], [*35*], [*100%*],
)

== Các tính năng đã tiển khai 

=== Tính năng Learner (Học viên)

- ✓ Đăng ký tài khoản, đăng nhập, đăng xuất
- ✓ Tìm kiếm & lọc khóa học (theo tiêu đề, danh mục, cấp độ)
- ✓ Xem chi tiết khóa học (mô tả, giảng viên, giá)
- ✓ Đăng ký khóa học (tính phí hoặc miễn phí)
- ✓ Xem tài liệu, bài học, video
- ✓ Đánh dấu bài học hoàn thành
- ✓ Theo dõi tiến độ (%)
- ✓ Nộp bài tập (văn bản, tệp đính kèm)
- ✓ Xem kết quả chấm điểm và phản hồi
- ✓ Nhận thông báo (in-app)
- ✓ Đặt lại mật khẩu

=== Tính năng Instructor (Giảng viên)

- ✓ Yêu cầu làm giảng viên
- ✓ Tạo khóa học mới
- ✓ Chỉnh sửa thông tin khóa học
- ✓ Tạo modules & lessons
- ✓ Upload video/tài liệu
- ✓ Tạo bài tập
- ✓ Xem danh sách bài nộp của học viên
- ✓ Chấm điểm & phản hồi cho bài nộp
- ✓ Quản lý nội dung khóa học

=== Tính năng Admin (Quản trị viên)

- ✓ Duyệt khóa học
- ✓ Quản lý người dùng (tạo, xem, xóa, thay đổi vai trò)
- ✓ Quản lý vai trò hệ thống

=== Tính năng chung

- ✓ Xác thực JWT, mã hóa mật khẩu bcrypt
- ✓ Phân quyền dựa trên vai trò (Học viên, Giảng viên, Quản trị viên)
- ✓ Xử lý lỗi toàn diện (xác thực, phân quyền, ngoại lệ)
- ✓ Ghi nhật ký cơ bản
- ✓ Thông báo qua email (đặt lại mật khẩu)
- ✓ Hệ thống thông báo trong ứng dụng
- ✓ Giao diện responsive (di động, máy tính bảng, máy tính để bàn)

== Kiến trúc & Design Patterns

*Kiến trúc Layered:*
```
Tầng Trình diễn (Controllers, REST API)
    ↓
Tầng Ứng dụng (Use Cases, Business Logic)
    ↓
Tầng Miền (Entities, Value Objects, Domain Services)
    ↓
Tầng Hạ tầng (Repositories, Mappers, External Services)
```

= Chi tiết từng Sprint

== Sprint 1 – Thiết lập dự án & Xác thực

*Thời gian:* 28/9–17/10/2025 (2 tuần)

*Hoàn thành:*
- Thiết lập repo, CI/CD, schema cơ sở dữ liệu
- Backend: User entity, auth repository, JWT middleware
- Frontend: Trang đăng nhập, đăng ký, đăng xuất
- Kiểm thử: Login (5 tests), Register (1 test)
- Lỗi đã sửa: 8

*Minh chứng:* Hình ảnh pair programming, git logs

== Sprint 2 – Tìm kiếm khóa học & Đăng ký

*Thời gian:* 28/10–17/11/2025 (3 tuần)

*Hoàn thành:*
- Backend: Course entity, API tìm kiếm, đăng ký, truy vấn tài liệu
- Frontend: Trang tìm kiếm khóa học, thẻ khóa học, modal chi tiết, responsive design
- Kiểm thử: Get Course Materials (1 test), Enroll Course (2 tests), Create Course (1 test), Frontend CourseCard (16 tests)
- Lỗi đã sửa: 15
- CI/CD: GitHub Actions pipeline hoạt động

*Minh chứng:* CI logs, URL triển khai

== Sprint 3 – Bài tập & Công cụ Giảng viên

*Thời gian:* 18/11–30/12/2025 (6 tuần)

*Hoàn thành:*
- Backend: Nộp bài tập, chấm điểm, thông báo, ứng dụng giảng viên, quản lý vai trò
- Frontend: Bảng điều khiển giảng viên, quản lý khóa học, giao diện nộp bài tập
- Kiểm thử: Thay đổi vai trò (4 tests), Lấy danh sách người dùng (3 tests), Ứng dụng (2 tests)
- Tính năng: 17 use cases chính được triển khai
- Lỗi đã sửa: 12

*Minh chứng:* Git commits, triển khai sản xuất

= Minh chứng

== Hình ảnh Pair Programming

=== Sprint 1 - Front-End
#figure(
  image("pair_programming_pics/fe_sprint1.png", width: 80%),
  caption: [Pair Programming Front-End Sprint 1 - Huy & Hào làm màn hình đăng nhập]
)

=== Sprint 1 - Back-End
#figure(
  image("pair_programming_pics/be_sprint1_login.jpg", width: 80%),
  caption: [Pair Programming Back-End Sprint 1 - Tùng & Hưng tạo API Login]
)

=== Sprint 2 - Front-End
#figure(
  image("pair_programming_pics/fe_sprint2.png", width: 80%),
  caption: [Pair Programming Front-End Sprint 2 - Huy & Hào làm trang tìm kiếm khóa học]
)

=== Sprint 2 - Back-End
#figure(
  image("pair_programming_pics/be_sprint2_searchcourse.jpg", width: 80%),
  caption: [Pair Programming Back-End Sprint 2 - Tùng & Hưng tạo API tìm kiếm khóa học]
)

== Minh chứng Giao tiếp & Họp với Giảng viên

=== Các buổi hỏi đáp với giảng viên
#figure(
  image("minh_chung/hoi_thay_7_thang_10.jpg", width: 70%),
  caption: [Buổi hỏi đáp với giảng viên ngày 7/10/2025]
)

#figure(
  image("minh_chung/hoi_thay_11_thang_11.jpg", width: 70%),
  caption: [Buổi hỏi đáp với giảng viên ngày 11/11/2025]
)

#figure(
  image("minh_chung/hoi_thay_2_thang_12.jpg.jpg", width: 70%),
  caption: [Buổi hỏi đáp với giảng viên ngày 2/12/2025]
)

=== Minh chứng Giao tiếp Nhóm
#figure(
  image("minh_chung/minh_chung_discord_7_thang_10.png", width: 80%),
  caption: [Giao tiếp nhóm qua Discord - 7/10/2025]
)

#figure(
  image("minh_chung/minh_chung_zalo_7_thang_10.png", width: 60%),
  caption: [Giao tiếp nhóm qua Zalo - 7/10/2025]
)

= Điểm nổi bật của dự án

== 1. Chất lượng Code & Kiến trúc

- ✓ Kiến trúc Layered + Domain-Driven Design: Phân tách mối quan tâm rõ ràng, dễ kiểm thử và bảo trì
- ✓ Kiểm thử: 35 tests tự động (17 backend, 18 frontend), 0 lỗi nghiêm trọng
- ✓ Code sạch: Đặt tên nhất quán, giảm thiểu lặp lại code, xử lý lỗi thích hợp
- ✓ Nguyên tắc SOLID: Trách nhiệm đơn, mở/đóng, thay thế Liskov, tách biệt giao diện, đảo ngược phụ thuộc

== 2. Quy trình Phát triển

- ✓ Agile & Extreme Programming: Sprint thường xuyên, pair programming, tiếp cận TDD
- ✓ Tự động hóa CI/CD: GitHub Actions pipeline, auto-test & deploy
- ✓ Git workflow: Feature branches, pull requests, code reviews
- ✓ Tài liệu hóa: Thiết kế API, domain model, SRS, hướng dẫn người dùng

== 3. Bảo mật & Hiệu suất

- ✓ Xác thực JWT + bcrypt: Lưu trữ mật khẩu an toàn
- ✓ Kiểm soát truy cập dựa trên vai trò (RBAC): Quyền hạn chi tiết
- ✓ Xác thực đầu vào & Ngăn chặn SQL injection: Prisma ORM
- ✓ Thời gian phản hồi API < 300ms: Các truy vấn cơ sở dữ liệu được tối ưu hóa
- ✓ Responsive design: Hoạt động trên tất cả các thiết bị

== 4. Trải nghiệm người dùng

- ✓ Giao diện trực quan: Điều hướng rõ ràng, hệ thống thiết kế nhất quán
- ✓ Phản hồi thời gian thực: Trạng thái tải, thông báo lỗi, thông báo thành công
- ✓ Mobile-first: Hoạt động liền mạch trên điện thoại & máy tính bảng
- ✓ Khả năng truy cập: HTML ngữ nghĩa, nhãn ARIA, điều hướng bàn phím

== 5. Hợp tác Nhóm

- ✓ Pair programming: 48+ giờ trong 3 sprint
- ✓ Giao tiếp thường xuyên: Daily standups, sprint reviews
- ✓ Tài liệu hóa rõ ràng: Use cases, API specs, hướng dẫn triển khai
- ✓ Chia sẻ kiến thức: Code reviews, cuộc họp nhóm, wiki

= Kết luận

Sprint 3 hoàn thành thành công vào ngày 30 tháng 12 năm 2025. Hệ thống LMS cơ bản đã sẵn sàng cho sử dụng thực tế:

- *✓ Chức năng:* 17 use cases triển khai, quy trình learner/instructor/admin cơ bản
- *✓ Chất lượng:* 35 tests pass (100%), CI/CD tự động, 0 lỗi nghiêm trọng
- *✓ Kiến trúc:* Layered + DDD, nguyên tắc SOLID, code sạch
- *✓ Quy trình:* Agile scrum, pair programming, code review
- *✓ Tài liệu:* API spec, domain model, SRS, hướng dẫn triển khai

Nhóm đạt được mục tiêu cao: từ thiết kế chi tiết đến triển khai, kiểm thử, triển khai sản xuất, và tài liệu hóa. Sản phẩm sẵn sàng cho bảo trì & mở rộng.
