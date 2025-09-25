
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

router.get('/files', async (req, res) => {
  try {
    const folderId = req.query.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, modifiedTime)',
    });
    res.json(response.data.files);
  } catch (error) {
    console.error('Error listing files from Google Drive:', error);
    res.status(500).json({ error: 'Failed to list files from Google Drive' });
  }
});

router.delete('/files/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    await drive.files.delete({
      fileId: fileId,
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error);
    res.status(500).json({ error: 'Failed to delete file from Google Drive' });
  }
});

router.get('/image/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    }, { responseType: 'stream' });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Length', response.headers['content-length']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error serving image from Google Drive:', error);
    res.status(500).json({ error: 'Failed to serve image from Google Drive' });
  }
});

module.exports = router;
