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

Sprint 2 được thực hiện từ ngày *28/10/2025* đến *17/11/2025* (3 tuần), tập trung vào việc phát triển các chức năng cốt lõi của hệ thống LMS bao gồm: tìm kiếm khóa học, đăng ký khóa học, xem tài liệu học tập và theo dõi tiến độ học tập.

== Mục tiêu Sprint 2

+ Hoàn thiện hệ thống Authentication (đăng nhập, đăng ký, đăng xuất)
+ Xây dựng chức năng tìm kiếm và lọc khóa học
+ Phát triển tính năng đăng ký khóa học (enrollment)
+ Xây dựng chức năng xem chi tiết khóa học và tài liệu học tập
+ Phát triển tính năng theo dõi tiến độ học tập (lesson progress)
+ Thiết kế và triển khai API RESTful cho các chức năng trên
+ Xây dựng test suite tự động với Jest
+ Cải thiện UI/UX cho các trang chính

= Tiến độ và đo lường

== Tổng quan công việc

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  align: (left, center, center, center),
  [*Loại Task*], [*Tổng số*], [*Hoàn thành*], [*Tỷ lệ (%)*],
  [Back-End Features], [8], [8], [100%],
  [Front-End Features], [6], [6], [100%],
  [API Testing], [74], [74], [100%],
  [Bug Fixes], [15], [15], [100%],
  [Documentation], [4], [4], [100%],
  table.hline(),
  [*Tổng cộng*], [*107*], [*107*], [*100%*]
)

== Chi tiết công việc Back-End

#table(
  columns: (2fr, 1fr, 1fr),
  align: (left, center, center),
  [*Tính năng*], [*Trạng thái*], [*Tests*],
  [Authentication System], [✓ Hoàn thành], [5/5 pass],
  [Course Search & Filter], [✓ Hoàn thành], [5/5 pass],
  [Course Enrollment], [✓ Hoàn thành], [3/3 pass],
  [Course Materials Query], [✓ Hoàn thành], [2/2 pass],
  [Lesson Progress Tracking], [✓ Hoàn thành], [4/4 pass],
  [Logout System], [✓ Hoàn thành], [2/2 pass],
  [Error Handling], [✓ Hoàn thành], [3/3 pass],
  [Authentication Middleware], [✓ Hoàn thành], [Integrated],
)

== Chi tiết công việc Front-End

#table(
  columns: (2fr, 1fr, 1fr),
  align: (left, center, center),
  [*Tính năng*], [*Trạng thái*], [*Component*],
  [Course Search Page], [✓ Hoàn thành], [SearchPage.jsx],
  [Course Detail Modal], [✓ Hoàn thành], [CourseDetailModal.jsx],
  [Course Card Component], [✓ Hoàn thành], [CourseCard.jsx],
  [Authentication UI], [✓ Hoàn thành], [Auth Components],
  [Course Management], [✓ Hoàn thành], [Management Page],
  [Responsive Design], [✓ Hoàn thành], [All Pages],
)

== Đo lường chất lượng code

- *Test Coverage*: 100% (24/24 tests pass)
- *API Response Time*: Trung bình < 300ms
- *Code Review*: 100% pull requests được review
- *Bug Fix Rate*: 15 bugs được phát hiện và sửa trong sprint
- *Architecture*: Tuân thủ Layered Architecture + DDD

= Kết quả đạt được

== Back-End Achievements

=== 1. Authentication System (100% hoàn thành)

*Các tính năng đã triển khai:*
- Đăng ký người dùng với xác thực email
- Đăng nhập với JWT token (hết hạn sau 24 giờ)
- Đăng xuất không trạng thái (stateless)
- Mã hóa mật khẩu với bcrypt
- Middleware xác thực token

*Sửa lỗi quan trọng:*
- Sửa cấu hình JWT secret
- Sửa sinh ID người dùng (undefined thay vì chuỗi rỗng)
- Sửa repository người dùng để bao gồm vai trò
- Sửa ánh xạ thuộc tính trong use case đăng nhập

