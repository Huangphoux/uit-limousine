#import "@preview/diatypst:0.8.0": *

#show: slides.with(
  title: "Hệ thống Quản lý Học tập (LMS)",
  subtitle: "SE214.Q11 - Công nghệ phần mềm chuyên sâu",
  date: "30/12/2025",
  authors: "Nhóm 5: Trương Hoàng Phúc, Bùi Văn Tùng, Vũ Quốc Huy, Tạ Hoàng Hiệp, Đỗ Đình Khang, Nguyễn Văn Hào, Dương Quốc Hưng",
  
  ratio: 16 / 9,
  layout: "medium", 
  title-color: navy,
  toc: false,
  theme: "full",
  count: "number",
)

== Mục tiêu dự án

- Xây dựng hệ thống quản lý học tập (LMS) hoàn chỉnh
- Áp dụng Kiến trúc Phân tầng + Thiết kế Hướng miền (DDD)
- Thực hành Lập trình Cực hạn (XP): TDD, Pair Programming, CI/CD
- Thực hiện trong 3 sprint (28/9 - 30/12/2025)
- Kết quả: 35 tests đạt (100%), 17 use cases, 0 lỗi nghiêm trọng

== Quy trình phát triển

*Agile Scrum*
- Lập kế hoạch sprint, daily standup, sprint review, retrospective
- 3 sprint × 2-3 tuần

*Extreme Programming*
- Pair programming: 48+ giờ (BE: 25h, FE: 23h)
- Test-Driven Development (TDD)
- Continuous Integration: GitHub Actions

*Git Workflow*
- Feature branch → Pull Request → Code Review → Merge

== Công nghệ Backend & Frontend

*Backend*
- Runtime: Node.js 20 | Framework: Express.js
- Cơ sở dữ liệu: SQLite (phát triển), Neon PostgreSQL (sản xuất)
- ORM: Prisma | Xác thực: JWT + bcrypt
- Email: Nodemailer | Ghi nhật ký: Winston
- Kiểm thử: Jest + Supertest (17 tests)

*Frontend*
- Framework: React 19 | Công cụ Build: Vite
- Quản lý State: Context API | Styling: CSS responsive
- Kiểm thử: Vitest + React Testing Library (18 tests)
- Triển khai: Netlify (tự động deploy)

== Kiến trúc & Design Patterns

*Kiến trúc Phân tầng*
- Tầng Trình diễn: Controllers, REST API
- Tầng Ứng dụng: Use Cases, Business Logic
- Tầng Miền: Entities, Domain Services
- Tầng Hạ tầng: Repositories, Mappers

*Mẫu Thiết kế*
- Repository Pattern: Trừu tượng hóa truy cập dữ liệu
- Mapper Pattern: Chuyển đổi DTOs ↔ Entities
- Factory Pattern: Composition root
- Middleware Pattern: Xác thực, ghi nhật ký
- Observer Pattern: Thông báo

== Sprint 1 - Thiết lập & Xác thực

*Thời gian:* 28/9–17/10/2025 (2 tuần)

*Hoàn thành:*
- User entity, JWT authentication, mã hóa bcrypt
- Trang Đăng nhập, Đăng ký, Đăng xuất
- Thiết lập Git + CI/CD pipeline
- Đăng nhập (5 tests), Đăng ký (1 test)

*Công nghệ:* Node.js, React, Prisma, GitHub Actions

== Sprint 2 - Tìm kiếm & Đăng ký

*Thời gian:* 28/10–17/11/2025 (3 tuần)

*Hoàn thành:*
- Course entity, API tìm kiếm, đăng ký khóa học
- Thẻ khóa học, trang tìm kiếm, modal chi tiết
- Tìm kiếm tài liệu & bài học, theo dõi tiến độ
- Đăng ký (2 tests), Lấy tài liệu (1 test), Tạo khóa học (1 test), CourseCard (16 tests)
- Thiết kế responsive
- CI/CD tự động

*Công nghệ:* Supertest, Vitest, React Testing Library

== Sprint 3 - Bài tập & Công cụ GV

*Thời gian:* 18/11–30/12/2025 (6 tuần)

*Hoàn thành:*
- Hệ thống nộp bài tập và chấm điểm
- Bảng điều khiển giảng viên, quản lý khóa học
- Hệ thống thông báo trong ứng dụng
- Quản lý vai trò (Học viên, Giảng viên, Quản trị viên)
- Quản lý người dùng, duyệt khóa học
- Thay đổi vai trò (4 tests), Lấy người dùng (3 tests), Ứng dụng (2 tests)
- 17 use cases triển khai

