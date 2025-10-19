= API Design Specification

Tài liệu này mô tả thiết kế API RESTful cho hệ thống Learning Management System (LMS).

== 1. Tổng quan

- Base URL: `https://uit-limousine.netlify.app/`

- Authentication: JWT Bearer Token

- Content-Type: `application/json`

- Response Format: JSON

- Quy trình đặc biệt:

- Quy trình tạo khóa học (Course Creation via Request):
    + Bất kỳ ai cũng có thể đăng ký tài khoản (`POST /auth/register`) - role mặc định: LEARNER
    + Người dùng muốn tạo khóa học → nộp "Request to Create Course" (`POST /instructor-applications`)
    + Admin xem xét đơn yêu cầu (`GET /admin/instructor-applications?status=PENDING`)
    + Admin phê duyệt (`PUT /admin/instructor-applications/:id/approve`):
        - Admin tạo khóa học (`POST /admin/courses`)
        - Hệ thống gán người yêu cầu làm instructor cho khóa học đó
        - Hệ thống cấp instructor privileges (course-level hoặc global tùy policy)
    + Instructor có thể chỉnh sửa (`PUT /courses/:id`) và xuất bản (`POST /courses/:id/publish`) khóa học

== 2. Authentication & Authorization

=== 2.1. Register (UC-01)

- Lưu ý: Anyone can register an account. All new accounts default to LEARNER role. Email verification may be required before account becomes active.

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "Nguyen Van A"
}

Response 201 Created:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "roles": ["LEARNER"],
    "emailVerified": false,
    "createdAt": "2025-10-14T10:00:00Z"
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

=== 2.2. Login (UC-01)

```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securePassword123"
}

Response 200 OK:
{
  "success": true,
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "fullName": "Nguyen Van A",
      "role": "LEARNER"
    }
  }
}
```

=== 2.3. Logout (UC-01)

```http
POST /auth/logout
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "message": "Logged out successfully"
}
```

=== 2.4. Reset Password (UC-01)

```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "student@example.com"
}

Response 200 OK:
{
  "success": true,
  "message": "Password reset email sent"
}
```

== 3. User Management

=== 3.1. Get User Profile

```http
GET /users/:id
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "Nguyen Van A",
    "role": "LEARNER",
    "avatar": "https://cdn.example.com/avatars/user.jpg",
    "createdAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 3.2. Update User Profile

```http
PUT /users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Nguyen Van B",
  "avatar": "https://cdn.example.com/avatars/new-avatar.jpg"
}

Response 200 OK:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "Nguyen Van B",
    "avatar": "https://cdn.example.com/avatars/new-avatar.jpg"
  }
}
```

=== 3.3. Admin Manage Users (UC-17)

```http
GET /admin/users?page=1&limit=10&role=LEARNER
Authorization: Bearer {admin_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "users": [...],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}

PUT /admin/users/:id/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "INSTRUCTOR"
}
```

== 4. Course Management

=== 4.1. List Courses (UC-02)

```http
GET /courses?search=nodejs&category=programming&page=1&limit=10
Authorization: Bearer {token} (optional for guests)

Response 200 OK:
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Introduction to Node.js",
        "description": "Learn Node.js from scratch",
        "instructor": {
          "id": "uuid",
          "fullName": "Tran Van C"
        },
        "thumbnail": "https://cdn.example.com/thumbnails/course.jpg",
        "rating": 4.5,
        "enrollmentCount": 120,
        "price": 500000,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

=== 4.2. Get Course Details (UC-03)

```http
GET /courses/:id
Authorization: Bearer {token} (optional for guests)

Response 200 OK:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Introduction to Node.js",
    "slug": "introduction-to-nodejs",
    "shortDesc": "Learn Node.js from scratch",
    "description": "Complete course description with detailed curriculum",
    "level": "BEGINNER",
    "language": "vi",
    "instructor": {
      "id": "uuid",
      "fullName": "Tran Van C",
      "avatarUrl": "https://cdn.example.com/avatars/instructor.jpg",
      "bio": "Experienced developer"
    },
    "modules": [
      {
        "id": "uuid",
        "title": "Module 1: Basics",
        "position": 1,
        "lessons": [...]
      }
    ],
    "rating": 4.5,
    "reviewCount": 45,
    "enrollmentCount": 120,
    "price": 500000,
    "published": true,
    "publishDate": "2025-01-01T00:00:00Z",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

=== 4.3. Request to Create Course & Instructor Approval (UC-08, UC-11)

Quy trình: 
1. Người dùng đã đăng ký muốn tạo khóa học → nộp "Request to Create Course" (InstructorApplication)
2. Admin xem xét đơn yêu cầu
3. Nếu được chấp thuận:
   - Admin tạo khóa học
   - Admin gán người yêu cầu làm instructor cho khóa học đó
   - Người yêu cầu được cấp quyền instructor (course-level hoặc global tùy policy)
4. Nếu bị từ chối → thông báo cho người yêu cầu kèm lý do

```http
POST /instructor-applications
Authorization: Bearer {learner_token}
Content-Type: application/json

