import multer from 'multer';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/vnd.rar',
  'application/octet-stream',
  'application/x-7z-compressed',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/json',
  'application/xml',
  'text/xml'
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Please upload ZIP, RAR, 7z, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, or image files.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: fileFilter
});

export function submissionUploadMiddleware(req, res, next) {
  const uploadHandler = upload.single('file');

  uploadHandler(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds the limit of 20MB'
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name. Use "file" as the field name'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    next();
  });
}

export { MAX_FILE_SIZE, ALLOWED_MIME_TYPES };
