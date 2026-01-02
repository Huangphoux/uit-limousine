# GridFS Migration for Course Thumbnails

## Tổng quan

Đã chuyển hệ thống lưu trữ course thumbnail từ **filesystem** sang **MongoDB GridFS** để đồng bộ giữa các máy khi dùng Docker.

## Thay đổi

### Backend

1. **media.controller.js** - Upload thumbnail vào GridFS

   - `POST /media/upload` → Lưu vào GridFS, trả về `/media/download/:fileId`
   - `GET /media/download/:fileId` → Stream ảnh từ GridFS

2. **media.route.js** - Thêm download endpoint

### Frontend

Không cần thay đổi - `normalizeMediaUrl()` tự động xử lý URL mới.

## Lợi ích

✅ **Đồng bộ giữa các máy**: MongoDB được share qua network → Tất cả máy thấy cùng ảnh  
✅ **Không cần shared volume**: Không cần cấu hình NFS hoặc cloud storage  
✅ **Dễ backup**: Backup MongoDB = backup cả database + files  
✅ **Consistent với lesson resources**: Cùng storage mechanism

## Migration

### Bước 1: Chạy migration cho ảnh cũ (Optional)

```bash
cd server
node scripts/migrate-covers-to-gridfs.js
```

Xóa file cũ sau khi migrate:

```bash
node scripts/migrate-covers-to-gridfs.js --delete-old
```

### Bước 2: Test upload mới

1. Login as instructor
2. Tạo/edit course và upload thumbnail
3. Kiểm tra URL trả về: `/media/download/{fileId}` (không phải `/uploads/covers/`)
4. Verify ảnh hiển thị chính xác

### Bước 3: Test cross-machine sync

1. Máy A: Upload thumbnail cho course
2. Máy B: Truy cập cùng course → Phải thấy thumbnail

## Troubleshooting

### Ảnh không hiển thị

**Kiểm tra URL:**

```javascript
// Đúng (GridFS)
coverImage: "/media/download/67890abcdef1234567890abc";

// Sai (filesystem cũ)
coverImage: "/uploads/covers/image_123456_abc.jpg";
```

**Kiểm tra MongoDB connection:**

```bash
# Trong server container
docker exec -it server sh
node -e "const m=require('mongoose');m.connect(process.env.MONGO_URL).then(()=>console.log('OK'))"
```

### Migration script lỗi

**File not found:**

- Ảnh cũ đã bị xóa → Skip và update course với placeholder
- Đường dẫn sai → Kiểm tra UPLOAD_DIR env variable

**MongoDB connection failed:**

- Verify MONGO_URL trong .env
- Đảm bảo MongoDB container đang chạy

## Rollback (Nếu cần)

1. Restore code cũ từ git
2. Run migration ngược (filesystem ← GridFS):
   ```bash
   node scripts/migrate-covers-from-gridfs.js
   ```
3. Update course records với filesystem URLs

## Performance

- **GridFS overhead**: ~5-10% so với filesystem trực tiếp
- **Caching**: Response có `Cache-Control: max-age=31536000` header
- **Bandwidth**: Tương tự filesystem serving qua express.static

## Lưu ý

⚠️ **GridFS không tự động xóa file cũ** khi update thumbnail  
→ Cần implement cleanup job hoặc cascade delete

⚠️ **File size limit**: Default 16MB per file (MongoDB document size limit)  
→ Đủ cho thumbnail, nhưng nếu cần video nặng thì dùng GridFS chunking

## Code References

- Upload: [server/src/presentation_layer/controllers/media.controller.js](../server/src/presentation_layer/controllers/media.controller.js)
- Download: [server/src/presentation_layer/routes/media.route.js](../server/src/presentation_layer/routes/media.route.js)
- Storage: [server/src/infrastructure_layer/storage/lesson-resource-storage.js](../server/src/infrastructure_layer/storage/lesson-resource-storage.js)
- Migration: [server/scripts/migrate-covers-to-gridfs.js](../server/scripts/migrate-covers-to-gridfs.js)