{
  "requestedCourseTitle": "Advanced React Development",
  "requestedCourseSummary": "Master React with advanced concepts including hooks, context, and performance optimization",
  "portfolioUrl": "https://github.com/username/react-projects"
}

Response 201 Created:
{
  "success": true,
  "data": {
    "id": "uuid",
    "requestedCourseTitle": "Advanced React Development",
    "status": "PENDING",
    "appliedAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 4.4. Admin Review Course Creation Request (UC-08)

```http
GET /admin/instructor-applications?status=PENDING&page=1&limit=20
Authorization: Bearer {admin_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "requestedCourseTitle": "Advanced React Development",
        "requestedCourseSummary": "Master React with advanced concepts",
        "portfolioUrl": "https://github.com/username/react-projects",
        "applicant": {
          "id": "uuid",
          "name": "Nguyen Van A",
          "email": "user@example.com"
        },
        "status": "PENDING",
        "appliedAt": "2025-10-14T10:00:00Z"
      }
    ],
    "total": 5
  }
}

PUT /admin/instructor-applications/:applicationId/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "note": "Approved. Good course proposal.",
  "courseTitle": "Advanced React Development",
  "courseSlug": "advanced-react-development",
  "shortDesc": "Master React with advanced concepts",
  "description": "Complete course description here",
  "price": 800000
}

Response 200 OK:
{
  "success": true,
  "data": {
    "applicationId": "uuid",
    "status": "APPROVED",
    "courseId": "uuid",
    "instructorId": "uuid",
    "reviewedAt": "2025-10-15T10:00:00Z"
  },
  "message": "Course creation request approved. Course created and user assigned as instructor."
}

PUT /admin/instructor-applications/:applicationId/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "note": "Insufficient detail in course proposal. Please provide more information about course structure and content."
}

Response 200 OK:
{
  "success": true,
  "data": {
    "applicationId": "uuid",
    "status": "REJECTED",
    "reviewedAt": "2025-10-15T10:00:00Z"
  }
}
```

=== 4.5. Admin Create Course (After Approval) (UC-11)

Lưu ý: Chỉ Admin mới có thể tạo khóa học trực tiếp. Endpoint này được gọi tự động khi Admin approve course creation request. Admin assigns the requester as the course instructor.

```http
POST /admin/courses
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Advanced React Development",
  "slug": "advanced-react-development",
  "shortDesc": "Master React with advanced concepts",
  "description": "Complete description with detailed curriculum and learning outcomes",
  "level": "INTERMEDIATE",
  "language": "vi",
  "instructorId": "uuid",
  "price": 800000,
  "published": false
}

Response 201 Created:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Advanced React Development",
    "slug": "advanced-react-development",
    "shortDesc": "Master React with advanced concepts",
    "level": "INTERMEDIATE",
    "instructor": {
      "id": "uuid",
      "fullName": "Nguyen Van A",
      "role": "INSTRUCTOR"
    },
    "published": false,
    "price": 800000,
    "createdAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 4.6. Update Course (UC-12)

```http
PUT /courses/:id
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "title": "Advanced React Development - Updated",
  "description": "Updated description",
  "price": 900000
}

Response 200 OK:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Advanced React Development - Updated",
    "updatedAt": "2025-10-14T11:00:00Z"
  }
}
```

=== 4.7. Publish Course (UC-11)

```http
POST /courses/:id/publish
Authorization: Bearer {instructor_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "id": "uuid",
    "published": true,
    "publishDate": "2025-10-14T12:00:00Z"
  }
}
```

=== 4.8. Get Course Enrollments

```http
GET /courses/:id/enrollments?page=1&limit=20
Authorization: Bearer {instructor_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "uuid",
        "student": {
          "id": "uuid",
          "fullName": "Nguyen Van A",
          "email": "student@example.com"
        },
        "enrolledAt": "2025-10-01T00:00:00Z",
        "progress": 45.5,
        "status": "ACTIVE"
      }
    ],
    "total": 120
  }
}
```

== 5. Enrollment Management

=== 5.1. Enroll in Course (UC-04)

```http
POST /courses/:courseId/enroll
Authorization: Bearer {learner_token}

