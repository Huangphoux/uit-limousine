/**
 * Migration Script: Move existing cover images from filesystem to GridFS
 *
 * This script:
 * 1. Reads all cover images from uploads/covers/ directory
 * 2. Uploads them to MongoDB GridFS
 * 3. Updates course records with new GridFS fileId URLs
 * 4. Optionally deletes old filesystem files
 *
 * Usage: node scripts/migrate-covers-to-gridfs.js [--delete-old]
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const UPLOADS_DIR = process.env.UPLOAD_DIR || "uploads";
const COVERS_DIR = path.join(UPLOADS_DIR, "covers");
const DELETE_OLD = process.argv.includes("--delete-old");

async function main() {
  try {
    console.log("🚀 Starting cover images migration to GridFS...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const bucket = new GridFSBucket(mongoose.connection.db);

    // Check if covers directory exists
    if (!fs.existsSync(COVERS_DIR)) {
      console.log("⚠️  No covers directory found at:", COVERS_DIR);
      console.log("Nothing to migrate.");
      return;
    }

    // Get all courses with filesystem cover images
    const courses = await prisma.course.findMany({
      where: {
        coverImage: {
          startsWith: "/uploads/covers/",
        },
      },
    });

    console.log(`\n📊 Found ${courses.length} courses with filesystem cover images\n`);

    let migrated = 0;
    let failed = 0;

    for (const course of courses) {
      try {
        const relativePath = course.coverImage.replace("/uploads/", "");
        const filePath = path.join(UPLOADS_DIR, relativePath);

        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  File not found for course ${course.id}: ${filePath}`);
          failed++;
          continue;
        }

        // Read file
        const fileBuffer = fs.readFileSync(filePath);
        const filename = path.basename(filePath);
        const mimeType = getMimeType(filename);

        console.log(`📤 Uploading ${filename} for course "${course.title}"...`);

        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: mimeType,
        });

        await new Promise((resolve, reject) => {
          uploadStream.end(fileBuffer, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });

        const fileId = uploadStream.id.toHexString();
        const newUrl = `/media/download/${fileId}`;

        // Update course record
        await prisma.course.update({
          where: { id: course.id },
          data: { coverImage: newUrl },
        });

        console.log(`✅ Migrated: ${filename} → ${newUrl}`);

        // Delete old file if requested
        if (DELETE_OLD) {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted old file: ${filePath}`);
        }

        migrated++;
      } catch (error) {
        console.error(`❌ Failed to migrate cover for course ${course.id}:`, error.message);
        failed++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ Migration completed!`);
    console.log(`   Migrated: ${migrated}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total: ${courses.length}`);
    console.log("=".repeat(60) + "\n");

    if (!DELETE_OLD && migrated > 0) {
      console.log("💡 Tip: Run with --delete-old flag to remove old filesystem files");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    await prisma.$disconnect();
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

main();