*Công nghệ:* Prisma migrations, phân quyền theo vai trò

== Tính năng Learner & Instructor

*Learner*
- ✓ Đăng ký / Đăng nhập / Đăng xuất
- ✓ Tìm kiếm & lọc khóa học (tiêu đề, danh mục, cấp độ)
- ✓ Xem chi tiết khóa học
- ✓ Đăng ký khóa học (miễn phí / tính phí)
- ✓ Xem tài liệu, video, bài học
- ✓ Đánh dấu bài hoàn thành
- ✓ Nộp bài tập (văn bản, tệp đính kèm)
- ✓ Xem điểm và phản hồi, theo dõi tiến độ
- ✓ Nhận thông báo, đặt lại mật khẩu

*Instructor*
- ✓ Yêu cầu làm giảng viên
- ✓ Tạo & chỉnh sửa khóa học
- ✓ Tạo modules, lessons, upload video
- ✓ Tạo bài tập, xem danh sách bài nộp
- ✓ Chấm điểm & phản hồi cho học viên
- ✓ Quản lý nội dung khóa học

== Tính năng Admin

- ✓ Duyệt khóa học
- ✓ Quản lý người dùng
- ✓ Quản lý vai trò hệ thống
- ✓ Quản lý thông báo hệ thống

== Kết quả kiểm thử

#table(
  columns: (1fr, 1fr, 1fr),
  align: (center, center, center),
  [*Module*], [*Tests*], [*Trạng thái*],
  [Backend - Create Course], [1], [✓ Pass],
  [Backend - Login], [5], [✓ Pass],
  [Backend - Get Materials], [1], [✓ Pass],
  [Backend - Register], [1], [✓ Pass],
  [Backend - Enroll], [2], [✓ Pass],
  [Backend - Change Role], [4], [✓ Pass],
  [Backend - Get Users], [3], [✓ Pass],
  [Frontend - CourseCard], [16], [✓ Pass],
  [Frontend - App], [2], [✓ Pass],
)

== Chất lượng Code

*Kiến trúc Phân tầng + DDD*
- Phân tách mối quan tâm rõ ràng
- Dễ kiểm thử & dễ bảo trì
- Codebase có thể mở rộng

*Nguyên tắc SOLID*
- Trách nhiệm đơn, Mở/Đóng
- Thay thế Liskov, Tách biệt giao diện
- Đảo ngược phụ thuộc

*Code Sạch*
- Đặt tên có ý nghĩa, giảm lặp lại code
- Xử lý lỗi thích hợp

== Bảo mật & Hiệu suất

*Bảo mật*
- ✓ Xác thực JWT + mã hóa bcrypt
- ✓ Kiểm soát truy cập dựa trên vai trò (RBAC)
- ✓ Xác thực đầu vào & Ngăn chặn SQL injection (Prisma)
- ✓ Đặt lại mật khẩu bằng xác minh email
- ✓ Hệ thống thông báo email

*Hiệu suất*
- ✓ Truy vấn cơ sở dữ liệu được tối ưu hóa
- ✓ Thiết kế responsive

== CI/CD Pipeline & Pair Programming

*CI/CD Pipeline*
- GitHub Actions: Tự động test & build
- Trigger: mỗi push, pull request
- Backend: Jest test suite (17 tests)
- Frontend: Vitest suite (18 tests)
- Netlify: Tự động deploy frontend
- Trạng thái: ✓ Passing 100%

*Pair Programming*
- Backend: Bùi Văn Tùng & Dương Quốc Hưng (25+ giờ, 3 sprints)
- Frontend: Vũ Quốc Huy & Nguyễn Văn Hào (23+ giờ, 3 sprints)
- Tổng cộng: 48+ giờ pair programming

== Phân công thành viên