*Kết quả kiểm thử:*
```
✓ 1.1 Đăng ký người dùng mới thành công
✓ 1.2 Không cho phép đăng ký với email trùng lặp
✓ 1.3 Đăng nhập với thông tin hợp lệ
✓ 1.4 Không cho phép đăng nhập với mật khẩu sai
✓ 1.5 Không cho phép đăng nhập với email không tồn tại
```

=== 2. Tìm kiếm khóa học & Đăng ký (100% hoàn thành)

*Các tính năng đã triển khai:*
- Tìm kiếm khóa học với bộ lọc (tiêu đề, danh mục, cấp độ)
- Hỗ trợ phân trang
- Danh sách khóa học công khai (không cần xác thực)
- Đăng ký khóa học với kiểm tra trùng lặp
- Đăng ký idempotent (tự động xử lý trùng lặp)

*Điểm nổi bật kỹ thuật:*
- Triển khai mẫu Repository
- Lớp use case với DTOs đầu vào/đầu ra
- Xử lý lỗi phù hợp với thông báo rõ ràng

*Kết quả kiểm thử:*
```
✓ 2.1 Tìm kiếm tất cả khóa học với xác thực
✓ 2.2 Cho phép tìm kiếm khóa học không cần xác thực
✓ 2.3 Tìm kiếm khóa học với bộ lọc
✓ 2.4 Lấy chi tiết khóa học theo ID
✓ 2.5 Trả về 404 cho khóa học không tồn tại
✓ 3.1 Đăng ký khóa học thành công
✓ 3.2 Không cho phép đăng ký không có xác thực
✓ 3.3 Xử lý đăng ký trùng lặp một cách khéo léo
```

=== 3. Tài liệu khóa học & Tiến độ bài học (100% hoàn thành)

*Các tính năng đã triển khai:*
- Lấy tài liệu khóa học (modules & lessons)
- Theo dõi trạng thái hoàn thành bài học
- Tự động tạo tiến độ bài học khi hoàn thành lần đầu
- Hoàn thành bài học idempotent
- Tính toán phần trăm tiến độ

*Sửa lỗi quan trọng:*
- Sửa thứ tự tham số LessonProgressEntity
- Sửa mapper để bao gồm userId và lessonId
- Sửa progress map sử dụng lessonId làm khóa
- Thêm phương thức create vào repository

*Kết quả kiểm thử:*
```
✓ 4.1 Lấy tài liệu khóa học sau khi đăng ký
✓ 4.2 Không cho phép lấy tài liệu không có xác thực
✓ 5.1 Hoàn thành bài học thành công
✓ 5.2 Không cho phép hoàn thành bài học không có xác thực
✓ 5.3 Hiển thị bài học đã hoàn thành trong tài liệu
✓ 5.4 Xử lý hoàn thành bài học lại lần nữa (idempotent)
```

=== 4. Middleware xác thực (100% hoàn thành)

*Triển khai:*
- Xác thực JWT token
- Trích xuất User ID từ token
- Trả về lỗi 401 phù hợp
- Áp dụng cho các route được bảo vệ

*Các Route được bảo vệ:*
- POST `/courses/:courseId/enroll`
- GET `/courses/:courseId/materials`
- POST `/lessons/:lessonId/complete`
- POST `/auth/logout`

*Kết quả kiểm thử:*
```
✓ 7.1 Từ chối token không hợp lệ
✓ 7.2 Từ chối header Authorization không đúng định dạng
✓ 7.3 Xử lý endpoint không tồn tại
```

=== 5. Framework kiểm thử API (100% hoàn thành)

*Thiết lập Test Suite:*
- Cấu hình Jest + Supertest
- 74 integration tests
- Pipeline kiểm thử tự động
- Seeding dữ liệu test

*Phân tích độ bao phủ kiểm thử:*
- Xác thực: 5 tests
- Tìm kiếm khóa học: 5 tests
- Đăng ký khóa học: 3 tests
- Tài liệu khóa học: 2 tests
- Tiến độ bài học: 4 tests
- Đăng xuất: 2 tests
- Xử lý lỗi: 3 tests

*Kết quả cuối cùng: 24/24 tests passing (100%)*

== Thành tựu Front-End

