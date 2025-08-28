import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ===== EMAIL CONFIGURATION =====
// Create a transporter object for sending emails via Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// ===== CORE EMAIL FUNCTION =====
// Generic function to send any email (used by all other email functions)
export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text, // Plain text version (for email clients that don't support HTML)
      html: html, // HTML version (for modern email clients)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// ===== CONNECTION NOTIFICATION EMAIL =====
// Sent to the IDEA CREATOR when someone connects to their idea
export const sendConnectionNotification = async (
  ideaCreator,
  connectingUser,
  idea,
  message,
  socialLink
) => {
  const subject = `New Connection to Your Idea: ${idea.title}`;

  // ===== PLAIN TEXT VERSION =====
  // Appears in email preview and text-only email clients
  const text = `
Hi ${ideaCreator.firstName},

${connectingUser.firstName} ${
    connectingUser.lastName
  } has connected to your idea "${idea.title}".

Message from ${connectingUser.firstName}:
"${message}"

${socialLink ? `Connect with ${connectingUser.firstName}: ${socialLink}` : ''}

You can view this connection in your profile.

Best regards,
Your Pensive Team
  `;

  // ===== HTML VERSION =====
  // Appears in modern email clients with full styling
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- EMAIL HEADER WITH LOGO -->
      <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
        <div style="display: inline-block; width: 40px; height: 40px; background-color: #231f20; border-radius: 50%; position: relative; margin-bottom: 10px;">
          <svg style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px;" viewBox="0 0 117.4 117.4">
            <g>
              <polyline points="52.2 49 34.3 76.2 55.7 76.2" fill="none" stroke="#ffffff" stroke-width="5.7" stroke-miterlimit="10"/>
              <circle cx="27.7" cy="50.8" r="5" fill="#ffffff"/>
              <circle cx="84.3" cy="50.8" r="5" fill="#ffffff"/>
              <circle cx="58.7" cy="58.7" r="55.9" fill="none" stroke="#ffffff" stroke-width="5.7" stroke-miterlimit="10"/>
            </g>
          </svg>
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #333;">Pensive</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">New Connection to Your Idea</p>
      </div>
      
      <!-- MAIN CONNECTION BOX -->
      <!-- Clean white box with black borders and rounded corners -->
      <div style="background-color: white; padding: 24px; border-radius: 12px; margin: 20px 0; border: 2px solid #000000;">
        <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #333;"><strong>${
          connectingUser.firstName
        } ${
    connectingUser.lastName
  }</strong> has connected to your idea <strong>"${idea.title}"</strong>!</p>
        
        <!-- MESSAGE BOX -->
        <!-- Inner white box with the user's message -->
        <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; border: 1px solid #e9ecef; margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #333; font-size: 14px;">Message from ${
            connectingUser.firstName
          }:</p>
          <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6; font-style: italic;">"${message}"</p>
        </div>

        <!-- SOCIAL LINK SECTION (ONLY SHOWS IF SOCIAL LINK PROVIDED) -->
        ${
          socialLink
            ? `
        <div style="margin-top: 16px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #333; font-size: 14px;">Connect with ${connectingUser.firstName}:</p>
          <a href="${socialLink}" style="color: #007bff; text-decoration: none; font-weight: 500; font-size: 14px; padding: 8px 12px; background-color: #f0f0f0; border-radius: 6px; display: inline-block;">${socialLink}</a>
        </div>
        `
            : ''
        }
      </div>
      
      <!-- PROFILE LINK -->
      <p style="color: #6b6b6b; font-size: 12px; margin: 20px 0;">You can view and manage all your connections in your profile.</p>
      
      <!-- EMAIL FOOTER -->
      <!-- Styled to match your app's footer -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 14px; text-align: center;">
        <p style="margin: 0;">Best regards,<br><strong>Your Pensive Team</strong></p>
      </div>
    </div>
  `;

  return await sendEmail(ideaCreator.email, subject, text, html);
};

// ===== CONNECTION CONFIRMATION EMAIL =====
// Sent to the CONNECTING USER to confirm their connection was sent
export const sendConnectionConfirmation = async (
  connectingUser,
  ideaCreator,
  idea
) => {
  const subject = `Connection Sent: ${idea.title}`;

  // ===== PLAIN TEXT VERSION =====
  const text = `
Hi ${connectingUser.firstName},

Your connection request to ${ideaCreator.firstName}'s idea "${idea.title}" has been sent successfully.

${ideaCreator.firstName} will be notified and can respond to your connection.

Best regards,
Your Platform Team
  `;

  // ===== HTML VERSION =====
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- EMAIL HEADER WITH LOGO -->
      <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
        <div style="display: inline-block; width: 40px; height: 40px; background-color: #231f20; border-radius: 50%; position: relative; margin-bottom: 10px;">
          <svg style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px;" viewBox="0 0 117.4 117.4">
            <g>
              <polyline points="52.2 49 34.3 76.2 55.7 76.2" fill="none" stroke="#ffffff" stroke-width="5.7" stroke-miterlimit="10"/>
              <circle cx="27.7" cy="50.8" r="5" fill="#ffffff"/>
              <circle cx="84.3" cy="50.8" r="5" fill="#ffffff"/>
              <circle cx="58.7" cy="58.7" r="55.9" fill="none" stroke="#ffffff" stroke-width="5.7" stroke-miterlimit="10"/>
            </g>
          </svg>
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #333;">Pensive</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Connection Sent Successfully!</p>
      </div>
      
      <!-- MAIN CONFIRMATION BOX -->
      <!-- Clean white box with black borders and rounded corners -->
      <div style="background-color: white; padding: 24px; border-radius: 12px; margin: 20px 0; border: 2px solid #000000;">
        <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #333;"><strong>Your connection request has been sent to ${ideaCreator.firstName} ${ideaCreator.lastName}!</strong></p>
        <p style="margin: 0 0 20px 0; color: #666; font-size: 16px;">They will be notified and can respond to your connection.</p>
        
        <!-- IDEA INFO BOX -->
        <!-- Inner gray box showing the idea they connected to -->
        <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; border: 1px solid #e9ecef;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #333; font-size: 14px;">Idea you connected to:</p>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #0f0f0f;">"${idea.title}"</p>
        </div>
      </div>

      <!-- PROFILE LINK -->
      <p style="color: #6b6b6b; font-size: 12px; margin: 20px 0;">You can view all your connections in your profile.</p>
      
      <!-- EMAIL FOOTER -->
      <!-- Styled to match your app's footer -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 14px; text-align: center;">
        <p style="margin: 0;">Best regards,<br><strong>Your Pensive Team</strong></p>
      </div>
    </div>
  `;

  return await sendEmail(connectingUser.email, subject, text, html);
};

// ===== EXPORT ALL EMAIL FUNCTIONS =====
export default {
  sendEmail,
  sendConnectionNotification,
  sendConnectionConfirmation,
};
