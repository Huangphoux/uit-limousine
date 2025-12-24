import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default class FileStorageService {
  constructor(uploadDir = 'uploads') {
    this.uploadDir = path.resolve(uploadDir);
    this.submissionsDir = path.join(this.uploadDir, 'submissions');
    this.ensureDirectoryExists(this.submissionsDir);
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  generateFileName(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    return `${baseName}_${timestamp}_${randomString}${ext}`;
  }

  async saveSubmissionFile(file, studentId, assignmentId) {
    const studentDir = path.join(this.submissionsDir, studentId);
    const assignmentDir = path.join(studentDir, assignmentId);
    this.ensureDirectoryExists(assignmentDir);

    const fileName = this.generateFileName(file.originalname);
    const filePath = path.join(assignmentDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const relativePath = path.relative(this.uploadDir, filePath).replace(/\\/g, '/');
    const fileUrl = `/uploads/${relativePath}`;

    return {
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype
    };
  }

  async deleteFile(fileUrl) {
    if (!fileUrl) return false;
    
    const relativePath = fileUrl.replace('/uploads/', '');
    const absolutePath = path.join(this.uploadDir, relativePath);
    
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return true;
    }
    return false;
  }

  getAbsolutePath(fileUrl) {
    if (!fileUrl) return null;
    const relativePath = fileUrl.replace('/uploads/', '');
    return path.join(this.uploadDir, relativePath);
  }
}