=== 1. Giao diện tìm kiếm khóa học

*Các tính năng đã triển khai:*
- Tìm kiếm thời gian thực với debouncing
- Bộ lọc nâng cao (danh mục, cấp độ, giá)
- Điều khiển phân trang
- Responsive grid layout
- Trạng thái loading

=== 2. Dashboard quản lý khóa học

*Các tính năng đã triển khai:*
- Danh sách khóa học với tìm kiếm
- Modal tạo khóa học mới
- Chức năng chỉnh sửa khóa học
- Xóa khóa học với xác nhận
- Thống kê khóa học

=== 3. Cải tiến UI/UX

*Nâng cao:*
- Hệ thống thiết kế nhất quán
- Loading skeletons
- Xử lý lỗi với thông báo thân thiện
- Bố cục responsive trên mobile
- Components có khả năng tiếp cận

== Triển khai

- *Front-End*: https://uit-limousine.netlify.app/
- *Back-End*: Chạy trên local development server
- *Database*: Neon PostgreSQL (cloud-hosted)

= Pair Programming

Sprint 2 tiếp tục áp dụng phương pháp Pair Programming với sự phân công rõ ràng:

== Back-End Pair Programming Sessions

#table(
  columns: (1fr, 2fr, 1fr),
  align: (left, left, center),
  [*Cặp đôi*], [*Công việc*], [*Thời gian*],
  [Tùng - Hưng], [Triển khai API tìm kiếm khóa học], [3h],
  [Tùng - Hưng], [Logic đăng ký khóa học], [2.5h],
  [Tùng - Hưng], [Theo dõi tiến độ bài học], [4h],
  [Tùng - Hưng], [Phiên sửa lỗi], [5h],
  [Tùng - Hưng], [Kiểm thử và Debug API], [6h],
)

*Minh chứng Back-End Sprint 2:*
#image("pair_programming_pics/be_sprint2_searchcourse.jpg", width: 80%)

== Phiên Pair Programming Front-End

#table(
  columns: (1fr, 2fr, 1fr),
  align: (left, left, center),
  [*Cặp đôi*], [*Công việc*], [*Thời gian*],
  [Huy - Hào], [Trang tìm kiếm khóa học], [3h],
  [Huy - Hào], [Modal chi tiết khóa học], [2h],
  [Huy - Hào], [Dashboard quản lý khóa học], [4h],
  [Huy - Hào], [Sửa lỗi responsive design], [2.5h],
)

*Minh chứng Front-End Sprint 2:*
#image("pair_programming_pics/fe_sprint2.png", width: 80%)

= Các buổi họp và Hợp tác

== Cuộc họp Sprint Planning (28/10/2025)

*Nội dung:*
- Xem xét kết quả Sprint 1
- Thảo luận mục tiêu Sprint 2
- Ước lượng và phân rã công việc
- Phân bổ nguồn lực

*Quyết định:*
- Ưu tiên: Hoàn thiện các tính năng học tập cốt lõi
- Tập trung vào kiểm thử API và chất lượng
- Triển khai xử lý lỗi toàn diện

== Daily Standups

*Tần suất:* 3 lần mỗi tuần (Thứ Hai, Thứ Tư, Thứ Sáu)

*Định dạng:*
- Bạn đã làm gì hôm qua?
- Bạn sẽ làm gì hôm nay?
- Có vấn đề gì cản trở không?

*Kênh giao tiếp:*
- Zalo: Cập nhật nhanh
- Discord: Thảo luận kỹ thuật, chia sẻ màn hình

== Cuộc họp Mid-Sprint Review (11/11/2025)

*Minh chứng cuộc họp:*
#image("minh_chung/hoi_thay_11_thang_11.jpg", width: 80%)

*Các điểm thảo luận:*
- Cập nhật tiến độ: ~60% hoàn thành
- Thách thức kỹ thuật với xác thực
- Vấn đề seeding database
- Chiến lược kiểm thử

*Các hành động:*
- Sửa lỗi xác thực
- Triển khai test suite toàn diện
- Cải thiện xử lý lỗi
- Tài liệu hóa các API endpoint

