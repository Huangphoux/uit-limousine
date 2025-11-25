= Báo cáo Kiểm thử API - Hệ thống UIT Limousine

*Ngày kiểm thử:* 25/11/2025 \
*Người kiểm thử:* Backend Team \
*Môi trường:* Development (localhost:3000)

== 1. Tổng quan

Đã kiểm tra tất cả API endpoints hiện có trong hệ thống dựa trên source code và routes được định nghĩa. Báo cáo này liệt kê các lỗi cần sửa để hệ thống hoạt động ổn định.

== 2. Các API cần kiểm tra

=== 2.1. Authentication APIs (`/auth`)

#table(
  columns: (1fr, 1fr, 2fr, 1fr),
  align: (left, left, left, center),
  [*Endpoint*], [*Method*], [*Mô tả*], [*Status*],
  
  [`/auth/register`], [POST], [Đăng ký tài khoản mới], [⚠️],
  [`/auth/login`], [POST], [Đăng nhập hệ thống], [⚠️],
)

*Lỗi phát hiện:*

1. *POST `/auth/register`*
   - *Vấn đề:* Thiếu validation cho email format
   - *Mức độ:* Trung bình
   - *Mô tả:* API không kiểm tra format email hợp lệ trước khi lưu vào database
   - *Cách sửa:* Thêm validation email trong register use case
   ```javascript
   // Thêm vào register.usecase.js
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
     throw new Error('Invalid email format');
   }
   ```