Response 201 Created:
{
  "success": true,
  "data": {
    "enrollmentId": "uuid",
    "courseId": "uuid",
    "studentId": "uuid",
    "enrolledAt": "2025-10-14T10:00:00Z",
    "status": "ACTIVE"
  }
}
```

=== 5.2. Get Enrolled Courses

```http
GET /enrollments/my-courses?status=ACTIVE&page=1&limit=10
Authorization: Bearer {learner_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "uuid",
        "course": {
          "id": "uuid",
          "title": "Introduction to Node.js",
          "thumbnail": "url"
        },
        "progress": 35.5,
        "enrolledAt": "2025-10-01T00:00:00Z",
        "lastAccessedAt": "2025-10-14T09:00:00Z"
      }
    ],
    "total": 5
  }
}
```

=== 5.3. Approve Enrollment (UC-07)

```http
POST /courses/:courseId/enrollments/:studentId/approve
Authorization: Bearer {instructor_token}

Response 200 OK:
{
  "success": true,
  "message": "Enrollment approved"
}
```

== 6. Learning Materials

=== 6.1. Get Course Materials (UC-05, UC-10)

```http
GET /courses/:courseId/materials
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": {
    "modules": [
      {
        "id": "uuid",
        "title": "Module 1: Introduction",
        "order": 1,
        "lessons": [
          {
            "id": "uuid",
            "title": "Lesson 1: Setup",
            "type": "VIDEO",
            "content": "https://cdn.example.com/videos/lesson1.mp4",
            "duration": 1800,
            "order": 1,
            "isCompleted": false
          }
        ]
      }
    ]
  }
}
```

=== 6.2. Upload Material (UC-11)

```http
POST /materials
Authorization: Bearer {instructor_token}
Content-Type: multipart/form-data

{
  "courseId": "uuid",
  "moduleId": "uuid",
  "title": "Lesson 2: Variables",
  "type": "VIDEO",
  "file": <binary>
}

Response 201 Created:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Lesson 2: Variables",
    "url": "https://cdn.example.com/videos/lesson2.mp4",
    "uploadedAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 6.3. Mark Lesson Complete (UC-05)

```http
POST /lessons/:lessonId/complete
Authorization: Bearer {learner_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "lessonId": "uuid",
    "completedAt": "2025-10-14T10:30:00Z",
    "courseProgress": 40.0
  }
}
```

== 7. Assignments & Submissions

=== 7.1. Get Assignments (UC-11)

```http
GET /courses/:courseId/assignments
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Assignment 1: Build a REST API",
      "description": "Create a simple REST API using Express",
      "dueDate": "2025-11-01T23:59:59Z",
      "maxScore": 100,
      "allowedFormats": ["PDF", "ZIP"],
      "maxFileSize": 52428800,
      "status": "OPEN"
    }
  ]
}
```

=== 7.2. Create Assignment (UC-11)

```http
POST /assignments
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "courseId": "uuid",
  "moduleId": "uuid",
  "title": "Assignment 2: Database Design",
  "description": "Design a database schema",
  "dueDate": "2025-11-15T23:59:59Z",
  "maxScore": 100,
  "allowedFormats": ["PDF", "DOCX"],
  "maxFileSize": 10485760
}

Response 201 Created:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Assignment 2: Database Design",
    "createdAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 7.3. Submit Assignment (UC-06)

```http
POST /assignments/:assignmentId/submit
Authorization: Bearer {learner_token}
Content-Type: multipart/form-data

{
  "file": <binary>,
  "comment": "My submission for assignment 1"
}

