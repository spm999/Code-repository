// controllers/codeController.js
const CodeFile = require("../models/CodeFile");
const CodeVersion = require("../models/CodeVersion");
const User = require("../models/User");
const { cloudinary } = require("../utils/cloudinary");
const { sendEmail, emailTemplates } = require("../utils/emailService");

// Helper function to assign reviewer automatically
const assignReviewer = async (codeFile) => {
  try {
    // Find available reviewers (users with reviewer role)
    const reviewers = await User.find({ 
      role: 'reviewer',
      isActive: true 
    });
    
    if (reviewers.length === 0) {
      console.log('No reviewers available');
      return null;
    }
    
    // Simple round-robin assignment (you can enhance this)
    const randomReviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
    
    codeFile.assignedReviewer = randomReviewer._id;
    codeFile.approvalStatus = 'pending_reviewer';
    await codeFile.save();
    
    // Send email notification to reviewer
    const author = await User.findById(codeFile.createdBy);
    if (randomReviewer.email) {
      const emailContent = emailTemplates.reviewerAssignment(
        codeFile, 
        randomReviewer, 
        author
      );
      await sendEmail(randomReviewer.email, emailContent.subject, emailContent.html);
    }
    
    return randomReviewer;
  } catch (error) {
    console.error('Error assigning reviewer:', error);
    return null;
  }
};

// Helper function to assign admin for final approval
const assignAdmin = async (codeFile, reviewedBy) => {
  try {
    // Find available admins
    const admins = await User.find({ 
      role: 'admin',
      isActive: true 
    });
    
    if (admins.length === 0) {
      console.log('No admins available');
      return null;
    }
    
    // Assign to first available admin (can enhance this)
    const admin = admins[0];
    
    codeFile.assignedAdmin = admin._id;
    codeFile.approvalStatus = 'pending_admin';
    await codeFile.save();
    
    // Send email notification to admin
    if (admin.email) {
      const emailContent = emailTemplates.adminApprovalRequest(
        codeFile, 
        admin, 
        reviewedBy
      );
      await sendEmail(admin.email, emailContent.subject, emailContent.html);
    }
    
    return admin;
  } catch (error) {
    console.error('Error assigning admin:', error);
    return null;
  }
};

