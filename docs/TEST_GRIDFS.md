# Manual Test GridFS Upload

## Test với PowerShell

```powershell
# 1. Upload một file ảnh
$file = "d:\UIT\3rd_year\CNPMCS\DoAnTestAnh\uit-limousine\server\uploads\covers\GVikTviWMAAN5CS_1767258867182_b0a45f4def931fd5.jpg"

# Nếu không có file, tạo file test
if (!(Test-Path $file)) {
    $file = "$env:TEMP\test-image.txt"
    "test content" | Out-File $file
}

# Upload
$form = @{
    file = Get-Item $file
}

$response = Invoke-WebRequest -Uri "http://localhost:3000/media/upload" -Method POST -Form $form

# Xem response
$result = $response.Content | ConvertFrom-Json
Write-Host "Response:" -ForegroundColor Green
$result | ConvertTo-Json -Depth 3

# Check URL format
if ($result.data.fileUrl -like "/media/download/*") {
    Write-Host "`n✅ GridFS is working! File URL: $($result.data.fileUrl)" -ForegroundColor Green

    # Test download
    $downloadUrl = "http://localhost:3000$($result.data.fileUrl)"
    Write-Host "`nTesting download from: $downloadUrl" -ForegroundColor Yellow

    $download = Invoke-WebRequest -Uri $downloadUrl
    Write-Host "✅ Download successful! Content-Type: $($download.Headers.'Content-Type')" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Still using filesystem URL: $($result.data.fileUrl)" -ForegroundColor Yellow
}
```

## Hoặc test trực tiếp trong browser:

1. Mở http://localhost:5174
2. Login as instructor
3. Create/Edit course
4. Upload thumbnail
5. Mở DevTools → Network tab
6. Tìm request POST `/media/upload`
7. Xem Response → `fileUrl` phải có format `/media/download/:fileId`

## Kiểm tra MongoDB:

```powershell
# Xem files trong GridFS
cd d:\UIT\3rd_year\CNPMCS\DoAnTestAnh\uit-limousine\server

node -e "const m=require('mongoose');const {GridFSBucket}=require('mongodb');require('dotenv').config();m.connect(process.env.MONGO_URL).then(()=>{const b=new GridFSBucket(m.connection.db);b.find().toArray().then(f=>{console.log('GridFS Files:',f.length);f.forEach(x=>console.log('  -',x.filename,'->',x._id.toString()));process.exit(0);})});"
```

## Proof of GridFS:

### Before (Filesystem):

- File lưu tại: `server/uploads/covers/image_123.jpg`
- URL: `/uploads/covers/image_123.jpg`
- Xóa file → Ảnh mất

### After (GridFS):

- File lưu trong: MongoDB `fs.files` + `fs.chunks` collections
- URL: `/media/download/67890abcdef1234567890abc`
- Xóa thư mục `uploads/covers/` → Ảnh vẫn hoạt động!

## Test deletion proof:

```powershell
# Backup một ảnh cũ
Copy-Item "server\uploads\covers\*.jpg" "$env:TEMP\" -Force

# Xóa thư mục covers
Remove-Item "server\uploads\covers" -Recurse -Force

# Upload ảnh mới qua GridFS
# → Ảnh mới vẫn hoạt động vì lưu trong MongoDB

# Restore nếu cần
New-Item "server\uploads\covers" -ItemType Directory -Force
Copy-Item "$env:TEMP\*.jpg" "server\uploads\covers\" -Force
```
