const express = require('express');
const axios = require('axios');
const { Octokit } = require('@octokit/rest');
const crypto = require('crypto');
const path = require('path');

const router = express.Router();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const WEBHOOK_URL = process.env.WEBHOOK_URL;

router.post('/generate', async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const { originalname, buffer } = req.file;
      const content = buffer.toString('base64');
      
      const randomId = crypto.randomBytes(4).toString('hex');
      const extension = path.extname(originalname);
      const basename = path.basename(originalname, extension);
      const newFilename = `${basename}-${randomId}${extension}`;

      const response = await octokit.repos.createOrUpdateFileContents({
        owner: 'fahmiiireza',
        repo: 'img-hosting',
        path: newFilename,
        message: `Upload image: ${newFilename}`,
        content: content,
      });

      imageUrl = response.data.content.download_url;
    }

    const payload = {
      ...req.body,
      imageUrl: imageUrl,
    };

    const webhookResponse = await axios.post(WEBHOOK_URL, payload);

    res.json(webhookResponse.data);

  } catch (error) {
    console.error('Error processing request:', error);
    if (error.response) {
      console.error('GitHub API Error:', error.response.data);
    }
    res.status(500).json({ 
      error: 'Failed to process request',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      githubError: process.env.NODE_ENV === 'development' && error.response ? error.response.data : undefined,
    });
  }
});

module.exports = router;