// @desc Create a new code file and auto-assign reviewer
exports.createCodeFile = async (req, res) => {
  try {
    const { title, description, language, tags, isPublic } = req.body;

    const codeFile = await CodeFile.create({
      title,
      description,
      language,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      createdBy: req.user.id,
      isPublic: isPublic === 'true',
      approvalStatus: 'draft'
    });

    // Auto-assign reviewer
    const reviewer = await assignReviewer(codeFile);

    res.status(201).json({
      success: true,
      data: codeFile,
      assignedReviewer: reviewer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Upload code file version and update workflow
// exports.uploadCodeVersion = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded"
//       });
//     }

//     const codeFile = await CodeFile.findById(req.params.id);
//     if (!codeFile) {
//       return res.status(404).json({
//         success: false,
//         message: "Code file not found"
//       });
//     }

//     // Check permissions
//     if (codeFile.createdBy.toString() !== req.user.id.toString()) {
//       const isCollaborator = codeFile.collaborators.some(
//         collab => collab.user.toString() === req.user.id.toString() && 
//                  collab.permission === "suggest_edits"
//       );
      
//       if (!isCollaborator) {
//         return res.status(403).json({
//           success: false,
//           message: "Not authorized to upload to this file"
//         });
//       }
//     }

//     // Determine version number
//     const existingVersions = await CodeVersion.find({ codeFile: req.params.id });
//     const versionNumber = existingVersions.length + 1;

//     const codeVersion = await CodeVersion.create({
//       codeFile: req.params.id,
//       version: `v${versionNumber}.0`,
//       fileUrl: req.file.path,
//       cloudinaryPublicId: req.file.filename,
//       author: req.user.id,
//       status: 'draft',
//       isActive: false
//     });

//     // If user owns the file, set as current version and reset approval workflow
//     if (codeFile.createdBy.toString() === req.user.id.toString()) {
//       codeFile.currentVersion = codeVersion._id;
//       codeFile.approvalStatus = 'draft';
      
//       // Reassign reviewer if needed
//       if (!codeFile.assignedReviewer) {
//         await assignReviewer(codeFile);
//       } else {
//         codeFile.approvalStatus = 'pending_reviewer';
//       }
      
//       await codeFile.save();
//     }

//     res.status(201).json({
//       success: true,
//       data: codeVersion
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// };

// In controllers/codeController.js - uploadCodeVersion function
exports.uploadCodeVersion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or invalid file type"
      });
    }

    const codeFile = await CodeFile.findById(req.params.id);
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check permissions
    if (codeFile.createdBy.toString() !== req.user.id.toString()) {
      const isCollaborator = codeFile.collaborators.some(
        collab => collab.user.toString() === req.user.id.toString() && 
                 collab.permission === "suggest_edits"
      );
      
      if (!isCollaborator) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to upload to this file"
        });
      }
    }

    // Determine file URL based on storage type
    let fileUrl;
    let cloudinaryPublicId;

    if (req.file.path) {
      // Cloudinary upload
      fileUrl = req.file.path;
      cloudinaryPublicId = req.file.filename;
    } else {
      // Local storage
      fileUrl = `/uploads/code-files/${req.file.filename}`;
      cloudinaryPublicId = `local-${req.file.filename}`;
    }

    // Determine version number
    const existingVersions = await CodeVersion.find({ codeFile: req.params.id });
    const versionNumber = existingVersions.length + 1;

    const codeVersion = await CodeVersion.create({
      codeFile: req.params.id,
      version: `v${versionNumber}.0`,
      fileUrl: fileUrl,
      cloudinaryPublicId: cloudinaryPublicId,
      author: req.user.id,
      status: 'draft',
      isActive: false
    });

    // If user owns the file, set as current version and reset approval workflow
    if (codeFile.createdBy.toString() === req.user.id.toString()) {
      codeFile.currentVersion = codeVersion._id;
      codeFile.approvalStatus = 'draft';
      
      // Reassign reviewer if needed
      if (!codeFile.assignedReviewer) {
        await assignReviewer(codeFile);
      } else {
        codeFile.approvalStatus = 'pending_reviewer';
      }
      
      await codeFile.save();
    }

    res.status(201).json({
      success: true,
      data: codeVersion,
      message: "File uploaded successfully"
    });

  } catch (err) {
    console.error('Upload error:', err);
    
    res.status(500).json({ 
      success: false,
      message: "File upload failed: " + err.message 
    });
  }
};