== Cuộc họp Sprint Retrospective (17/11/2025)

*Những điều đã tốt:*
- Hợp tác pair programming xuất sắc
- Đạt 100% test coverage
- Triển khai kiến trúc sạch
- Giao tiếp tốt qua Zalo và Discord

*Những điều cần cải thiện:*
- Thiết lập database sớm hơn
- Commit code thường xuyên hơn
- Ước lượng thời gian công việc tốt hơn

*Hành động cho Sprint 3:*
- Triển khai các tính năng giảng viên
- Thêm nộp bài tập
- Xây dựng hệ thống thông báo
- Nâng cao UI/UX

= Phân bổ nguồn lực

== Phân bổ nguồn lực Sprint 2

#table(
  columns: (1fr, 1fr, 2fr),
  align: (left, center, left),
  [*Thành viên*], [*Vai trò*], [*Công việc chính*],
  [Trương Hoàng Phúc], [Product Owner], [Sprint planning, triển khai, phối hợp],
  [Tạ Hoàng Hiệp], [Scrum Master], [Tài liệu, cuộc họp, giao tiếp với stakeholder],
  [Đỗ Đình Khang], [Scrum Master], [Sơ đồ, tài liệu thiết kế, hỗ trợ kiểm thử],
  [Bùi Văn Tùng], [Back-End Lead], [Triển khai API, xác thực, kiểm thử],
  [Dương Quốc Hưng], [Back-End Dev], [Use cases, repositories, sửa lỗi],
  [Vũ Quốc Huy], [Front-End Lead], [UI components, routing, quản lý state],
  [Nguyễn Văn Hào], [Front-End Dev], [Styling, responsive design, tích hợp],
)

== Phân bổ công sức

#table(
  columns: (2fr, 1fr, 1fr),
  align: (left, center, center),
  [*Hoạt động*], [*Giờ*], [*Tỷ lệ*],
  [Development (coding)], [85h], [60%],
  [Testing & Bug Fixing], [30h], [21%],
  [Tài liệu hóa], [15h], [11%],
  [Cuộc họp & Planning], [12h], [8%],
  table.hline(),
  [*Total Sprint Effort*], [*142h*], [*100%*]
)

= Tài liệu kỹ thuật

== Tổng quan kiến trúc

Hệ thống tuân thủ *Layered Architecture* với *Domain-Driven Design*:

```
Presentation Layer (Controllers, Routes)
    ↓
Application Layer (Use Cases)
    ↓
Domain Layer (Entities, Value Objects)
    ↓
Infrastructure Layer (Repositories, Mappers)
```

== Các quyết định kỹ thuật quan trọng

*1. Chiến lược xác thực*
- JWT tokens với thời hạn 24h
- Đăng xuất stateless (không có token blacklist)
- bcrypt cho password hashing

*2. Thiết kế API*
- Tuân thủ RESTful conventions
- Định dạng response nhất quán: `{success, data/error}`
- HTTP status codes phù hợp

*3. Chiến lược cơ sở dữ liệu*
- Neon PostgreSQL (cloud)
- Prisma ORM với migrations
- Database seeding cho dữ liệu test

*4. Chiến lược kiểm thử*
- Jest + Supertest
- Integration tests > Unit tests
- Sửa lỗi theo hướng test-driven

== Các API Endpoints đã triển khai

*Xác thực:*
- POST `/auth/register` - Đăng ký người dùng mới
- POST `/auth/login` - Đăng nhập và nhận JWT
- POST `/auth/logout` - Đăng xuất (cần xác thực)

*Khóa học:*
- GET `/courses` - Tìm kiếm khóa học (công khai)
- GET `/courses/:id` - Lấy chi tiết khóa học (công khai)
- POST `/courses/:courseId/enroll` - Đăng ký khóa học (cần xác thực)
- GET `/courses/:courseId/materials` - Lấy tài liệu khóa học (cần xác thực)

*Bài học:*
- POST `/lessons/:lessonId/complete` - Đánh dấu bài học hoàn thành (cần xác thực)

= Screenshots các chức năng

== Back-End: Kết quả kiểm thử API