Response 201 Created:
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "assignmentId": "uuid",
    "submittedAt": "2025-10-20T15:30:00Z",
    "status": "SUBMITTED",
    "isLate": false
  }
}
```

=== 7.4. Get Submissions (UC-13)

```http
GET /assignments/:assignmentId/submissions?status=SUBMITTED&page=1&limit=20
Authorization: Bearer {instructor_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "student": {
          "id": "uuid",
          "fullName": "Nguyen Van A",
          "email": "student@example.com"
        },
        "fileUrl": "https://cdn.example.com/submissions/file.pdf",
        "submittedAt": "2025-10-20T15:30:00Z",
        "status": "SUBMITTED",
        "isLate": false,
        "grade": null
      }
    ],
    "total": 45
  }
}
```

=== 7.5. Grade Assignment (UC-07, UC-13)

```http
PUT /submissions/:submissionId/grade
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "score": 85,
  "feedback": "Good work! Pay attention to edge cases.",
  "status": "GRADED"
}

Response 200 OK:
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "score": 85,
    "maxScore": 100,
    "feedback": "Good work! Pay attention to edge cases.",
    "gradedAt": "2025-10-25T10:00:00Z",
    "gradedBy": {
      "id": "uuid",
      "fullName": "Tran Van C"
    }
  }
}
```

=== 7.6. View Feedback (UC-06)

```http
GET /submissions/:submissionId
Authorization: Bearer {learner_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "id": "uuid",
    "assignment": {
      "id": "uuid",
      "title": "Assignment 1: Build a REST API"
    },
    "fileUrl": "https://cdn.example.com/submissions/file.pdf",
    "submittedAt": "2025-10-20T15:30:00Z",
    "score": 85,
    "maxScore": 100,
    "feedback": "Good work! Pay attention to edge cases.",
    "gradedAt": "2025-10-25T10:00:00Z",
    "gradedBy": {
      "id": "uuid",
      "fullName": "Tran Van C"
    }
  }
}
```

== 8. Messaging & Communication

=== 8.1. Send Message (UC-10)

```http
POST /messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipientId": "uuid",
  "courseId": "uuid",
  "subject": "Question about Assignment 1",
  "body": "I have a question about the requirements..."
}

Response 201 Created:
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "threadId": "uuid",
    "sentAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 8.2. Get Messages (UC-10)

```http
GET /messages?courseId=uuid&page=1&limit=20
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": {
    "threads": [
      {
        "id": "uuid",
        "subject": "Question about Assignment 1",
        "participants": [...],
        "lastMessage": {
          "body": "I have a question...",
          "sentAt": "2025-10-14T10:00:00Z"
        },
        "unreadCount": 2
      }
    ],
    "total": 10
  }
}
```

=== 8.3. Get Thread Messages (UC-10)

```http
GET /messages/thread/:threadId
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": {
    "thread": {
      "id": "uuid",
      "subject": "Question about Assignment 1",
      "messages": [
        {
          "id": "uuid",
          "sender": {
            "id": "uuid",
            "fullName": "Nguyen Van A"
          },
          "body": "I have a question...",
          "sentAt": "2025-10-14T10:00:00Z"
        }
      ]
    }
  }
}
```

== 9. Notifications

=== 9.1. Get Notifications (UC-09)

```http
GET /notifications?status=UNREAD&page=1&limit=20
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "ASSIGNMENT_GRADED",
        "title": "Assignment graded",
        "body": "Your assignment has been graded: 85/100",
        "relatedId": "submission_uuid",
        "isRead": false,
        "createdAt": "2025-10-14T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "total": 20
  }
}
```

=== 9.2. Mark as Read

```http
PUT /notifications/:id/read
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "message": "Notification marked as read"
}
```

== 10. Analytics & Reports

=== 10.1. Student Progress (UC-17)

```http
GET /analytics/student/:studentId/progress?courseId=uuid
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": {
    "overallProgress": 45.5,
    "completedLessons": 10,
    "totalLessons": 22,
    "averageGrade": 82.5,
    "assignments": {
      "completed": 3,
      "pending": 2,
      "total": 5
    },
    "lastAccessedAt": "2025-10-14T09:00:00Z"
  }
}
```

=== 10.2. Course Analytics (UC-13, UC-18)

```http
GET /analytics/course/:courseId
Authorization: Bearer {instructor_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "enrollmentCount": 120,
    "activeStudents": 95,
    "completionRate": 68.5,
    "averageProgress": 55.2,
    "assignmentSubmissionRate": 85.3,
    "averageGrade": 78.5,
    "topLessons": [
      {
        "lessonId": "uuid",
        "title": "Lesson 3: Functions",
        "viewCount": 115
      }
    ],
    "engagementMetrics": {
      "avgTimeSpent": 3600,
      "discussionPosts": 45
    }
  }
}
```

