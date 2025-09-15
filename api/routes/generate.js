const express = require('express');
const axios = require('axios');
const { Octokit } = require('@octokit/rest');
const crypto = require('crypto');
const path = require('path');

const router = express.Router();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });



const getWebhookUrl = (model) => {
  switch (model) {
    case 'Nano Banana (Text to Image)':
      return process.env.WEBHOOK_URL_GEMINI; // TODO: Change to Nano Banana Text to Image Webhook
    case 'Nano Banana (Image to Image)':
      return process.env.WEBHOOK_URL_GEMINI; // TODO: Change to Nano Banana Image to Image Webhook
    case 'Flux Pro (Text to Image)':
      return process.env.WEBHOOK_URL_FLUX_PRO;
    case 'Flux Pro Ultra (Image to Image)':
      return process.env.WEBHOOK_URL_FLUX_PRO_ULTRA;
    default:
      return process.env.WEBHOOK_URL_GEMINI; // Default to Gemini
  }
};

const getMappedModelName = (model) => {
  switch (model) {
    case 'Nano Banana (Text to Image)':
      return 'nano_banana_text_to_image';
    case 'Nano Banana (Image to Image)':
      return 'nano_banana_image_to_image';
    case 'Flux Pro (Text to Image)':
      return 'flux_pro';
    case 'Flux Pro Ultra (Image to Image)':
      return 'flux_pro_ultra';
    default:
      return 'gemini';
  }
};

router.post('/generate', async (req, res) => {
  try {
    let imageUrls = [];
    const { model } = req.body;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { originalname, buffer } = file;
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

        imageUrls.push(response.data.content.download_url);
      }
    }

    const mappedModelName = getMappedModelName(model);

    const payload = {
      ...req.body,
      imageUrl: imageUrls,
      model: mappedModelName,
    };

    const webhookUrl = getWebhookUrl(model);
    const webhookResponse = await axios.post(webhookUrl, payload);

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