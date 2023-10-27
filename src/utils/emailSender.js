const AWS = require('aws-sdk');
const { logger } = require('./logger');
const { emailLanguages } = require('../controllers/user/user.constant');
const { postAsync } = require('./ApiRequest');
const { notificationTypes, notificationChannels } = require('./constant');
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
  try {
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
  } catch (err) {
    logger.error(err.message);
  }
};

exports.sendTemporaryPasswordEmail = async ({
  email,
  temporaryPassword,
  userName,
  userId,
}) => {
  try {
    const data = await postAsync({
      uri: process.env.NOTIFICATION_SERVICE,
      body: this.emailConstants.temporaryPasswordInput({
        email,
        temporaryPassword,
        userName,
        userId,
      }),
    });

    return true;
  } catch (err) {
    logger.error(err.message);
    return false;
  }
};

exports.sendResetLinkToEmail = async ({
  userName,
  email,
  resetUuid,
  userId,
}) => {
  try {
    const data = await postAsync({
      uri: process.env.NOTIFICATION_SERVICE,
      body: this.emailConstants.resetPassword({
        email,
        userName,
        userId,
        resetUuid,
      }),
    });

    return true;
  } catch (err) {
    logger.error(err.message);
    return false;
  }
};

exports.emailConstants = {
  temporaryPasswordInput: ({ email, temporaryPassword, userName, userId }) => {
    return {
      notification_type: notificationTypes.USER_TEMPORARY_PASSWORD,
      channels: [notificationChannels.EMAIL_NOTIFICATION],
      content: {
        user_name: userName,
        temporary_password: temporaryPassword,
      },
      contact_info: {
        email: email,
      },
      user_id: userId,
      lang: emailLanguages.ENGLISH,
    };
  },
  resetPassword: ({ userId, email, userName, resetUuid }) => {
    return {
      notification_type: notificationTypes.USER_PASSWORD_RESET_MESSAGE,
      channels: [notificationChannels.EMAIL_NOTIFICATION],
      content: {
        user_name: userName,
        reset_password_link: `${process.env.CHANGE_PASSWORD_URL}?uuid=${resetUuid}`,
      },
      contact_info: {
        email: email,
      },
      user_id: userId,
      lang: emailLanguages.ENGLISH,
    };
  },
};
