
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

// PATCH /files/:fileId  -- rename file (add this to gdrive.js)
router.patch('/files/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const { name } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'Missing fileId parameter' });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Missing or invalid "name" in request body' });
    }

    // update file name
    const response = await drive.files.update({
      fileId,
      requestBody: {
        name: name.trim()
      },
      fields: 'id, name, mimeType, modifiedTime, webViewLink'
    });

    // return updated metadata
    res.json(response.data);
  } catch (error) {
    console.error('Error renaming file on Google Drive:', error);
    res.status(500).json({ error: 'Failed to rename file', details: error.message });
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

router.get('/prompt/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    let data = '';
    response.data.on('data', chunk => {
      data += chunk;
    });

    response.data.on('end', () => {
      try {
        const json = JSON.parse(data);
        res.json(json);
      } catch (err) {
        res.status(400).json({ error: 'Invalid JSON content in file' });
      }
    });

    response.data.on('error', err => {
      res.status(500).json({ error: 'Error reading file stream' });
    });
  } catch (error) {
    console.error('Error fetching JSON file from Google Drive:', error);
    res.status(500).json({ error: 'Failed to fetch JSON file from Google Drive' });
  }
});

// Rename a file
router.patch('/files/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const newName = req.body.name;

    if (!newName) {
      return res.status(400).json({ error: 'New file name is required' });
    }

    const response = await drive.files.update({
      fileId: fileId,
      requestBody: {
        name: newName,
      },
      fields: 'id, name',
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error renaming file in Google Drive:', error);
    res.status(500).json({ error: 'Failed to rename file in Google Drive' });
  }
});


module.exports = router;