// @desc Get all code files with filtering
// @route GET /api/code/files
exports.getCodeFiles = async (req, res) => {
  try {
    const { language, tag, status, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // Filter by language
    if (language) {
      query.language = language;
    }
    
    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Filter by status
    if (status) {
      query.approvalStatus = status;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Non-admin users can only see public files or their own files
    if (req.user.role !== 'admin') {
      query.$or = [
        { isPublic: true },
        { createdBy: req.user.id },
        { 'collaborators.user': req.user.id }
      ];
    }

    const files = await CodeFile.find(query)
      .populate('createdBy', 'username email')
      .populate('currentVersion')
      .populate('assignedReviewer', 'username email')
      .populate('assignedAdmin', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await CodeFile.countDocuments(query);

    res.json({
      success: true,
      data: files,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalFiles: total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Get single code file with versions
// @route GET /api/code/files/:id
exports.getCodeFile = async (req, res) => {
  try {
    const codeFile = await CodeFile.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('currentVersion')
      .populate('assignedReviewer', 'username email')
      .populate('assignedAdmin', 'username email')
      .populate('collaborators.user', 'username email');

    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check access permissions
    if (!codeFile.isPublic && 
        codeFile.createdBy._id.toString() !== req.user.id.toString() &&
        !codeFile.collaborators.some(collab => 
          collab.user._id.toString() === req.user.id.toString()) &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this file"
      });
    }

    const versions = await CodeVersion.find({ codeFile: req.params.id })
      .populate('author', 'username email')
      .populate('reviews.reviewer', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        file: codeFile,
        versions: versions
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Update code file metadata
// @route PUT /api/code/files/:id
exports.updateCodeFile = async (req, res) => {
  try {
    const { title, description, tags, isPublic, notifications } = req.body;

    const codeFile = await CodeFile.findById(req.params.id);
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check if user owns the file or is admin/collaborator
    if (codeFile.createdBy.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin' &&
        !codeFile.collaborators.some(collab => 
          collab.user.toString() === req.user.id.toString())) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this file"
      });
    }

    const updatedFile = await CodeFile.findByIdAndUpdate(
      req.params.id,
      {
        title: title || codeFile.title,
        description: description || codeFile.description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : codeFile.tags,
        isPublic: isPublic !== undefined ? isPublic === 'true' : codeFile.isPublic,
        notifications: notifications ? {
          ...codeFile.notifications,
          ...notifications
        } : codeFile.notifications,
        lastUpdatedBy: req.user.id,
        lastUpdatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');

    res.json({
      success: true,
      data: updatedFile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Add collaborator to code file
// @route POST /api/code/files/:id/collaborators
exports.addCollaborator = async (req, res) => {
  try {
    const { userId, permission = "view" } = req.body;

    const codeFile = await CodeFile.findById(req.params.id);
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check if user owns the file or is admin
    if (codeFile.createdBy.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add collaborators"
      });
    }

    // Check if collaborator exists
    const existingCollaborator = codeFile.collaborators.find(
      collab => collab.user.toString() === userId
    );

    if (existingCollaborator) {
      return res.status(400).json({
        success: false,
        message: "User is already a collaborator"
      });
    }

    // Check if user exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    codeFile.collaborators.push({
      user: userId,
      permission: permission
    });

    await codeFile.save();

    // Send notification email to collaborator
    if (userToAdd.email) {
      const emailContent = emailTemplates.fileShared(
        codeFile,
        userToAdd,
        req.user,
        permission
      );
      await sendEmail(userToAdd.email, emailContent.subject, emailContent.html);
    }

    const updatedFile = await CodeFile.findById(req.params.id)
      .populate('collaborators.user', 'username email');

    res.json({
      success: true,
      message: `Collaborator ${userToAdd.username} added successfully`,
      data: updatedFile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Submit version for review
// @route POST /api/code/versions/:id/submit-review
exports.submitForReview = async (req, res) => {
  try {
    const { changeLog } = req.body;

    const codeVersion = await CodeVersion.findById(req.params.id)
      .populate('codeFile');
    
    if (!codeVersion) {
      return res.status(404).json({
        success: false,
        message: "Code version not found"
      });
    }

    // Check if user owns the version or is admin/collaborator
    const codeFile = await CodeFile.findById(codeVersion.codeFile._id);
    if (codeVersion.author.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin' &&
        !codeFile.collaborators.some(collab => 
          collab.user.toString() === req.user.id.toString())) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to submit this version for review"
      });
    }

    codeVersion.status = 'pending_reviewer';
    codeVersion.changeLog = changeLog || codeVersion.changeLog;
    await codeVersion.save();

    // Update file status
    await CodeFile.findByIdAndUpdate(
      codeVersion.codeFile._id,
      {
        approvalStatus: 'pending_reviewer',
        lastUpdatedBy: req.user.id,
        lastUpdatedAt: Date.now()
      }
    );

    // Notify assigned reviewer
    if (codeFile.assignedReviewer) {
      const reviewer = await User.findById(codeFile.assignedReviewer);
      const author = await User.findById(codeVersion.author);
      
      if (reviewer.email) {
        const emailContent = emailTemplates.reviewRequest(
          codeFile,
          reviewer,
          author
        );
        await sendEmail(reviewer.email, emailContent.subject, emailContent.html);
      }
    }

    res.json({
      success: true,
      message: "Code version submitted for review",
      data: codeVersion
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Review code version (Admin)
// @route POST /api/code/versions/:id/review
exports.reviewCodeVersion = async (req, res) => {
  try {
    const { status, comment, reviewType = "general" } = req.body;

    const codeVersion = await CodeVersion.findById(req.params.id)
      .populate('codeFile');
    
    if (!codeVersion) {
      return res.status(404).json({
        success: false,
        message: "Code version not found"
      });
    }

    // Add review
    codeVersion.reviews.push({
      reviewer: req.user.id,
      comment,
      status,
      reviewType,
    });

    // Update version status based on review
    codeVersion.status = status === 'approved' ? 'approved' : 
                        status === 'rejected' ? 'rejected' : 
                        'pending_review';

    await codeVersion.save();

    // Update file status
    const updateData = {
      lastUpdatedBy: req.user.id,
      lastUpdatedAt: Date.now()
    };

    if (status === 'approved') {
      updateData.approvalStatus = 'approved';
      // Archive previous active version
      await CodeVersion.updateMany(
        { 
          codeFile: codeVersion.codeFile._id, 
          isActive: true,
          _id: { $ne: codeVersion._id }
        },
        { isActive: false }
      );

      codeVersion.isActive = true;
      await codeVersion.save();

      updateData.currentVersion = codeVersion._id;
    } else if (status === 'rejected') {
      updateData.approvalStatus = 'rejected';
    }

    await CodeFile.findByIdAndUpdate(
      codeVersion.codeFile._id,
      updateData
    );

    // Notify file owner about review result
    const codeFile = await CodeFile.findById(codeVersion.codeFile._id)
      .populate('createdBy');
    
    if (codeFile.createdBy.email && codeFile.notifications.onReview) {
      const emailContent = emailTemplates.fileApproved(
        codeFile,
        codeFile.createdBy,
        req.user
      );
      await sendEmail(codeFile.createdBy.email, emailContent.subject, emailContent.html);
    }

    res.json({
      success: true,
      message: `Code version ${status} successfully`,
      data: codeVersion
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Delete code file and all versions
// @route DELETE /api/code/files/:id
exports.deleteCodeFile = async (req, res) => {
  try {
    const codeFile = await CodeFile.findById(req.params.id);
    
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check if user owns the file or is admin
    if (codeFile.createdBy.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this file"
      });
    }

    // Delete all versions from Cloudinary
    const versions = await CodeVersion.find({ codeFile: req.params.id });
    for (const version of versions) {
      try {
        await cloudinary.uploader.destroy(version.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
      }
    }

    // Delete versions from database
    await CodeVersion.deleteMany({ codeFile: req.params.id });

    // Delete file
    await CodeFile.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Code file and all versions deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Share code file via email
// @route POST /api/code/files/:id/share
exports.shareCodeFile = async (req, res) => {
  try {
    const { email, permission = "view", message } = req.body;

    const codeFile = await CodeFile.findById(req.params.id)
      .populate('createdBy', 'username email');
    
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check if file is approved
    if (codeFile.approvalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: "Only approved files can be shared"
      });
    }

    // Check if user owns the file or has sharing permissions
    if (codeFile.createdBy._id.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to share this file"
      });
    }

    // Find user by email
    const recipient = await User.findOne({ email });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    // Check if already shared
    const alreadyShared = codeFile.sharing.sharedWith.some(
      share => share.user.toString() === recipient._id.toString()
    );

    if (alreadyShared) {
      return res.status(400).json({
        success: false,
        message: "File already shared with this user"
      });
    }

    // Add to sharedWith array
    codeFile.sharing.sharedWith.push({
      user: recipient._id,
      permission,
      sharedBy: req.user.id,
    });

    codeFile.sharing.isShared = true;
    await codeFile.save();

    // Send email notification
    const emailContent = emailTemplates.fileShared(
      codeFile,
      recipient,
      req.user,
      permission
    );
    
    await sendEmail(recipient.email, emailContent.subject, emailContent.html);

    res.json({
      success: true,
      message: `File shared successfully with ${recipient.email}`,
      data: codeFile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Generate public share link
// @route POST /api/code/files/:id/share/link
exports.generateShareLink = async (req, res) => {
  try {
    const { expiresIn = 7 } = req.body; // days

    const codeFile = await CodeFile.findById(req.params.id);
    
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check if file is approved
    if (codeFile.approvalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: "Only approved files can be shared"
      });
    }

    // Check permissions
    if (codeFile.createdBy.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to share this file"
      });
    }

    // Generate unique token
    const token = require('crypto').randomBytes(20).toString('hex');
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(expiresIn));

    codeFile.sharing.publicLink = `${process.env.FRONTEND_URL}/shared/${token}`;
    codeFile.sharing.publicLinkExpires = expirationDate;
    codeFile.sharing.isShared = true;
    
    await codeFile.save();

    res.json({
      success: true,
      data: {
        shareLink: codeFile.sharing.publicLink,
        expires: codeFile.sharing.publicLinkExpires
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Reviewer approves code (moves to admin for final approval)
// @route POST /api/code/files/:id/reviewer-approve
exports.reviewerApprove = async (req, res) => {
  try {
    const { comment, reviewType = "general" } = req.body;

    const codeFile = await CodeFile.findById(req.params.id)
      .populate('currentVersion')
      .populate('assignedReviewer');
    
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check if user is the assigned reviewer
    if (codeFile.assignedReviewer.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this file"
      });
    }

    // Add review to current version
    const currentVersion = await CodeVersion.findById(codeFile.currentVersion);
    currentVersion.reviews.push({
      reviewer: req.user.id,
      comment,
      status: "approved",
      reviewType,
    });

    await currentVersion.save();

    // Move to admin for final approval
    const admin = await assignAdmin(codeFile, req.user);

    res.json({
      success: true,
      message: "Code approved by reviewer, sent to admin for final approval",
      data: {
        codeFile,
        assignedAdmin: admin
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Admin gives final approval
// @route POST /api/code/files/:id/admin-approve
exports.adminApprove = async (req, res) => {
  try {
    const { comment } = req.body;

    const codeFile = await CodeFile.findById(req.params.id)
      .populate('currentVersion')
      .populate('createdBy');
    
    if (!codeFile) {
      return res.status(404).json({
        success: false,
        message: "Code file not found"
      });
    }

    // Check if user is admin or assigned admin
    if (req.user.role !== 'admin' && 
        (!codeFile.assignedAdmin || codeFile.assignedAdmin.toString() !== req.user.id.toString())) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to approve this file"
      });
    }

    // Add final approval review
    const currentVersion = await CodeVersion.findById(codeFile.currentVersion);
    currentVersion.reviews.push({
      reviewer: req.user.id,
      comment,
      status: "approved",
      reviewType: "final",
    });

    currentVersion.status = "approved";
    currentVersion.isActive = true;
    await currentVersion.save();

    // Update file status
    codeFile.approvalStatus = "approved";
    codeFile.lastUpdatedBy = req.user.id;
    codeFile.lastUpdatedAt = Date.now();
    await codeFile.save();

    // Send approval notification to file owner
    if (codeFile.createdBy.email && codeFile.notifications.onApproval) {
      const emailContent = emailTemplates.fileApproved(
        codeFile,
        codeFile.createdBy,
        req.user
      );
      await sendEmail(codeFile.createdBy.email, emailContent.subject, emailContent.html);
    }

    res.json({
      success: true,
      message: "Code file approved successfully",
      data: codeFile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
// @desc Request specific reviewer
// @route POST /api/code/files/:id/request-review
exports.requestReview = async (req, res) => {
  try {
    const { reviewerId, message } = req.body;

    const codeFile = await CodeFile.findById(req.params.id)
      .populate('createdBy');
    const reviewer = await User.findById(reviewerId);
    
    if (!codeFile || !reviewer) {
      return res.status(404).json({
        success: false,
        message: "Code file or reviewer not found"
      });
    }

    // Check if reviewer has reviewer role
    if (reviewer.role !== 'reviewer') {
      return res.status(400).json({
        success: false,
        message: "User is not a reviewer"
      });
    }

    // Check permissions
    if (codeFile.createdBy.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to request reviews"
      });
    }

    // Assign the requested reviewer
    codeFile.assignedReviewer = reviewerId;
    codeFile.approvalStatus = 'pending_reviewer';
    await codeFile.save();

    // Send email request to reviewer
    if (reviewer.email) {
      const emailContent = emailTemplates.reviewRequest(
        codeFile,
        reviewer,
        req.user
      );
      await sendEmail(reviewer.email, emailContent.subject, emailContent.html);
    }

    res.json({
      success: true,
      message: `Review requested from ${reviewer.username}`,
      data: codeFile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};