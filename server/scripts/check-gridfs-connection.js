/**
 * Script kiểm tra kết nối MongoDB và xem files trong GridFS
 * Chạy script này trên máy người khác để verify đã kết nối đúng
 */

import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function checkConnection() {
  try {
    console.log("\n🔍 Checking MongoDB connection and GridFS files...\n");

    const mongoUrl = process.env.MONGO_URL;
    console.log("MongoDB URL:", mongoUrl.replace(/\/\/.*@/, "//<credentials>@"));

    // Connect
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB\n");

    // Check GridFS files
    const bucket = new GridFSBucket(mongoose.connection.db);
    const files = await bucket.find().toArray();

    console.log(`📊 Total files in GridFS: ${files.length}\n`);

    if (files.length === 0) {
      console.log("⚠️  No files found in GridFS");
      console.log("   → Upload some thumbnails on the host machine first\n");
    } else {
      console.log("Files:");
      files.forEach((f, i) => {
        const size = (f.length / 1024).toFixed(2);
        const date = f.uploadDate.toLocaleString();
        console.log(`  ${i + 1}. ${f.filename}`);
        console.log(`     ID: ${f._id}`);
        console.log(`     Size: ${size} KB`);
        console.log(`     Type: ${f.contentType || "unknown"}`);
        console.log(`     Uploaded: ${date}\n`);
      });

      console.log("✅ You can access these files via:");
      console.log("   GET http://localhost:3000/media/download/<fileId>\n");

      // Test download first file
      const testFile = files[0];
      console.log(`🧪 Testing download of first file: ${testFile.filename}`);
      console.log(`   URL: /media/download/${testFile._id}`);
    }

    // Check database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`\n📦 Database collections: ${collections.map((c) => c.name).join(", ")}`);

    // Check courses
    const coursesCount = await db.collection("Course").countDocuments();
    console.log(`📚 Courses in database: ${coursesCount}`);

    if (coursesCount > 0) {
      const sampleCourse = await db.collection("Course").findOne({});
      console.log("\n📖 Sample course:");
      console.log(`   Title: ${sampleCourse.title}`);
      console.log(`   CoverImage: ${sampleCourse.coverImage || "none"}`);

      if (sampleCourse.coverImage?.startsWith("/media/download/")) {
        console.log("   ✅ Using GridFS format!");
      }
    }

    console.log("\n✅ Connection check complete!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Check MONGO_URL in server/.env");
    console.error("2. Make sure MongoDB is running");
    console.error("3. Check network connectivity");
    console.error("4. Verify MongoDB port 27017 is accessible\n");
  } finally {
    await mongoose.disconnect();
  }
}

checkConnection();