*Tất cả 24 tests đều pass (100% thành công):*

```
✓ Xác thực (5/5)
  ✓ 1.1 Đăng ký người dùng mới thành công
  ✓ 1.2 Không cho phép đăng ký email trùng lặp
  ✓ 1.3 Đăng nhập với thông tin hợp lệ
  ✓ 1.4 Không cho phép đăng nhập với mật khẩu sai
  ✓ 1.5 Không cho phép đăng nhập với email không tồn tại

✓ Tìm kiếm khóa học (5/5)
✓ Đăng ký khóa học (3/3)
✓ Tài liệu khóa học (2/2)
✓ Tiến độ bài học (4/4)
✓ Đăng xuất (2/2)
✓ Xử lý lỗi (3/3)

Test Suites: 1 passed, 1 total
Tests: 24 passed, 24 total
Time: 35.448s
```

== Front-End: Ứng dụng đã triển khai

*Demo trực tiếp:* https://uit-limousine.netlify.app/

*Showcase tính năng:*
- Thiết kế hiện đại, responsive
- Tìm kiếm nhanh với cập nhật thời gian thực
- Transitions và animations mượt mà
- Giao diện thân thiện trên mobile

= Tài liệu thiết kế

== Các sơ đồ đã tạo/cập nhật

*Use Case Diagrams:*
- Sơ đồ Use Case hệ thống
- Sơ đồ Use Case người học
- Sơ đồ Use Case giảng viên
- Sơ đồ Use Case quản trị viên

*Activity Diagrams:*
- Luồng đăng ký/đăng nhập/đăng xuất
- Luồng tìm kiếm khóa học
- Luồng đăng ký vào khóa học
- Luồng học khóa học & xem bài học

*Sequence Diagrams:*
- Sequence xác thực
- Sequence đăng ký khóa học
- Sequence theo dõi tiến độ bài học

*Class Diagram:*
- Domain model đầy đủ
- Tất cả entities và relationships

*Domain Model:*
- Bounded contexts
- Aggregates và entities
- Value objects

== Tài liệu thiết kế API

File: `docs/api_design.typ`

*Nội dung:*
- Tất cả API endpoints được tài liệu hóa
- Định dạng request/response
- Yêu cầu xác thực
- Đặc tả xử lý lỗi

= Tóm tắt số liệu Sprint

#table(
  columns: (2fr, 1fr),
  align: (left, center),
  [*Số liệu*], [*Giá trị*],
  [Thời gian Sprint], [3 tuần],
  [Tổng số Task], [107],
  [Tasks đã hoàn thành], [107],
  [Tỷ lệ thành công], [100%],
  [Test Coverage], [100%],
  [API Tests Passing], [24/24],
  [Bugs đã sửa], [15],
  [Code Reviews], [100%],
  [Giờ Pair Programming], [20.5h],
  [Tổng giờ làm việc nhóm], [142h],
)

= Kết luận Sprint 2

Sprint 2 đã đạt được *100% mục tiêu đề ra* với những thành tựu nổi bật:

*✓ Hoàn thành toàn bộ core features*
- Hệ thống xác thực hoàn chỉnh
- Tìm kiếm và đăng ký khóa học
- Theo dõi tiến độ học tập
- Kiểm soát quyền truy cập tài liệu

*✓ Quality assurance xuất sắc*
- 100% test coverage (24/24 tests pass)
- Không còn critical bugs
- Triển khai kiến trúc sạch

*✓ Team collaboration hiệu quả*
- Pair programming hiệu quả
- Giao tiếp đều đặn
- Phân chia công việc rõ ràng

*✓ Documentation đầy đủ*
- Tài liệu API
- Sơ đồ kiến trúc
- Kết quả kiểm thử được tài liệu hóa

== Lên kế hoạch Sprint 3

*Các ưu tiên cho sprint tiếp theo:*
+ Tính năng giảng viên (tạo khóa học, quản lý nội dung)
+ Nộp bài tập và chấm điểm
+ Hệ thống thông báo
+ Tích hợp thanh toán

*Ước lượng công sức:* 160 giờ (4 tuần)