#table(
  columns: (1.5fr, 1.2fr, 2.3fr),
  align: (left, center, left),
  [*Thành viên*], [*Vai trò*], [*Trách nhiệm*],
  [Trương Hoàng Phúc], [Product Owner], [Lập kế hoạch sprint, deploy, leadership],
  [Tạ Hoàng Hiệp], [Scrum Master], [Tài liệu, cuộc họp],
  [Đỗ Đình Khang], [Scrum Master], [Kiến trúc, hỗ trợ kiểm thử],
  [Bùi Văn Tùng], [BE Lead], [Thiết kế API, xác thực],
  [Dương Quốc Hưng], [BE Dev], [Use cases, repositories],
  [Vũ Quốc Huy], [FE Lead], [Components, routing],
  [Nguyễn Văn Hào], [FE Dev], [Styling, integration],
)

== Điểm nổi bật (1/2)

*1. Chất lượng Code & Kiến trúc*
- Kiến trúc phân tầng + DDD
- 35 tests, 100% đạt
- Áp dụng nguyên tắc SOLID

*2. Agile & Lập trình Cực hạn*
- 3 sprints, 107 tasks (100% hoàn thành)
- 48+ giờ pair programming
- CI/CD tự động hóa, 100% tests đạt

== Thống kê & Công nghệ Stack

*Thống kê hoàn thành*

#table(
  columns: (1.5fr, 1fr, 1fr),
  align: (left, center, center),
  [*Sprint*], [*Tasks*], [*Hoàn thành*],
  [Sprint 1], [30], [30 (100%)],
  [Sprint 2], [40], [40 (100%)],
  [Sprint 3], [37], [37 (100%)],
  [*TỔNG*], [*107*], [*107 (100%)*],
)

*Công nghệ chính:* Node.js 20, React 19, Express.js, Prisma, SQLite, Neon PostgreSQL, JWT, bcrypt, Jest, Vitest, GitHub Actions, Netlify

== Kết quả & Bài học kinh nghiệm

*Dự kiến vs Thực tế*
- ✓ 107/107 tasks hoàn thành (100%)
- ✓ 35/35 tests pass (100%)
- ✓ 17 use cases triển khai
- ✓ 0 lỗi nghiêm trọng

*Thành công*
1. Kiến trúc phân tầng + DDD: Rõ ràng, dễ test
2. TDD: Tự tin về chất lượng
3. Pair programming: Chia sẻ kiến thức tốt
4. CI/CD: Phát hiện lỗi sớm

*Cải thiện*
1. Lập kế hoạch migration cơ sở dữ liệu
2. API versioning từ đầu
3. Kiểm thử tải (hiệu suất)
4. Tự động hóa tài liệu

== Kết quả Test & Quality

*Backend Tests (Jest):*
- 17 tests, 7 test suites
- 100% pass rate, < 300ms response time

*Frontend Tests (Vitest):*
- 18 tests, 2 test suites  
- 100% pass rate, UI component coverage

*Total: 35 tests - 100% success*

== Kết luận

✓ *Hoàn thành* toàn bộ 3 sprint vào 30/12/2025

✓ *Chất lượng:* 35/35 tests đạt, 0 lỗi nghiêm trọng

✓ *Kiến trúc:* Phân tầng + DDD, nguyên tắc SOLID

✓ *Quy trình:* Agile, XP, pair programming (48+ giờ), CI/CD

✓ *Tính năng:* 17 use cases, 3 vai trò (Học viên, Giảng viên, Quản trị viên)

✓ *Tài liệu:* Thiết kế API, mô hình miền, SRS, hướng dẫn triển khai

== Minh chứng - Pair Programming

*Sprint 1 - Backend*
#image("pair_programming_pics/be_sprint1_login.jpg", width: 60%)

Tùng & Hưng - Tạo API Login

== Minh chứng - Pair Programming (2)

*Sprint 2 - Backend*
#image("pair_programming_pics/be_sprint2_searchcourse.jpg", width: 60%)

Tùng & Hưng - Tạo API tìm kiếm khóa học & seed database

== Minh chứng - Giao tiếp

*Họp với Giảng viên*

#grid(
  columns: 2,
  gutter: 10pt,
  image("minh_chung/hoi_thay_7_thang_10.jpg", width: 90%),
  image("minh_chung/hoi_thay_11_thang_11.jpg", width: 90%),
)

Các buổi trao đổi và hỏi đáp (7/10, 11/11, 2/12/2025)

== Cảm ơn!

*Hệ thống Quản lý Học tập (LMS)*

Nhóm 5 - SE214.Q11

30 tháng 12 năm 2025

---

Mã nguồn: github.com/Huangphoux/uit-limousine

Deployment: [https://uit-limousine.netlify.app/]
