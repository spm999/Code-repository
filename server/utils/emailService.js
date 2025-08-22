// utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  reviewerAssignment: (file, reviewer, assigner) => ({
    subject: `New Code File Assigned for Review: ${file.title}`,
    html: `
      <h2>Code Review Assignment</h2>
      <p>Hello ${reviewer.username},</p>
      <p>You have been assigned to review a new code file:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <p><strong>Description:</strong> ${file.description}</p>
      <p><strong>Assigned by:</strong> ${assigner.username}</p>
      <br/>
      <p>Please review the code at your earliest convenience.</p>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">Review Code File</a>
    `,
  }),

  adminApprovalRequest: (file, admin, requester) => ({
    subject: `Code File Ready for Final Approval: ${file.title}`,
    html: `
      <h2>Admin Approval Required</h2>
      <p>Hello ${admin.username},</p>
      <p>A code file has been reviewed and is ready for your final approval:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <p><strong>Reviewed by:</strong> ${requester.username}</p>
      <br/>
      <p>Please review and provide final approval.</p>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">Approve Code File</a>
    `,
  }),

  fileApproved: (file, user, approver) => ({
    subject: `Your Code File Has Been Approved: ${file.title}`,
    html: `
      <h2>Code File Approved</h2>
      <p>Hello ${user.username},</p>
      <p>Your code file has been approved by ${approver.username}:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Status:</strong> Approved</p>
      <br/>
      <p>You can now share this file with others.</p>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">View Code File</a>
    `,
  }),

  fileShared: (file, recipient, sharer, permission) => ({
    subject: `${sharer.username} Shared a Code File With You`,
    html: `
      <h2>Code File Shared</h2>
      <p>Hello ${recipient.username},</p>
      <p>${sharer.username} has shared a code file with you (${permission} access):</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <p><strong>Description:</strong> ${file.description}</p>
      <br/>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">Access Code File</a>
    `,
  }),

  reviewRequest: (file, reviewer, author) => ({
    subject: `Review Request for Code File: ${file.title}`,
    html: `
      <h2>Review Request</h2>
      <p>Hello ${reviewer.username},</p>
      <p>${author.username} has requested your review for a code file:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <br/>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}/review">Review Code File</a>
    `,
  }),
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = { transporter, emailTemplates, sendEmail };