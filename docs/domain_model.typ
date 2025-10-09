= Bounded contexts
    + Identity & Access (IAM)
        - Chịu trách nhiệm: đăng ký/đăng nhập, quản lý roles (Learner/Instructor/Admin), token/JWT, audit log.
        - Giao diện công khai: Auth API, User profile API.
        - Gợi ý event: UserRegistered, RoleAssigned.
    + Course Lifecycle
        - Chịu trách nhiệm: tạo / sửa / publish / archive courses; quản lý modules, lessons, course tags, syllabus.
        - Aggregate chủ yếu: Course.
        - Event: CourseCreated, CoursePublished.
    + Enrollment & Scheduling
        - Chịu trách nhiệm: yêu cầu ghi danh, phê duyệt, waitlist, quản lý lịch học (live sessions).
        - Aggregate: Enrollment.
        - Event: EnrollmentRequested, EnrollmentApproved.
    + Content Delivery
        - Chịu trách nhiệm: upload materials (video/pdf), versioning, visibility states (draft/visible/archived), CDN links.
        - Aggregate: Material (versioned).
        - Event: MaterialUploaded, MaterialPublished.
    + Assessment & Feedback
        - Chịu trách nhiệm: post assignments, nhận submissions, grading, rubrics.
        - Aggregates: Assignment (root), Submission (có thể là entity trong Assignment hoặc aggregate riêng nếu scale lớn).
        - Event: SubmissionCreated, SubmissionGraded.
    + Collaboration & Messaging
        - Chịu trách nhiệm: threads, direct messages, announcements, in-app/email notifications.
        - Aggregate: Thread/Message; Notification (có thể thuộc context riêng).
        - Event: MessageSent, AnnouncementPosted.
    + Analytics & Reporting (read-model)
        - Chịu trách nhiệm: xây dựng projections (progress bar, completion rate, engagement).
        - Đặc điểm: read-only, cập nhật bất đồng bộ từ domain events.
    + Platform & Settings (Admin)
        - Chịu trách nhiệm: chính sách (late penalty, grading rules), branding, cấu hình toàn hệ thống.

= Aggregates
    + Identity & Access
        - Aggregate root: User
        - Entities/VOs: Admin/Instructor/Student (vai trò), Email (VO), PasswordHash (VO), Role (VO)
        - Invariants: email duy nhất, role không được nâng cấp mà không có quyền Admin.
        - Ví dụ commands: RegisterUser, AssignRole, ResetPassword.
        - Events: UserRegistered, RoleAssigned.
    + Course Lifecycle
        - Aggregate root: Course
        - Entities: Module (owned), Lesson (owned), Schedule (có thể là reference)
        - VOs: CourseTag, Syllabus
        - Invariants: không thể publish nếu không có lesson; published state chuyển đổi có kiểm tra.
        - Commands: CreateCourse, PublishCourse.
        - Events: CourseCreated, CoursePublished.
    + Enrollment & Scheduling
        - Aggregate root: Enrollment
        - Entities/VOs: WaitlistEntry (entity), EnrollmentStatus (VO)
        - Invariants: chỉ một enrollment active cho (user, course) trừ khi cho phép lặp; capacity/waitlist rules.
        - Commands: RequestEnrollment, ApproveEnrollment.
        - Events: EnrollmentRequested, EnrollmentApproved.
    + Content Delivery
        - Aggregate root: Material
        - Entities/VOs: Version (VO), Visibility (VO)
        - Invariants: version publish immutable; only published version visible to learners.
        - Commands: UploadMaterial, PublishVersion.
        - Events: MaterialUploaded, MaterialVersionPublished.
    + Assessment & Feedback
        - Aggregate root(s): Assignment (thường là root) — Submission có thể là entity trong Assignment hoặc aggregate riêng nếu cần scale.
        - Entities/VOs: Submission (entity), Grade (entity or value), Rubric (VO), GradeScale (VO)
        - Invariants: grade chỉ áp dụng lên submission; late-policy áp dụng khi tạo submission.
        - Commands: PostAssignment, SubmitAssignment, GradeSubmission.
        - Events: AssignmentPosted, SubmissionCreated, SubmissionGraded.
    + Collaboration & Messaging
        - Aggregate root: Thread / Message
        - Entities/VOs: Notification (có thể aggregate riêng)
        - Invariants: visibility controlled by course membership/roles.
        - Events: MessageSent, NotificationDelivered.
    + Analytics & Reporting
        - Không phải aggregate write-model: là tập các projections/read-models (CourseAnalytics, ProgressAnalytics).
        - Cách cập nhật: tiêu thụ events bất đồng bộ; eventual consistency.

