// // utils/cloudinary.js
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'code-repository',
//     format: async (req, file) => {
//       // Determine format based on file extension
//       const ext = file.originalname.split('.').pop();
//       return ext || 'txt';
//     },
//     public_id: (req, file) => {
//       // Generate unique filename
//       const timestamp = Date.now();
//       const randomString = Math.random().toString(36).substring(2, 8);
//       return `codefile-${timestamp}-${randomString}`;
//     },
//   },
// });

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     // Accept code files only
//     const allowedExtensions = ['.js', '.py', '.java', '.cpp', '.c', '.html', '.css', '.php', '.rb', '.go', '.rs', '.ts', '.txt', '.md'];
//     const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    
//     if (allowedExtensions.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('File type not allowed'), false);
//     }
//   }
// });

// module.exports = { cloudinary, upload };





// utils/cloudinary.js
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// // Enhanced configuration validation
// const validateCloudinaryConfig = () => {
//   try {
//     const required = ['cloud_name', 'api_key', 'api_secret'];
//     const missing = required.filter(key => {
//       const envKey = `CLOUDINARY_${key.toUpperCase()}`;
//       return !process.env[envKey] || process.env[envKey].trim() === '';
//     });
    
//     if (missing.length > 0) {
//       console.warn('⚠️  Cloudinary configuration missing or empty:', missing.join(', '));
//       console.warn('⚠️  Falling back to local file storage');
//       return false;
//     }
    
//     // Test if credentials are valid format
//     const { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
//     if (CLOUDINARY_API_KEY.length < 10 || CLOUDINARY_CLOUD_NAME.length < 3) {
//       console.warn('⚠️  Cloudinary credentials appear invalid');
//       return false;
//     }
    
//     return true;
//   } catch (error) {
//     console.error('❌ Error validating Cloudinary config:', error.message);
//     return false;
//   }
// };

// // Enhanced Cloudinary configuration with connection test
// const configureCloudinary = async () => {
//   try {
//     if (!validateCloudinaryConfig()) {
//       return { success: false, message: 'Invalid configuration' };
//     }

//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
//       api_key: process.env.CLOUDINARY_API_KEY.trim(),
//       api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
//       secure: true // Always use HTTPS
//     });

//     // Test connection with a simple operation
//     await cloudinary.api.ping();
//     console.log('✅ Cloudinary configured and connected successfully');
//     return { success: true, message: 'Cloudinary connected' };
    
//   } catch (error) {
//     console.error('❌ Cloudinary configuration failed:', error.message);
//     return { success: false, message: error.message };
//   }
// };

// // Initialize Cloudinary configuration
// let cloudinaryEnabled = false;
// (async () => {
//   const configResult = await configureCloudinary();
//   cloudinaryEnabled = configResult.success;
// })();

// // Enhanced storage configuration with better error handling
// const createStorage = () => {
//   if (cloudinaryEnabled) {
//     try {
//       return new CloudinaryStorage({
//         cloudinary: cloudinary,
//         params: {
//           folder: 'code-repository',
//           allowed_formats: ['js', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php', 'rb', 'go', 'rs', 'ts', 'txt', 'md', 'json', 'xml', 'yml', 'yaml'],
//           resource_type: 'raw',
//           public_id: (req, file) => {
//             try {
//               const timestamp = Date.now();
//               const randomString = Math.random().toString(36).substring(2, 8);
//               const originalName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
//               return `codefile-${originalName}-${timestamp}-${randomString}`;
//             } catch (error) {
//               console.error('Error generating public_id:', error);
//               return `codefile-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
//             }
//           },
//         },
//       });
//     } catch (error) {
//       console.error('❌ Cloudinary storage creation failed:', error.message);
//       return createLocalStorage();
//     }
//   } else {
//     return createLocalStorage();
//   }
// };

// // Enhanced local storage creation
// const createLocalStorage = () => {
//   const uploadsDir = './uploads/code-files';
  
//   try {
//     // Ensure upload directory exists
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//       console.log('📁 Created local uploads directory:', uploadsDir);
//     }
    
//     return multer.diskStorage({
//       destination: function (req, file, cb) {
//         cb(null, uploadsDir);
//       },
//       filename: function (req, file, cb) {
//         try {
//           const timestamp = Date.now();
//           const randomString = Math.random().toString(36).substring(2, 8);
//           const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
//           const ext = path.extname(file.originalname).toLowerCase();
          
//           const filename = `codefile-${originalName}-${timestamp}-${randomString}${ext}`;
//           cb(null, filename);
//         } catch (error) {
//           console.error('Error generating filename:', error);
//           cb(error, null);
//         }
//       }
//     });
//   } catch (error) {
//     console.error('❌ Local storage creation failed:', error.message);
//     throw new Error('Could not initialize file storage');
//   }
// };