=== 10.3. Export Report (UC-13)

```http
GET /analytics/course/:courseId/export?format=csv
Authorization: Bearer {instructor_token}

Response 200 OK:
Content-Type: text/csv
Content-Disposition: attachment; filename="course-report.csv"

[CSV data]
```

== 11. Course Creation Request Management (UC-08)

Lưu ý quan trọng:
- Approval as instructor is tied to course creation intent (not a general automatic upgrade)
- Quy trình:
  + Người dùng muốn tạo khóa học → nộp "Request to Create Course"
  + Admin xem xét và phê duyệt/từ chối
  + Nếu được chấp thuận:
    * Admin tạo khóa học
    * Admin gán người yêu cầu làm instructor cho khóa học đó
    * Người yêu cầu được cấp instructor privileges (course-level hoặc global tùy policy)
- Một người có thể nộp nhiều course creation requests (để tạo nhiều khóa học khác nhau)

=== 11.1. Get My Course Creation Requests

```http
GET /instructor-applications/my-applications?status=PENDING&page=1&limit=10
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "requestedCourseTitle": "Advanced React Development",
        "requestedCourseSummary": "Master React with advanced concepts",
        "portfolioUrl": "https://github.com/username/react-projects",
        "status": "PENDING",
        "appliedAt": "2025-10-14T10:00:00Z",
        "reviewedAt": null,
        "note": null
      },
      {
        "id": "uuid",
        "requestedCourseTitle": "Python for Data Science",
        "requestedCourseSummary": "Complete Python data science course",
        "portfolioUrl": "https://github.com/username/python-projects",
        "status": "APPROVED",
        "appliedAt": "2025-09-01T10:00:00Z",
        "reviewedAt": "2025-09-05T14:00:00Z",
        "note": "Approved. Great proposal.",
        "courseId": "uuid"
      }
    ],
    "total": 2
  }
}
```

=== 11.2. Update Course Creation Request (Before Approval)

```http
PUT /instructor-applications/:applicationId
Authorization: Bearer {token}
Content-Type: application/json

{
  "requestedCourseTitle": "Advanced React Development - Updated",
  "requestedCourseSummary": "Updated description with more details about hooks, context, and performance",
  "portfolioUrl": "https://github.com/username/react-advanced-projects"
}

Response 200 OK:
{
  "success": true,
  "data": {
    "id": "uuid",
    "requestedCourseTitle": "Advanced React Development - Updated",
    "appliedAt": "2025-10-14T10:00:00Z"
  }
}

Response 400 Bad Request (if already reviewed):
{
  "success": false,
  "error": {
    "code": "APPLICATION_ALREADY_REVIEWED",
    "message": "Cannot update application after admin review"
  }
}
```

=== 11.3. Cancel Course Creation Request

```http
DELETE /instructor-applications/:applicationId
Authorization: Bearer {token}

Response 200 OK:
{
  "success": true,
  "message": "Course creation request cancelled successfully"
}
```

== 12. Reviews & Ratings

=== 12.1. Submit Review (UC-15)

```http
POST /courses/:courseId/reviews
Authorization: Bearer {learner_token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent course! Highly recommended."
}

Response 201 Created:
{
  "success": true,
  "data": {
    "reviewId": "uuid",
    "courseId": "uuid",
    "rating": 5,
    "createdAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 12.2. Get Course Reviews (UC-15)

```http
GET /courses/:courseId/reviews?page=1&limit=10&sort=recent
Authorization: Bearer {token} (optional)

Response 200 OK:
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "student": {
          "id": "uuid",
          "fullName": "Nguyen Van A",
          "avatar": "url"
        },
        "rating": 5,
        "comment": "Excellent course! Highly recommended.",
        "createdAt": "2025-10-14T10:00:00Z"
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 45
  }
}
```

== 13. Certificates

=== 13.1. Issue Certificate (UC-14)

```http
POST /certificates/issue
Authorization: Bearer {instructor_token}
Content-Type: application/json

{
  "studentId": "uuid",
  "courseId": "uuid"
}

Response 201 Created:
{
  "success": true,
  "data": {
    "certificateId": "uuid",
    "certificateUrl": "https://cdn.example.com/certificates/cert.pdf",
    "verificationCode": "ABC123XYZ",
    "issuedAt": "2025-10-14T10:00:00Z"
  }
}
```

=== 13.2. Verify Certificate (UC-14)

```http
GET /certificates/verify/:verificationCode