= Tác dụng của bounded contexts cho việc code
    + Cấu trúc project & module hóa
        - Nguyên tắc: code theo context, không theo layers toàn cục.
        - Ví dụ cấu trúc (modular monolith hoặc microservices):
```
/services
  /iam
    /src
      /domain
      /application
      /infrastructure
      /api
  /course
    /src
      /domain
      /application
      /infrastructure
      /api
  /assessment
  /analytics
```
        - Lợi ích: rõ ownership, dễ refactor, dễ tách service ra microservice.
    + Interface & repository boundaries
        - Mỗi context định nghĩa interface repository trong domain layer; triển khai cụ thể (ORM/Prisma/SQL) nằm trong infrastructure.
        - Các context khác truy cập dữ liệu chỉ qua API hoặc bằng event (không truy vấn DB trực tiếp của context khác).
``` 
 course/domain/ICourseRepository.ts
export interface ICourseRepository {
  save(course: Course): Promise<void>;
  findById(courseId: string): Promise<Course | null>;
}
```
    + Transaction boundaries & invariants
        - Mỗi aggregate là đơn vị transaction: giữ invariant bên trong aggregate.
        - Không cố gắng làm 1 transaction xuyên nhiều aggregate; thay vào đó dùng events/sagas cho consistency xuyên aggregates.
    + Giao tiếp giữa contexts
        - Synchronous: REST/gRPC cho các truy vấn cần kết quả ngay.
        - Asynchronous: Domain events cho cập nhật bất đồng bộ (SubmissionCreated → Analytics; EnrollmentApproved → Notification).
        - Giữ payload nhỏ (IDs + metadata) để tránh coupling.
    + Anti-Corruption Layer (ACL)
        - Khi tích hợp legacy/3rd-party, bọc mô hình bên ngoài bằng Adapter/Translator để không làm bẩn model nội bộ.
    + DB strategy & data ownership
        - Một DB/chủ quyền per context nếu microservices; nếu monolith thì tách schema hoặc đặt tiền tố.
        - Tránh join trực tiếp giữa các schema context khác nhau.
    + Testing strategy
        - Unit tests: domain logic, invariants (inside aggregate).
        - Integration tests: repository + infra.
        - Contract tests: consumer-driven contracts cho events/REST giữa services.
        - E2E tests cho user flows.
    + Deployment & scaling
        - Contexts độc lập cho phép scale theo nhu cầu (Analytics/ContentDelivery có thể scale cao hơn).
        - CI/CD: build & deploy theo service/context.
    + Ví dụ code flow (Submit -> Analytics -> Notify)
        - Learner gửi submission → Assessment context tạo Submission và publish event SubmissionCreated { submissionId, assignmentId, userId }.
        - Analytics context tiêu thụ event và cập nhật projection ProgressAnalytics.
        - Notification context tiêu thụ event và tạo thông báo cho instructor (or for student confirmations).
    + Checklist & best practices khi code theo bounded contexts
        - Mỗi context có folder/service riêng (domain/application/infrastructure/api).
        - Repository interfaces nằm trong domain layer.
        - Không truy cập DB của context khác. Dùng API hoặc events.
        - Events versioned; publish/subscribe qua message broker.
        - Aggregate giữ invariants; unit test chịu trách nhiệm kiểm tra các invariants.
        - Sử dụng contract tests để bảo đảm consumers không bị break.
        - Sử dụng ACL khi tích hợp external systems.