// // Enhanced file filter with detailed error messages
// const fileFilter = (req, file, cb) => {
//   try {
//     const allowedExtensions = ['.js', '.py', '.java', '.cpp', '.c', '.html', '.css', '.php', '.rb', '.go', '.rs', '.ts', '.txt', '.md', '.json', '.xml', '.yml', '.yaml'];
//     const ext = path.extname(file.originalname).toLowerCase();
    
//     if (!file.originalname) {
//       return cb(new Error('No filename provided'), false);
//     }
    
//     if (!allowedExtensions.includes(ext)) {
//       const error = new Error(`File type "${ext}" not allowed. Allowed types: ${allowedExtensions.join(', ')}`);
//       error.code = 'FILE_TYPE_NOT_ALLOWED';
//       return cb(error, false);
//     }
    
//     cb(null, true);
//   } catch (error) {
//     console.error('File filter error:', error);
//     cb(new Error('File validation failed'), false);
//   }
// };

// // Enhanced error handler for multer
// const handleMulterError = (error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: 'File too large. Maximum size is 10MB.',
//         code: 'FILE_TOO_LARGE'
//       });
//     }
//     if (error.code === 'LIMIT_UNEXPECTED_FILE') {
//       return res.status(400).json({
//         success: false,
//         message: 'Unexpected file field. Use "codeFile" as the field name.',
//         code: 'INVALID_FIELD_NAME'
//       });
//     }
//   }
  
//   if (error.code === 'FILE_TYPE_NOT_ALLOWED') {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//       code: 'INVALID_FILE_TYPE'
//     });
//   }
  
//   console.error('Upload error:', error);
//   res.status(500).json({
//     success: false,
//     message: 'File upload failed',
//     code: 'UPLOAD_ERROR'
//   });
// };

// // Storage instance with error handling
// let storageInstance;
// try {
//   storageInstance = createStorage();
// } catch (error) {
//   console.error('❌ Critical: Could not initialize any storage system:', error.message);
//   // Fallback to memory storage as last resort
//   storageInstance = multer.memoryStorage();
//   console.warn('⚠️  Using memory storage as fallback - files will not persist after server restart');
// }

// const upload = multer({ 
//   storage: storageInstance,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//     files: 1, // Only one file per request
//   },
//   fileFilter: fileFilter,
//   preservePath: false // Don't include full path in filename
// });

// // Utility function to clean up uploaded files on error
// const cleanupUploadedFile = async (file) => {
//   if (!file) return;
  
//   try {
//     if (cloudinaryEnabled && file.filename) {
//       // Cloudinary cleanup
//       await cloudinary.uploader.destroy(file.filename);
//     } else if (file.path && fs.existsSync(file.path)) {
//       // Local file cleanup
//       fs.unlinkSync(file.path);
//     }
//   } catch (cleanupError) {
//     console.error('File cleanup failed:', cleanupError.message);
//   }
// };

// // Health check function
// const checkStorageHealth = async () => {
//   return {
//     cloudinary: cloudinaryEnabled,
//     localStorage: fs.existsSync('./uploads/code-files'),
//     timestamp: new Date().toISOString()
//   };
// };

// // Middleware to validate upload before processing
// const validateUpload = (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: 'No file provided for upload',
//       code: 'NO_FILE'
//     });
//   }
  
//   // Additional validation can be added here
//   next();
// };

// module.exports = {
//   cloudinary,
//   upload,
//   validateCloudinaryConfig,
//   cleanupUploadedFile,
//   handleMulterError,
//   checkStorageHealth,
//   validateUpload,
//   isCloudinaryEnabled: () => cloudinaryEnabled
// };


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary synchronously first
let cloudinaryEnabled = false;
let cloudinaryConfig = {};

try {
  // Check if all required environment variables are present
  const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName] || process.env[varName].trim() === '');
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing Cloudinary environment variables:', missingVars.join(', '));
    console.warn('⚠️  Falling back to local storage');
  } else {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
      api_key: process.env.CLOUDINARY_API_KEY.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
      secure: true
    });
    
    console.log('✅ Cloudinary configured successfully');
    cloudinaryEnabled = true;
  }
} catch (error) {
  console.error('❌ Cloudinary configuration failed:', error.message);
}

// Test Cloudinary connection asynchronously (but don't block startup)
if (cloudinaryEnabled) {
  cloudinary.api.ping()
    .then(result => {
      console.log('✅ Cloudinary connection test successful');
    })
    .catch(error => {
      console.error('❌ Cloudinary connection test failed:', error.message);
      console.warn('⚠️  Falling back to local storage');
      cloudinaryEnabled = false;
    });
}

