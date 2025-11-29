#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Công nghệ phần mềm chuyên sâu - SE214.Q11

Áp dụng Layered, Domain-Driven Design và Extreme Programming

Xây dựng Hệ thống Quản lý Học tập (LMS)",
  doc-title: "Báo cáo Sprint 2",
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

= Tổng quan Sprint 2

Sprint 2 (28/10–17/11/2025): Hoàn thiện chức năng cốt lõi LMS (tìm kiếm, đăng ký, học tập, tiến độ).

== Mục tiêu Sprint 2

- Authentication (đăng nhập, đăng ký, đăng xuất)
- Tìm kiếm, đăng ký, xem tài liệu, theo dõi tiến độ học tập
- API RESTful, test tự động, cải thiện UI/UX

= Tiến độ và đo lường

== Tổng quan công việc

#table(
  columns: (2fr, 1fr, 1fr),
  align: (left, center, center),
  [*Loại Task*], [*Hoàn thành*], [*Tỷ lệ*],
  [Back-End], [8], [100%],
  [Front-End], [6], [100%],
  [API Testing], [98], [100%],
  [FE Testing], [23], [100%],
  [Bug Fixes], [15], [100%],
  [Docs], [4], [100%],
  table.hline(),
  [*Tổng cộng*], [*107*], [*100%*]
)

== Chi tiết công việc Back-End

#table(
  columns: (2fr, 1fr),
  align: (left, center),
  [*Tính năng*], [*Tests*],
  [Authentication], [5],
  [Search & Filter], [5],
  [Enrollment], [3],
  [Materials], [2],
  [Progress], [4],
  [Logout], [2],
  [Error Handling], [3],
)

== Chi tiết công việc Front-End

#table(
  columns: (2fr, 1fr),
  align: (left, center),
  [*Tính năng*], [*Component*],
  [Search], [SearchPage.jsx],
  [Detail Modal], [CourseDetailModal.jsx],
  [Course Card], [CourseCard.jsx],
  [Auth UI], [Auth Components],
  [Management], [Management Page],
  [Responsive], [All Pages],
)

== Đo lường chất lượng code

- Test Coverage: 100%
- API Response < 300ms
- 15 bugs fixed
- 100% code review

= Kết quả đạt được

== Thành tựu chính
- Backend: 98/98 tests pass, CI/CD luôn pass
- Frontend: 23/23 tests pass, CI/CD luôn pass
- Tính năng: Đăng nhập, đăng ký, tìm kiếm, đăng ký khóa học, học tập, tiến độ, quản lý, responsive UI

== Thành tựu Front-End


== Triển khai

- Front-End: https://uit-limousine.netlify.app/
- Back-End: Local server
- Database: SQLite, Prisma ORM

= Pair Programming

Pair Programming: phân công rõ ràng, minh chứng hình ảnh bên dưới.

== Back-End Pair Programming Sessions


*Minh chứng Back-End Sprint 2:*
#image("pair_programming_pics/be_sprint2_searchcourse.jpg", width: 80%)

== Phiên Pair Programming Front-End


*Minh chứng Front-End Sprint 2:*
#image("pair_programming_pics/fe_sprint2.png", width: 80%)

= Các buổi họp và Hợp tác

*Họp Sprint: lên kế hoạch, review tiến độ, retrospective, minh chứng hình ảnh bên dưới.*
#image("minh_chung/hoi_thay_11_thang_11.jpg", width: 80%)

= Phân bổ nguồn lực

- Thành viên: Product Owner, Scrum Master, Back-End Lead/Dev, Front-End Lead/Dev

= Tài liệu kỹ thuật

== Tổng quan kiến trúc

Kiến trúc: Layered + Domain-Driven Design

== Các quyết định kỹ thuật quan trọng

- Xác thực: JWT, bcrypt
- API: RESTful, response nhất quán
- Database: SQLite, Prisma ORM
- Kiểm thử: Jest, Supertest, Vitest

== Các API Endpoints đã triển khai

- Auth: register, login, logout
- Courses: search, detail, enroll, materials
- Lessons: complete

= Screenshots các chức năng



== Back-End: Kết quả kiểm thử API & CI/CD

Backend: 98/98 tests pass, CI/CD luôn pass
#image("minh_chung/minh_chung_test_backend_sprint2.png", width: 80%)

== Front-End: Kết quả kiểm thử & CI/CD

Frontend: 23/23 tests pass, CI/CD luôn pass
#image("minh_chung/minh_chung_test_frontend_sprint2`.png", width: 80%)

*Demo trực tiếp:* https://uit-limousine.netlify.app/


*Showcase tính năng:*
- UI hiện đại, responsive, tìm kiếm nhanh, animation mượt, thân thiện mobile

= Tài liệu thiết kế

== Các sơ đồ đã tạo/cập nhật

- Use Case
#image("minh_chung/SystemUseCase.png", width: 60%)
#image("minh_chung/LearnerUseCase.png", width: 60%)
#image("minh_chung/InstructorUseCase.png", width: 60%)
#image("minh_chung/AdminUseCase.png", width: 60%)
- Activity
#image("minh_chung/RegisterLoginLogoutActivity.png", width: 60%)
#image("minh_chung/EnrollinCourseActivity.png", width: 60%)
#image("minh_chung/LearnCourseViewLessonActivity.png", width: 60%)
- Sequence
#image("minh_chung/RegisterLoginLogoutSequence.png", width: 60%)
#image("minh_chung/EnrollinCourseSequence.png", width: 60%)
#image("minh_chung/LearnCourseViewLessonSequence.png", width: 60%)
- Class
#image("minh_chung/ClassDiagram.png", width: 60%)
- Domain Model
#image("minh_chung/DomainDiagram.png", width: 60%)

== Tài liệu thiết kế API

- File: docs/api_design.typ (đầy đủ endpoint, request/response, xác thực, lỗi)

= Kết luận Sprint 2

Sprint 2 đạt 100% mục tiêu: core features, test coverage, CI/CD, tài liệu, minh chứng hình ảnh.

== Lên kế hoạch Sprint 3

- Ưu tiên: giảng viên, nộp/chấm bài, thông báo, thanh toán

