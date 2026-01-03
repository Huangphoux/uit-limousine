/**
 * Test script để kiểm tra GridFS thumbnail upload
 */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";

const API_URL = "http://localhost:3000";

async function testUpload() {
  console.log("🧪 Testing GridFS thumbnail upload...\n");

  // Tìm một ảnh bất kỳ trong thư mục covers để test
  const coversDir = path.join(process.cwd(), "uploads", "covers");

  if (!fs.existsSync(coversDir)) {
    console.log("❌ No uploads/covers directory found");
    console.log("💡 Tạo file test image...");

    // Tạo file test nhỏ
    const testDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    const testFile = path.join(testDir, "test-image.txt");
    fs.writeFileSync(testFile, "This is a test file to simulate image upload");

    await uploadFile(testFile);
    return;
  }

  const files = fs.readdirSync(coversDir).filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

  if (files.length === 0) {
    console.log("❌ No image files found in uploads/covers");
    return;
  }

  const testFile = path.join(coversDir, files[0]);
  await uploadFile(testFile);
}

async function uploadFile(filePath) {
  console.log(`📤 Uploading: ${path.basename(filePath)}\n`);

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  try {
    const response = await fetch(`${API_URL}/media/upload`, {
      method: "POST",
      body: form,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Upload successful!\n");
      console.log("Response:", JSON.stringify(result, null, 2));

      if (result.data?.fileUrl) {
        const fileUrl = result.data.fileUrl;
        console.log("\n📊 GridFS Check:");
        console.log("  Old format (filesystem): /uploads/covers/image_123.jpg");
        console.log("  New format (GridFS):     " + fileUrl);

        if (fileUrl.startsWith("/media/download/")) {
          console.log("\n✅ ✅ ✅ GridFS is working correctly!");
          console.log("File ID:", result.data.fileId);

          // Test download
          console.log("\n🔽 Testing download...");
          const downloadUrl = `${API_URL}${fileUrl}`;
          const downloadRes = await fetch(downloadUrl);

          if (downloadRes.ok) {
            console.log("✅ Download successful!");
            console.log("   Content-Type:", downloadRes.headers.get("content-type"));
            console.log("   Content-Length:", downloadRes.headers.get("content-length"));
          } else {
            console.log("❌ Download failed:", downloadRes.status);
          }
        } else {
          console.log("\n⚠️  WARNING: Still using filesystem URL!");
          console.log("GridFS migration may not be working.");
        }
      }
    } else {
      console.log("❌ Upload failed:", result);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testUpload();