Response 200 OK:
{
  "success": true,
  "data": {
    "valid": true,
    "student": {
      "fullName": "Nguyen Van A"
    },
    "course": {
      "title": "Introduction to Node.js"
    },
    "issuedAt": "2025-10-14T10:00:00Z"
  }
}
```

== 14. Payment

=== 14.1. Create Checkout Session (UC-16)

```http
POST /payments/checkout
Authorization: Bearer {learner_token}
Content-Type: application/json

{
  "courseId": "uuid",
  "paymentMethod": "CARD",
  "couponCode": "DISCOUNT20"
}

Response 201 Created:
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "amount": 720000,
    "currency": "VND",
    "paymentUrl": "https://payment-gateway.com/checkout/session_id"
  }
}
```

=== 14.2. Payment Webhook (UC-16)

```http
POST /payments/webhook
Content-Type: application/json

{
  "sessionId": "uuid",
  "status": "SUCCESS",
  "transactionId": "txn_123",
  "amount": 720000
}

Response 200 OK:
{
  "success": true,
  "message": "Payment processed"
}
```

=== 14.3. Get Payment History (UC-16)

```http
GET /payments/history?page=1&limit=10
Authorization: Bearer {learner_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "uuid",
        "course": {
          "id": "uuid",
          "title": "Introduction to Node.js"
        },
        "amount": 720000,
        "currency": "VND",
        "status": "SUCCESS",
        "paidAt": "2025-10-01T10:00:00Z"
      }
    ],
    "total": 5
  }
}
```

== 15. Admin & System

=== 15.1. System Logs (UC-18)

```http
GET /admin/logs?type=AUTH&startDate=2025-10-01&endDate=2025-10-14&page=1&limit=50
Authorization: Bearer {admin_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "type": "AUTH",
        "action": "LOGIN",
        "user": {
          "id": "uuid",
          "email": "user@example.com"
        },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2025-10-14T10:00:00Z"
      }
    ],
    "total": 500
  }
}
```

=== 15.2. System Settings (UC-18)

```http
GET /admin/settings
Authorization: Bearer {admin_token}

Response 200 OK:
{
  "success": true,
  "data": {
    "siteName": "LMS Platform",
    "logo": "https://cdn.example.com/logo.png",
    "features": {
      "enablePayments": true,
      "enableCertificates": true,
      "enableMessaging": true
    },
    "policies": {
      "lateSubmissionPenalty": 10,
      "maxFileSize": 52428800
    }
  }
}

PUT /admin/settings
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "siteName": "My LMS Platform",
  "features": {
    "enablePayments": true
  }
}
```

=== 15.3. System Health

```http
GET /health

Response 200 OK:
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-14T10:00:00Z",
    "services": {
      "database": "healthy",
      "storage": "healthy",
      "cache": "healthy"
    }
  }
}
```

== 16. Error Responses

Tất cả các API endpoint đều sử dụng format lỗi chuẩn:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

Error Codes:
- `400 Bad Request`: VALIDATION_ERROR, INVALID_INPUT, APPLICATION_ALREADY_REVIEWED
- `401 Unauthorized`: UNAUTHORIZED, TOKEN_EXPIRED
- `403 Forbidden`: FORBIDDEN, INSUFFICIENT_PERMISSIONS, NOT_INSTRUCTOR
- `404 Not Found`: NOT_FOUND, RESOURCE_NOT_FOUND
- `409 Conflict`: DUPLICATE_ENTRY, ALREADY_EXISTS, DUPLICATE_APPLICATION
- `500 Internal Server Error`: INTERNAL_ERROR, DATABASE_ERROR

== 17. Rate Limiting

Tất cả các API endpoint đều có rate limiting:

- Authentication endpoints: 5 requests/minute
- Read operations: 100 requests/minute
- Write operations: 30 requests/minute
- File uploads: 10 requests/minute

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634203200
```

== 18. Pagination

Tất cả list endpoints sử dụng pagination chuẩn:

Query Parameters:
- `page`: Số trang (default: 1)
- `limit`: Số items mỗi trang (default: 10, max: 100)
- `sort`: Trường sắp xếp (default: createdAt)
- `order`: Thứ tự (asc/desc, default: desc)

Response Format:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```
