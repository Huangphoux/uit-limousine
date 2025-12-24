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
- Áp dụng Layered Architecture + Domain-Driven Design (DDD)
- Thực hành Extreme Programming (XP): TDD, Pair Programming, CI/CD
- Thực hiện trong 3 sprint (28/9 - 30/12/2025)
- Kết quả: 121 tests pass (100%), 18+ use cases, 0 lỗi nghiêm trọng

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
- Database: SQLite (phát triển), Neon PostgreSQL (sản xuất)
- ORM: Prisma | Xác thực: JWT + bcrypt
- Email: Nodemailer | Logging: Winston
- Kiểm thử: Jest + Supertest (98 tests)

*Frontend*
- Framework: React 19 | Build Tool: Vite
- Quản lý State: Context API | Styling: CSS responsive
- Kiểm thử: Vitest + React Testing Library (23 tests)
- Triển khai: Netlify (tự động deploy)

== Kiến trúc & Design Patterns

*Kiến trúc Layered*
- Presentation Layer: Controllers, REST API
- Application Layer: Use Cases, Business Logic
- Domain Layer: Entities, Domain Services
- Infrastructure Layer: Repositories, Mappers

*Design Patterns*
- Repository Pattern: Abstraction cho data access
- Mapper Pattern: Transform DTOs ↔ Entities
- Factory Pattern: Composition root
- Middleware Pattern: Auth, logging
- Observer Pattern: Notifications

== Sprint 1 - Thiết lập & Xác thực

*Thời gian:* 28/9–17/10/2025 (2 tuần)

*Hoàn thành:*
- User entity, JWT authentication, bcrypt hashing
- Trang Đăng nhập, Đăng ký, Đăng xuất
- Thiết lập Git + CI/CD pipeline
- 15/15 tests pass

*Công nghệ:* Node.js, React, Prisma, GitHub Actions

== Sprint 2 - Tìm kiếm & Đăng ký

*Thời gian:* 28/10–17/11/2025 (3 tuần)

*Hoàn thành:*
- Course entity, search API, enrollment
- Course card, search page, course details modal
- Tìm kiếm tài liệu & bài học, theo dõi tiến độ
- 121 tests pass (98 BE + 23 FE)
- Responsive design
- CI/CD tự động

*Công nghệ:* Supertest, Vitest, React Testing Library

== Sprint 3 - Bài tập & Công cụ GV

*Thời gian:* 18/11–30/12/2025 (6 tuần)

*Hoàn thành:*
- Submission entity, grading system
- Giảng viên dashboard, quản lý khóa học
- Thông báo (email + in-app)
- Quản lý vai trò (Learner, Instructor, Admin)
- 121/121 tests pass
- 18+ use cases triển khai

*Công nghệ:* Prisma migrations, email service, role-based access

== Tính năng Learner & Instructor

*Learner*
- ✓ Đăng ký / Đăng nhập / Đăng xuất
- ✓ Tìm kiếm & lọc khóa học (tiêu đề, danh mục, cấp độ)
- ✓ Xem chi tiết khóa học
- ✓ Đăng ký khóa học (miễn phí / tính phí)
- ✓ Xem tài liệu, video, bài học
- ✓ Đánh dấu bài hoàn thành, nộp bài tập
- ✓ Xem kết quả chấm điểm, theo dõi tiến độ

*Instructor*
- ✓ Yêu cầu làm giảng viên
- ✓ Tạo & chỉnh sửa khóa học
- ✓ Tạo modules, lessons, upload video
- ✓ Tạo bài tập, chấm điểm & feedback
- ✓ Xem danh sách bài nộp, thống kê lớp

== Tính năng Admin

- ✓ Duyệt yêu cầu giảng viên
- ✓ Quản lý người dùng (xem, xóa, thay đổi vai trò)
- ✓ Quản lý khóa học (duyệt, gỡ bỏ)
- ✓ Xem báo cáo hệ thống
- ✓ Audit log & system logs
- ✓ Quản lý notifications

