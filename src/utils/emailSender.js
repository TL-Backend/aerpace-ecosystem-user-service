const AWS = require('aws-sdk');
const { logger } = require('./logger');
require('dotenv').config();

exports.mailService = async ({ params }) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
    region: process.env.REGION,
  });
  const ses = new AWS.SES({ apiVersion: process.env.API_VERSION });
  await ses.sendEmail(params).promise();
};

exports.sendEmail = async ({ email, resetUuid }) => {
  try{
    const resetLink = `${process.env.CHANGE_PASSWORD_URL}?uuid=${resetUuid}`;
    const emailContent = this.emailConstants.RESET_LINK_EMAIL_CONTENT.replace(
      '$resetLink',
      `${resetLink}`,
    );
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailContent,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: this.emailConstants.SUBJECT,
        },
      },
      Source: this.emailConstants.FROM_EMAIL,
      ReplyToAddresses: [this.emailConstants.REPLY_TO_EMAIL],
    };
    await this.mailService({ params });
  }catch(err){
    logger.error(err)
  }
};

exports.sendTemporaryPasswordEmail = async ({ email, temporaryPassword }) => {
  try {
    const emailContent =
      this.emailConstants.TEMPORARY_PASSWORD_EMAIL_CONTENT.replace(
        '{temporaryPassword}',
        temporaryPassword,
      );
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailContent,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: this.emailConstants.SUBJECT,
        },
      },
      Source: this.emailConstants.FROM_EMAIL,
      ReplyToAddresses: [this.emailConstants.REPLY_TO_EMAIL],
    };
    await this.mailService({ params });
    return true
  } catch (err) {
    logger.error(err)
    return false
  }
};

exports.emailConstants = {
  FROM_EMAIL: 'pradeep@tilicho.in',
  REPLY_TO_EMAIL: 'pradeep@tilicho.in',
  SUBJECT: 'Welcome to aerpace - Temporary Password',
  TEMPORARY_PASSWORD_SUBJECT: 'Hello aerpace user - Reset your password',
  TEMPORARY_PASSWORD_EMAIL_CONTENT: `
  <p>Hello,</p>
  <p>Welcome to our system! Here is your temporary password for your initial login:</p>
  <p><strong>{temporaryPassword}</strong></p>
  <p>Please keep this password secure and change it after your first login.</p>
  <p>Click the link below to log in:</p>
  <p><a href="https://example.com/login">Log In</a></p>
  <p>If you have any questions or need assistance, feel free to contact us.</p>
  <p>Best regards,</p>
  <p>-aerpace</p>
  `,
  RESET_LINK_EMAIL_CONTENT: `
    <p>Hello,</p>
    <p>You have requested a password reset for your account. Click the link below to reset your password:</p>
    <p><a href="$resetLink">resetLink</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,</p> 
    <p>-aerpace</p>
    `,
};
