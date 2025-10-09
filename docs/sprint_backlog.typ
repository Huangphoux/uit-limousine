== Sprint 1 – Project Setup & Role Initialization

*Mục tiêu:* Khởi tạo hệ thống, thiết lập môi trường, cơ sở dữ liệu, và chia vai trò.

*Các công việc:*
- Dựng kiến trúc dự án: Setup repo, CI/CD, môi trường backend/frontend
- Tạo cơ sở dữ liệu ban đầu: Schema cho User, Role, Course
- Thiết kế và seed dữ liệu Role: Admin, Instructor, Learner
- Thiết lập mô hình xác thực cơ bản (chuẩn bị cho #link(<uc-01>)[UC-01])
- Phân quyền truy cập ban đầu: Cấu hình middleware, RBAC
- Cấu hình hệ thống log ban đầu (chuẩn bị cho #link(<uc-18>)[UC-18])

*Kết quả:* Dự án có cấu trúc hoàn chỉnh, database hoạt động, có thể đăng nhập cơ bản bằng tài khoản mẫu.

== Sprint 2 – Authentication & Course Browsing

*Mục tiêu:* Cho phép người dùng đăng nhập và tìm kiếm khóa học.

*Use Cases:*
- #link(<uc-01>)[UC-01: Login / Logout]
- #link(<uc-02>)[UC-02: Search Course]
- #link(<uc-03>)[UC-03: View Course Details]
- #link(<uc-18>)[UC-18: Audit Log / System Logs]

*Kết quả:* Người dùng có thể đăng nhập và xem khóa học; hệ thống ghi log hành động.

== Sprint 3 – Enrollment & Learning Flow

*Mục tiêu:* Hoàn thiện luồng học của học viên.

*Use Cases:*
- #link(<uc-04>)[UC-04: Enroll in Course]
- #link(<uc-05>)[UC-05: Learn Course / View Lesson]
- #link(<uc-06>)[UC-06: Submit Assignment]
- #link(<uc-09>)[UC-09: Notification]

*Kết quả:* Học viên có thể học, nộp bài, và nhận thông báo tự động.

== Sprint 4 – Instructor Tools & Course Management

*Mục tiêu:* Giảng viên có thể tạo, chỉnh sửa, và quản lý khóa học.

*Use Cases:*
- #link(<uc-07>)[UC-07: Grade Assignment]
- #link(<uc-08>)[UC-08: Apply / Approve Instructor]
- #link(<uc-11>)[UC-11: Create Course]
- #link(<uc-12>)[UC-12: Modify Course]
- #link(<uc-17>)[UC-17: Manage Users & Roles]

*Kết quả:* Hệ thống hỗ trợ quy trình tạo và quản lý khóa học cho giảng viên, admin.

== Sprint 5 – Reports, Certificates & Monetization

*Mục tiêu:* Bổ sung chức năng nâng cao, thương mại hóa và phản hồi người dùng.

*Use Cases:*
- #link(<uc-10>)[UC-10: Messaging / Q&A]
- #link(<uc-13>)[UC-13: View Reports / Analytics]
- #link(<uc-14>)[UC-14: Issue Certificate]
- #link(<uc-15>)[UC-15: Rate & Review Course]
- #link(<uc-16>)[UC-16: Payment / Checkout]

*Kết quả:* Hệ thống hoàn thiện với chứng chỉ, đánh giá, thanh toán và báo cáo phân tích.