== Kết quả kiểm thử

#table(
  columns: (1fr, 1fr, 1fr),
  align: (center, center, center),
  [*Module*], [*Tests*], [*Trạng thái*],
  [Backend - Xác thực], [5], [✓ Pass],
  [Backend - Tìm kiếm], [5], [✓ Pass],
  [Backend - Đăng ký], [3], [✓ Pass],
  [Backend - Tài liệu], [2], [✓ Pass],
  [Backend - Tiến độ], [4], [✓ Pass],
  [Backend - Chấm điểm], [12], [✓ Pass],
  [Backend - Giảng viên], [15], [✓ Pass],
  [Backend - Thông báo], [8], [✓ Pass],
  [Backend - Khác], [36], [✓ Pass],
  [Frontend - CourseCard], [21], [✓ Pass],
  [Frontend - App], [2], [✓ Pass],
)

== Chất lượng Code

*Layered Architecture + DDD*
- Phân tách mối quan tâm rõ ràng
- Dễ kiểm thử & dễ bảo trì
- Codebase có thể mở rộng

*SOLID Principles*
- Single Responsibility, Open/Closed
- Liskov Substitution, Interface Segregation
- Dependency Inversion

*Clean Code*
- Đặt tên có ý nghĩa, không lặp lại code
- Xử lý lỗi thích hợp, logging chi tiết

== Bảo mật & Hiệu suất

*Bảo mật*
- ✓ JWT authentication + bcrypt hashing
- ✓ Kiểm soát truy cập dựa trên vai trò (RBAC)
- ✓ Xác thực đầu vào & Ngăn chặn SQL injection (Prisma)
- ✓ Đặt lại mật khẩu bằng xác minh email
- ✓ Thông báo email

*Hiệu suất*
- ✓ Thời gian phản hồi API < 300ms
- ✓ Truy vấn cơ sở dữ liệu được tối ưu hóa
- ✓ Responsive design (mobile-first)

== CI/CD Pipeline & Pair Programming

*CI/CD Pipeline*
- GitHub Actions: Tự động test & build
- Trigger: mỗi push, pull request
- Backend: Jest test suite (98 tests)
- Frontend: Vitest suite (23 tests)
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
- Layered architecture + DDD
- 121 tests, 100% pass rate
- Áp dụng SOLID principles

*2. Agile & Extreme Programming*
- 3 sprints, 107 tasks (100% hoàn thành)
- 48+ giờ pair programming
- Tiếp cận TDD, 100% tự động hóa CI/CD

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
- ✓ 121/121 tests pass (100%)
- ✓ 18+ use cases triển khai
- ✓ 0 lỗi nghiêm trọng

*Thành công*
1. Layered + DDD: Rõ ràng, dễ test
2. TDD: Tự tin về chất lượng
3. Pair programming: Chia sẻ kiến thức tốt
4. CI/CD: Phát hiện lỗi sớm

*Cải thiện*
1. Database migration planning
2. API versioning từ đầu
3. Load testing (hiệu suất)
4. Documentation automation

== Kết luận

✓ *Hoàn thành* toàn bộ 3 sprint vào 30/12/2025

✓ *Chất lượng:* 121/121 tests pass, 0 lỗi nghiêm trọng

✓ *Kiến trúc:* Layered + DDD, SOLID principles

✓ *Quy trình:* Agile, XP, TDD, pair programming, CI/CD

✓ *Tính năng:* 18+ use cases, 3 vai trò (Learner, Instructor, Admin)

✓ *Tài liệu:* API specs, domain model, SRS, hướng dẫn triển khai

== Cảm ơn!

*Hệ thống Quản lý Học tập (LMS)*

Nhóm 5 - SE214.Q11

30 tháng 12 năm 2025

---

Mã nguồn: github.com/Huangphoux/uit-limousine

Deployment: [https://uit-limousine.netlify.app/]
