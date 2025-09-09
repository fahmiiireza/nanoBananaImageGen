
const express = require('express');
const OpenAIService = require('../services/openaiService.js');
const OpenRouterService = require('../services/openRouterService.js');
const GoogleDriveService = require('../services/googleDriveService.js');

const router = express.Router();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

router.post('/generate', async (req, res) => {
  console.log('[Generate] Request received:', {
    bodyKeys: Object.keys(req.body),
    scriptLength: req.body.script?.length || 0
  });

  try {
    const { 
      script, 
      ageRange, 
      gender, 
      product, 
      room, 
      style, 
      imageCount = 1, // Default to 1 image
      jsonFormat = 'standard',
      voiceType,
      energyLevel,
      settingMode = 'single',
      locations = [],
      cameraStyle,
      timeOfDay,
      backgroundLife,
      productStyle,
      energyArc,
      narrativeStyle,
      ethnicity,
      characterFeatures,
      clothingDetails,
      accentRegion
    } = req.body;

    if (!script || script.trim().length < 10) {
      console.log('[Generate] Validation failed: Script too short');
      return res.status(400).json({ 
        error: 'Script must be at least 10 characters long' 
      });
    }

    const params = {
      script: script.trim(),
      ageRange,
      gender,
      product,
      room,
      style,
      imageCount,
      jsonFormat,
      voiceType,
      energyLevel,
      settingMode,
      locations,
      cameraStyle,
      timeOfDay,
      backgroundLife,
      productStyle,
      energyArc,
      narrativeStyle,
      ethnicity,
      characterFeatures,
      clothingDetails,
      accentRegion
    };

    const openAIResult = await OpenAIService.generateSegments(params);

    if (!openAIResult.segments || openAIResult.segments.length === 0) {
      throw new Error('OpenAI did not return any segments');
    }

    const folderName = `Image Generation - ${new Date().toISOString()}`;
    const folderId = await GoogleDriveService.createFolder(folderName);

    const images = [];
    const prompts = openAIResult.segments.map(s => s.prompt);

    for (let i = 0; i < prompts.length; i++) {
      const imagePrompt = prompts[i];
      console.log(`[Generate] Generating image ${i + 1}/${prompts.length} with prompt:`, imagePrompt);

      try {
        const image = await OpenRouterService.generateImage(imagePrompt);
        images.push({ image, prompt: imagePrompt });

        // Upload to Google Drive
        const imageName = `image_${i + 1}.png`;
        await GoogleDriveService.uploadImage(folderId, imageName, image);

      } catch (error) {
        console.error(`[Generate] Error generating image ${i + 1}:`, error);
        images.push({ error: 'Failed to generate image', prompt: imagePrompt });
      }

      if (i < prompts.length - 1) {
        console.log('[Generate] Waiting for 3 seconds...');
        await sleep(3000);
      }
    }

    const folderLink = await GoogleDriveService.makeFolderPublic(folderId);

    res.json({
      success: true,
      folderLink: folderLink
    });

  } catch (error) {
    console.error('[Generate] Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({ 
      error: 'Failed to generate images',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
    });
  }
});

module.exports = router;