// Create storage based on configuration
const createStorage = () => {
  if (cloudinaryEnabled) {
    try {
      console.log('🔄 Using Cloudinary storage for uploads');
      return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          folder: 'code-repository',
          allowed_formats: ['js', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php', 'rb', 'go', 'rs', 'ts', 'txt', 'md', 'json', 'xml', 'yml', 'yaml'],
          resource_type: 'raw',
          public_id: (req, file) => {
            try {
              const timestamp = Date.now();
              const randomString = Math.random().toString(36).substring(2, 8);
              const originalName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
              return `codefile-${originalName}-${timestamp}-${randomString}`;
            } catch (error) {
              console.error('Error generating public_id:', error);
              return `codefile-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
            }
          },
        },
      });
    } catch (error) {
      console.error('❌ Cloudinary storage creation failed:', error.message);
      return createLocalStorage();
    }
  } else {
    console.log('🔄 Using local storage for uploads');
    return createLocalStorage();
  }
};

// Enhanced local storage creation
const createLocalStorage = () => {
  const uploadsDir = './uploads/code-files';
  
  try {
    // Ensure upload directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Created local uploads directory:', uploadsDir);
    }
    
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        try {
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8);
          const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
          const ext = path.extname(file.originalname).toLowerCase();
          
          const filename = `codefile-${originalName}-${timestamp}-${randomString}${ext}`;
          cb(null, filename);
        } catch (error) {
          console.error('Error generating filename:', error);
          cb(error, null);
        }
      }
    });
  } catch (error) {
    console.error('❌ Local storage creation failed:', error.message);
    throw new Error('Could not initialize file storage');
  }
};

// Enhanced file filter with detailed error messages
const fileFilter = (req, file, cb) => {
  try {
    const allowedExtensions = ['.js', '.py', '.java', '.cpp', '.c', '.html', '.css', '.php', '.rb', '.go', '.rs', '.ts', '.txt', '.md', '.json', '.xml', '.yml', '.yaml'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!file.originalname) {
      return cb(new Error('No filename provided'), false);
    }
    
    if (!allowedExtensions.includes(ext)) {
      const error = new Error(`File type "${ext}" not allowed. Allowed types: ${allowedExtensions.join(', ')}`);
      error.code = 'FILE_TYPE_NOT_ALLOWED';
      return cb(error, false);
    }
    
    cb(null, true);
  } catch (error) {
    console.error('File filter error:', error);
    cb(new Error('File validation failed'), false);
  }
};

// Enhanced error handler for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Use "codeFile" as the field name.',
        code: 'INVALID_FIELD_NAME'
      });
    }
  }
  
  if (error.code === 'FILE_TYPE_NOT_ALLOWED') {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({
    success: false,
    message: 'File upload failed',
    code: 'UPLOAD_ERROR'
  });
};

// Create storage instance
let storageInstance;
try {
  storageInstance = createStorage();
} catch (error) {
  console.error('❌ Critical: Could not initialize any storage system:', error.message);
  // Fallback to memory storage as last resort
  storageInstance = multer.memoryStorage();
  console.warn('⚠️  Using memory storage as fallback - files will not persist after server restart');
}

const upload = multer({ 
  storage: storageInstance,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit (increased)
    files: 1, // Only one file per request
  },
  fileFilter: fileFilter,
  preservePath: false // Don't include full path in filename
});

// Utility function to clean up uploaded files on error
const cleanupUploadedFile = async (file) => {
  if (!file) return;
  
  try {
    if (cloudinaryEnabled && file.filename) {
      // Cloudinary cleanup
      await cloudinary.uploader.destroy(file.filename);
      console.log('🗑️  Cleaned up Cloudinary file:', file.filename);
    } else if (file.path && fs.existsSync(file.path)) {
      // Local file cleanup
      fs.unlinkSync(file.path);
      console.log('🗑️  Cleaned up local file:', file.path);
    }
  } catch (cleanupError) {
    console.error('File cleanup failed:', cleanupError.message);
  }
};

// Health check function
const checkStorageHealth = async () => {
  try {
    let cloudinaryStatus = 'disabled';
    if (cloudinaryEnabled) {
      try {
        await cloudinary.api.ping();
        cloudinaryStatus = 'connected';
      } catch (error) {
        cloudinaryStatus = 'connection_failed';
      }
    }
    
    return {
      cloudinary: cloudinaryStatus,
      localStorage: fs.existsSync('./uploads/code-files'),
      timestamp: new Date().toISOString(),
      storageType: cloudinaryEnabled ? 'cloudinary' : 'local'
    };
  } catch (error) {
    return {
      cloudinary: 'error',
      localStorage: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
};

// Middleware to validate upload before processing
const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file provided for upload',
      code: 'NO_FILE'
    });
  }
  
  console.log('📁 File upload detected:', {
    originalname: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    storage: cloudinaryEnabled ? 'cloudinary' : 'local'
  });
  
  next();
};

// Debug function to check current configuration
const debugConfig = () => {
  console.log('\n=== CLOUDINARY CONFIGURATION ===');
  console.log('Enabled:', cloudinaryEnabled);
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '***' : 'MISSING');
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING');
  console.log('================================\n');
};

// Log configuration on startup
debugConfig();

module.exports = {
  cloudinary,
  upload,
  cleanupUploadedFile,
  handleMulterError,
  checkStorageHealth,
  validateUpload,
  isCloudinaryEnabled: () => cloudinaryEnabled,
  debugConfig
};