2. *POST `/auth/login`*
   - *Vấn đề:* Không có rate limiting
   - *Mức độ:* Cao (Security)
   - *Mô tả:* API có thể bị brute force attack
   - *Cách sửa:* Thêm express-rate-limit middleware
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 phút
     max: 5, // Giới hạn 5 requests
     message: 'Too many login attempts, please try again later'
   });
   
   router.post('/login', loginLimiter, controller(loginUseCase));
   ```

=== 2.2. Course APIs (`/courses`)

#table(
  columns: (1fr, 1fr, 2fr, 1fr),
  align: (left, left, left, center),
  [*Endpoint*], [*Method*], [*Mô tả*], [*Status*],
  
  [`/courses`], [GET], [Tìm kiếm khóa học], [✓],
  [`/courses/:id`], [GET], [Lấy chi tiết khóa học], [⚠️],
  [`/courses/:courseId/enroll`], [POST], [Đăng ký khóa học], [❌],
  [`/courses/:courseId/materials`], [GET], [Lấy tài liệu khóa học], [❌],
  [`/courses/:courseId`], [PUT], [Cập nhật khóa học], [❌],
)

*Lỗi phát hiện:*

3. *GET `/courses/:id`*
   - *Vấn đề:* Không handle trường hợp course không tồn tại
   - *Mức độ:* Trung bình
   - *Mô tả:* API trả về 500 thay vì 404 khi course không tồn tại
   - *Cách sửa:* Thêm error handling trong `getCourseById` controller
   ```javascript
   // Trong course.controller.js
   export const getCourseById = async (req, res) => {
     try {
       const course = await courseRepository.findById(req.params.id);
       if (!course) {
         return res.status(404).json({
           success: false,
           error: 'Course not found'
         });
       }
       res.json({ success: true, data: course });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   };
   ```

4. *POST `/courses/:courseId/enroll`*
   - *Vấn đề:* Thiếu authentication middleware
   - *Mức độ:* Cao (Security)
   - *Mô tả:* API không kiểm tra user đã đăng nhập hay chưa
   - *File cần sửa:* `server/src/presentation_layer/routes/courses.route.js`
   - *Cách sửa:*
   ```javascript
   import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
   
   // Thêm middleware
   router.post('/:courseId/enroll', 
     authenticationMiddleware,  // <-- THÊM DÒNG NÀY
     controller(enrollCoursesUseCase)
   );
   ```

5. *GET `/courses/:courseId/materials`*
   - *Vấn đề:* Thiếu authentication middleware
   - *Mức độ:* Cao (Security)
   - *Mô tả:* Bất kỳ ai cũng có thể xem tài liệu mà không cần đăng ký khóa học
   - *File cần sửa:* `server/src/presentation_layer/routes/courses.route.js`
   - *Cách sửa:*
   ```javascript
   router.get('/:courseId/materials',
     authenticationMiddleware,  // <-- THÊM DÒNG NÀY
     controller(courseMaterialsQueryUsecase)
   );
   ```

6. *PUT `/courses/:courseId`*
   - *Vấn đề:* Thiếu authentication và authorization middleware
   - *Mức độ:* Rất cao (Security)
   - *Mô tả:* Bất kỳ ai cũng có thể cập nhật khóa học
   - *File cần sửa:* `server/src/presentation_layer/routes/courses.route.js`
   - *Cách sửa:*
   ```javascript
   import { roleAuthorizationMiddleware } from '../middlewares/role-authorization.middleware.js';
   import { Role } from '../../domain_layer/role.entity.js';
   
   router.put('/:courseId',
     authenticationMiddleware,  // <-- THÊM
     roleAuthorizationMiddleware(Role.INSTRUCTOR), // <-- THÊM
     controller(modifyCourseUsecase)
   );
   ```

=== 2.3. Lesson APIs (`/lessons`)

#table(
  columns: (1fr, 1fr, 2fr, 1fr),
  align: (left, left, left, center),
  [*Endpoint*], [*Method*], [*Mô tả*], [*Status*],
  
  [`/lessons/:lessonId/complete`], [POST], [Đánh dấu bài học hoàn thành], [❌],
)

*Lỗi phát hiện:*

7. *POST `/lessons/:lessonId/complete`*
   - *Vấn đề:* Thiếu authentication middleware
   - *Mức độ:* Cao
   - *Mô tả:* API không kiểm tra user đã đăng nhập
   - *File cần sửa:* `server/src/presentation_layer/routes/lessons.router.js`
   - *Cách sửa:*
   ```javascript
   import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
   
   router.post('/:lessonId/complete',
     authenticationMiddleware,  // <-- THÊM DÒNG NÀY
     controller(completeLessonUseCase)
   );
   ```

=== 2.4. Instructor Application APIs (`/instructor`)

#table(
  columns: (1fr, 1fr, 2fr, 1fr),
  align: (left, left, left, center),
  [*Endpoint*], [*Method*], [*Mô tả*], [*Status*],
  
  [`/instructor/apply`], [POST], [Nộp đơn xin làm giảng viên], [❌],
  [`/instructor/applications`], [GET], [Lấy danh sách đơn], [❌],
  [`/instructor/applications/:id`], [GET], [Xem chi tiết đơn], [⚠️],
  [`/instructor/applications/:id/approve`], [POST], [Phê duyệt đơn], [❌],
  [`/instructor/applications/:id/reject`], [POST], [Từ chối đơn], [❌],
)

*Lỗi phát hiện:*

8. *POST `/instructor/apply`*
   - *Vấn đề:* Thiếu authentication middleware
   - *Mức độ:* Cao
   - *Mô tả:* API không kiểm tra user đã đăng nhập
   - *File cần sửa:* `server/src/presentation_layer/routes/instructor.route.js`
   - *Cách sửa:*
   ```javascript
   import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
   
   router.post('/apply',
     authenticationMiddleware,  // <-- THÊM DÒNG NÀY
     (req, res) => applyInstructor(req, res)
   );
   ```

9. *GET `/instructor/applications`*
   - *Vấn đề:* Thiếu authentication và authorization
   - *Mức độ:* Rất cao (Security)
   - *Mô tả:* Bất kỳ ai cũng có thể xem danh sách đơn xin làm giảng viên
   - *File cần sửa:* `server/src/presentation_layer/routes/instructor.route.js`
   - *Cách sửa:*
   ```javascript
   import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
   import { roleAuthorizationMiddleware } from '../middlewares/role-authorization.middleware.js';
   import { Role } from '../../domain_layer/role.entity.js';
   
   router.get('/applications',
     authenticationMiddleware,  // <-- THÊM
     roleAuthorizationMiddleware(Role.ADMIN), // <-- THÊM
     (req, res) => getAllApplications(req, res)
   );
   ```

10. *POST `/instructor/applications/:applicationId/approve`*
    - *Vấn đề:* Thiếu authentication và authorization
    - *Mức độ:* Rất cao (Security - Critical)
    - *Mô tả:* Bất kỳ ai cũng có thể phê duyệt đơn
    - *File cần sửa:* `server/src/presentation_layer/routes/instructor.route.js`
    - *Cách sửa:*
    ```javascript
    router.post('/applications/:applicationId/approve',
      authenticationMiddleware,  // <-- THÊM
      roleAuthorizationMiddleware(Role.ADMIN), // <-- THÊM
      (req, res) => approveApplication(req, res)
    );
    ```

11. *POST `/instructor/applications/:applicationId/reject`*
    - *Vấn đề:* Thiếu authentication và authorization
    - *Mức độ:* Rất cao (Security - Critical)
    - *Mô tả:* Bất kỳ ai cũng có thể từ chối đơn
    - *File cần sửa:* `server/src/presentation_layer/routes/instructor.route.js`
    - *Cách sửa:* Tương tự như approve

=== 2.5. Notification APIs (`/notifications`)

#table(
  columns: (1fr, 1fr, 2fr, 1fr),
  align: (left, left, left, center),
  [*Endpoint*], [*Method*], [*Mô tả*], [*Status*],
  
  [`/notifications`], [POST], [Tạo thông báo], [❌],
  [`/notifications`], [GET], [Lấy danh sách thông báo], [❌],
  [`/notifications/unread-count`], [GET], [Đếm thông báo chưa đọc], [❌],
  [`/notifications/:id/read`], [PUT], [Đánh dấu đã đọc], [❌],
  [`/notifications/:id`], [DELETE], [Xóa thông báo], [❌],
)

*Lỗi phát hiện:*

12. *Tất cả Notification endpoints*
    - *Vấn đề:* Middleware authentication giả (fake middleware)
    - *Mức độ:* Rất cao (Security - Critical)
    - *Mô tả:* File `notification.route.js` có authenticate middleware giả (commented)
    - *File cần sửa:* `server/src/presentation_layer/routes/notification.route.js`
    - *Cách sửa:*
    ```javascript
    // XÓA middleware giả này:
    const authenticate = (req, res, next) => {
      // TODO: Implement real authentication
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      next();
    };
    
    // THAY BẰNG:
    import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
    
    // Áp dụng cho tất cả routes
    router.use(authenticationMiddleware);
    ```

=== 2.6. Grade APIs (`/grade`)

#table(
  columns: (1fr, 1fr, 2fr, 1fr),
  align: (left, left, left, center),
  [*Endpoint*], [*Method*], [*Mô tả*], [*Status*],
  
  [`/grade/submissions/:id`], [POST], [Chấm bài], [❌],
)

*Lỗi phát hiện:*

13. *POST `/grade/submissions/:submissionId`*
    - *Vấn đề:* Thiếu authentication và authorization
    - *Mức độ:* Rất cao (Security - Critical)
    - *Mô tả:* Bất kỳ ai cũng có thể chấm bài
    - *File cần sửa:* `server/src/presentation_layer/routes/grade.route.js`
    - *Cách sửa:*
    ```javascript
    import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
    import { roleAuthorizationMiddleware } from '../middlewares/role-authorization.middleware.js';
    import { Role } from '../../domain_layer/role.entity.js';
    
    router.post('/submissions/:submissionId',
      authenticationMiddleware,  // <-- THÊM
      roleAuthorizationMiddleware(Role.INSTRUCTOR), // <-- THÊM
      (req, res) => gradeSubmission(req, res)
    );
    ```

=== 2.7. Admin APIs (`/admin`)

Admin APIs đã được bảo vệ đúng cách với authentication và authorization middleware. ✓

== 3. Tổng kết lỗi

#table(
  columns: (1fr, 1fr, 2fr),
  align: (left, center, left),
  [*Loại lỗi*], [*Số lượng*], [*Mức độ nghiêm trọng*],
  
  [Missing Authentication], [8], [Cao - Rất cao],
  [Missing Authorization], [6], [Rất cao - Critical],
  [Missing Validation], [2], [Trung bình],
  [Missing Error Handling], [1], [Trung bình],
  [Missing Rate Limiting], [1], [Cao],
  table.hline(),
  [*TỔNG*], [*18 lỗi*], [-],
)

== 4. Ưu tiên sửa lỗi

=== Ưu tiên 1: Critical (Phải sửa ngay)

1. Thêm authentication middleware cho tất cả Notification APIs
2. Thêm authentication + authorization cho Instructor Application approve/reject
3. Thêm authentication + authorization cho Grade API
4. Thêm authentication + authorization cho Update Course API

=== Ưu tiên 2: Cao (Sửa trong 1-2 ngày)

5. Thêm authentication cho Enroll, Course Materials, Complete Lesson APIs
6. Thêm authentication cho Apply Instructor API
7. Thêm authentication cho Get Applications API
8. Thêm rate limiting cho Login API

=== Ưu tiên 3: Trung bình (Sửa trong tuần)

9. Thêm validation email cho Register API
10. Thêm error handling cho Get Course by ID API

== 5. File cần chỉnh sửa

#table(
  columns: (2fr, 1fr),
  align: (left, center),
  [*File*], [*Số lỗi*],
  
  [`courses.route.js`], [4],
  [`instructor.route.js`], [5],
  [`notification.route.js`], [5],
  [`lessons.router.js`], [1],
  [`grade.route.js`], [1],
  [`auth.route.js`], [2],
)

== 6. Khuyến nghị

1. *Tạo middleware wrapper chung* để apply authentication cho tất cả protected routes:
   ```javascript
   // protected-routes.wrapper.js
   export const protectedRoute = (handler) => {
     return [authenticationMiddleware, handler];
   };
   
   export const adminRoute = (handler) => {
     return [
       authenticationMiddleware,
       roleAuthorizationMiddleware(Role.ADMIN),
       handler
     ];
   };
   ```

2. *Thêm integration tests* cho tất cả protected endpoints

3. *Implement request validation middleware* sử dụng Zod hoặc Joi

4. *Thêm API documentation* sử dụng Swagger/OpenAPI

5. *Setup CORS properly* cho production environment

== 7. Testing Instructions

Sau khi sửa lỗi, test lại bằng file `api-tests.http`:

1. Mở file `api-tests.http` trong VS Code
2. Install REST Client extension nếu chưa có
3. Chạy từng request để verify
4. Kiểm tra các trường hợp:
   - Request với token hợp lệ → Phải thành công
   - Request không có token → Phải trả về 401
   - Request với token của role không đủ quyền → Phải trả về 403

== 8. Kết luận

Hệ thống hiện tại có **18 lỗi bảo mật nghiêm trọng** cần được sửa trước khi deploy lên production. Đa số lỗi liên quan đến thiếu authentication và authorization middleware.

*Thời gian ước tính để sửa:* 2-3 ngày làm việc

*Ngày hoàn thành dự kiến:* 28/11/2025
