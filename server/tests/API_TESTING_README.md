# API Testing Guide

## Giới thiệu

File này chứa integration tests cho tất cả các API endpoints của hệ thống LMS.

## Cài đặt

```bash
cd server
npm install
```

## Chạy Tests

### Chạy tất cả tests
```bash
npm test
```

### Chạy tests với watch mode (tự động chạy lại khi có thay đổi)
```bash
npm run test:watch
```

### Chạy tests với coverage report
```bash
npm test -- --coverage
```

## Cấu trúc Tests

Test suite được chia thành các nhóm chính:

### 1. Authentication Tests
- ✅ Register new user
- ✅ Prevent duplicate registration
- ✅ Login with valid credentials
- ✅ Reject invalid password
- ✅ Reject non-existent email

### 2. Course Search Tests
- ✅ Search all courses
- ✅ Require authentication
- ✅ Search with filters
- ✅ Get course details by ID
- ✅ Handle non-existent courses

### 3. Enrollment Tests
- ✅ Enroll in a course
- ✅ Require authentication for enrollment
- ✅ Handle duplicate enrollment

### 4. Course Materials Tests
- ✅ Get course materials after enrollment
- ✅ Require authentication
- ✅ Return proper structure (modules, lessons)

### 5. Lesson Progress Tests
- ✅ Complete a lesson
- ✅ Require authentication
- ✅ Show lesson as completed
- ✅ Handle idempotent completion

### 6. Logout Tests
- ✅ Logout successfully
- ✅ Handle logout without token

### 7. Error Handling Tests
- ✅ Reject invalid tokens
- ✅ Reject malformed auth headers
- ✅ Handle non-existent endpoints

## Kết quả mong đợi

Khi chạy `npm test`, bạn sẽ thấy:

```
PASS  tests/integration/api.test.js
  LMS API Integration Tests
    1. Authentication
      ✓ 1.1 Should register a new user (XXXms)
      ✓ 1.2 Should not register with duplicate email (XXXms)
      ✓ 1.3 Should login with valid credentials (XXXms)
      ✓ 1.4 Should not login with invalid password (XXXms)
      ✓ 1.5 Should not login with non-existent email (XXXms)
    2. Course Search
      ✓ 2.1 Should search all courses with authentication (XXXms)
      ✓ 2.2 Should not search courses without authentication (XXXms)
      ✓ 2.3 Should search courses with filters (XXXms)
      ✓ 2.4 Should get course details by ID (XXXms)
      ✓ 2.5 Should return 404 for non-existent course (XXXms)
    3. Course Enrollment
      ✓ 3.1 Should enroll in a course (XXXms)
      ✓ 3.2 Should not enroll without authentication (XXXms)
      ✓ 3.3 Should handle duplicate enrollment gracefully (XXXms)
    4. Course Materials
      ✓ 4.1 Should get course materials after enrollment (XXXms)
      ✓ 4.2 Should not get materials without authentication (XXXms)
    5. Lesson Progress
      ✓ 5.1 Should complete a lesson (XXXms)
      ✓ 5.2 Should not complete lesson without authentication (XXXms)
      ✓ 5.3 Should show lesson as completed in materials (XXXms)
      ✓ 5.4 Should handle completing same lesson again (idempotent) (XXXms)
    6. Logout
      ✓ 6.1 Should logout successfully (XXXms)
      ✓ 6.2 Should logout without token (graceful) (XXXms)
    7. Error Handling
      ✓ 7.1 Should reject invalid token (XXXms)
      ✓ 7.2 Should reject malformed Authorization header (XXXms)
      ✓ 7.3 Should handle non-existent endpoints (XXXms)

Test Suites: 1 passed, 1 total
Tests:       XX passed, XX total
```

## Lưu ý quan trọng

### Database
- Tests sử dụng cùng database với môi trường development
- Mỗi test run sẽ tạo user mới với email unique (sử dụng timestamp)
- Test data sẽ được cleanup tự động sau khi tests chạy xong

### Server
- Đảm bảo database đã được seed với data mẫu:
  ```bash
  npm run seed
  ```
- Server không cần chạy riêng, Jest sẽ import app trực tiếp

### Environment Variables
- Đảm bảo file `.env` đã được cấu hình đúng
- Database URL phải trỏ đến database có thể ghi được

## Troubleshooting

### Lỗi: "Cannot find module"
```bash
npm install
```

### Lỗi: "Database connection failed"
Kiểm tra file `.env` và đảm bảo `DATABASE_URL` đúng

### Lỗi: "Port already in use"
Tests không cần server chạy riêng. Nếu server đang chạy, tắt nó đi.

### Tests fail do thiếu data
Chạy seed trước:
```bash
npm run seed
```

### Tests chạy quá lâu
Tests có timeout 30 giây. Nếu database chậm, có thể tăng timeout trong file test.

## Continuous Integration

Để chạy tests trong CI/CD pipeline:

```yaml
# Example for GitHub Actions
- name: Run tests
  run: |
    cd server
    npm install
    npm run migrate
    npm run seed
    npm test
```

## Coverage Report

Để xem coverage report chi tiết:

```bash
npm test -- --coverage
```

Report sẽ được tạo trong folder `coverage/` và có thể xem bằng browser:

```bash
open coverage/lcov-report/index.html
```

## Thêm tests mới

Để thêm test case mới, thêm vào file `tests/integration/api.test.js`:

```javascript
test('Should do something', async () => {
  const res = await request(app)
    .get('/your-endpoint')
    .set('Authorization', `Bearer ${accessToken}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('expectedField');
});
```
