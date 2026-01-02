# Test Submission File Download Flow

## Mục đích

Kiểm tra xem khi learner nộp file assignment thì instructor có nhận được và tải về được không.

## Các bước test

### 1. Chuẩn bị

- Đảm bảo server và client đang chạy
- Có 1 tài khoản student và 1 tài khoản instructor
- Có 1 course với assignment lesson đã tạo sẵn

### 2. Phía Student (Nộp bài)

#### Bước 1: Đăng nhập với tài khoản student

- Vào trang login
- Đăng nhập bằng tài khoản student đã enroll course

#### Bước 2: Vào assignment lesson

- Navigate đến course đã enroll
- Chọn assignment lesson trong sidebar
- Xác nhận hiển thị form submission

#### Bước 3: Upload và submit file

- Click "Choose files" hoặc drag-drop file vào upload area
- Nhập content (optional)
- Click "Submit Assignment"
- **Kiểm tra:**
  - Toast hiển thị "Assignment submitted successfully!"
  - Form chuyển sang trạng thái "submitted"
  - Hiển thị file đã nộp với tên và size

#### Bước 4: Kiểm tra API call

Mở DevTools > Network tab và xác nhận:

- POST request đến: `${API_URL}/courses/assignments/{assignmentId}/submit`
- Request type: `multipart/form-data`
- Response 201 với data:

```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "data": {
    "id": "...",
    "fileUrl": "/uploads/submissions/{studentId}/{assignmentId}/...",
    "fileName": "original_name.pdf",
    "status": "SUBMITTED"
  }
}
```

### 3. Phía Instructor (Xem và tải file)

#### Bước 1: Đăng nhập với tài khoản instructor

- Logout student account
- Login với instructor account

#### Bước 2: Vào course management

- Navigate đến instructor dashboard
- Chọn course tương ứng
- Click "Edit Course" hoặc vào course detail

#### Bước 3: Xem submissions

- Chọn assignment lesson trong module list
- Click tab "Grading" (nếu có) hoặc xem submission list
- **Kiểm tra:**
  - Danh sách submissions hiển thị
  - Student name, email, submitted date hiển thị đúng
  - File name hiển thị trong cột "File"

#### Bước 4: Tải file về

- Click vào file name trong submission row
- **Kiểm tra:**
  - Browser trigger download (không mở tab mới)
  - File download thành công với tên đúng
  - File có thể mở được và nội dung chính xác

#### Bước 5: Kiểm tra API call

Mở DevTools > Network tab và xác nhận:

- GET request đến: `${API_URL}/uploads/submissions/{studentId}/{assignmentId}/{filename}`
- Response 200 với binary data
- Header `Content-Disposition: attachment; filename="..."`

## Expected Results ✓

### Student Side

- ✓ File upload thành công
- ✓ Submission được tạo với status SUBMITTED
- ✓ fileUrl được lưu đúng format: `/uploads/submissions/{studentId}/{assignmentId}/{filename}`
- ✓ Toast notification hiển thị success

### Instructor Side

- ✓ Submissions list hiển thị đúng student info
- ✓ File URL được trả về từ API: `GET /assignments/{id}/submissions`
- ✓ Click file name trigger download (không mở tab)
- ✓ File download thành công với blob API
- ✓ File có thể mở và xem nội dung

## Potential Issues & Solutions

### Issue 1: 404 Not Found khi download

**Nguyên nhân:** fileUrl không đúng hoặc file không tồn tại
**Giải pháp:**

- Kiểm tra fileUrl format trong database
- Verify file exists trong thư mục `server/uploads/submissions/`
- Check express.static middleware đã được config đúng

### Issue 2: CORS error khi download

**Nguyên nhân:** CORS policy block download request
**Giải pháp:**

- Verify CORS config trong `server/src/app.js` includes credentials: true
- Check Authorization header được gửi kèm trong fetch request

### Issue 3: File opens in new tab instead of downloading

**Nguyên nhân:** Browser default behavior với PDF/image files
**Giải pháp:**

- Sử dụng blob API + createObjectURL như đã implement
- Set Content-Disposition header ở server side

### Issue 4: Empty file or corrupted download

**Nguyên nhân:** File không được lưu đúng khi upload
**Giải pháp:**

- Verify multer middleware config: `memoryStorage()` hoặc `diskStorage()`
- Check `file.buffer` được ghi vào filesystem đúng cách
- Verify file permissions trong uploads folder

## Test Cases

### TC1: Upload PDF file

- File: test.pdf (< 10MB)
- Expected: Upload success, instructor can download và mở PDF

### TC2: Upload DOCX file

- File: assignment.docx
- Expected: Upload success, instructor can download và mở Word doc

### TC3: Upload image file

- File: screenshot.png
- Expected: Upload success, instructor can download và view image

### TC4: Upload without file (only content)

- Content: "I completed this assignment..."
- Expected: Submission success without fileUrl

### TC5: Re-submit attempt

- Student already submitted
- Expected: Error "You have already submitted this assignment"

## Debugging Steps

### 1. Check Database

```sql
-- Verify submission record
SELECT id, assignmentId, studentId, fileUrl, status, submittedAt
FROM Submission
WHERE assignmentId = '...' AND studentId = '...';
```

### 2. Check File System

```bash
# Navigate to uploads folder
cd server/uploads/submissions/{studentId}/{assignmentId}/
ls -lah
# Verify file exists and has correct size
```

### 3. Check Server Logs

- Monitor console output khi student submit
- Check logs khi instructor request submissions
- Verify file download request logs

### 4. Network Tab Analysis

- Request URL format
- Response headers
- Response body/blob data
- Error messages

## Conclusion

Luồng xử lý đã được implement đầy đủ:

1. **Student Upload:** AssignmentSubmissionUI.jsx → POST /courses/assignments/:id/submit
2. **File Storage:** FileStorageService.saveSubmissionFile() → uploads/submissions/{studentId}/{assignmentId}/
3. **Instructor View:** AssignmentGradingDetail.jsx → GET /assignments/:id/submissions
4. **File Download:** triggerFileDownload() → fetch fileUrl → blob → download

**Test Status:** Ready for manual testing ✓
