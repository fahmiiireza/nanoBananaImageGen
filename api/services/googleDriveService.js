
const { google } = require('googleapis');
const stream = require('stream');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function createFolder(name) {
  const fileMetadata = {
    name: name,
    mimeType: 'application/vnd.google-apps.folder'
  };
  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    });
    return file.data.id;
  } catch (error) {
    console.error('Error creating Google Drive folder:', error);
    throw error;
  }
}

async function uploadImage(folderId, imageName, imageBase64) {
  const imageBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');
  const bufferStream = new stream.PassThrough();
  bufferStream.end(imageBuffer);

  const fileMetadata = {
    name: imageName,
    parents: [folderId]
  };
  const media = {
    mimeType: 'image/png',
    body: bufferStream
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    return file.data.id;
  } catch (error) {
    console.error('Error uploading image to Google Drive:', error);
    throw error;
  }
}

async function makeFolderPublic(folderId) {
  try {
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    const result = await drive.files.get({
      fileId: folderId,
      fields: 'webViewLink'
    });
    return result.data.webViewLink;
  } catch (error) {
    console.error('Error making folder public:', error);
    throw error;
  }
}

module.exports = {
  createFolder,
  uploadImage,
  makeFolderPublic
};
