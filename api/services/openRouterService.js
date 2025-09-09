
const axios = require('axios');

const generateImage = async (prompt) => {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.5-flash-image-preview',
      messages: [
        { role: 'user', content: prompt }
      ],
      modalities: ['image']
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices[0].message.content) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid response from OpenRouter');
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};

module.exports = {
  generateImage,
};
