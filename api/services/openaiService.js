

const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSegments(params) {
    console.log('[OpenAI] Starting generation with params:', params);
    const { imageCount = 1 } = params;
    const segments = [];

    for (let i = 0; i < imageCount; i++) {
      const prompt = `Create a single, high-quality image prompt in JSON format. The prompt should be a detailed, vivid description for an image generation model. 

Parameters:
- Script: "${params.script}"
- Age Range: ${params.ageRange}
- Gender: ${params.gender}
- Product: ${params.product}
- Room: ${params.room}
- Style: ${params.style}

Based on these parameters, generate a JSON object with a single key, "prompt", that contains a detailed and creative image prompt. The prompt should be at least 100 words long. Each prompt you generate in this session should be unique.`

      try {
        const response = await this.openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert in creating image generation prompts. Your task is to generate a JSON object containing a single key, \"prompt\", which holds a detailed and creative image prompt based on the user's input. The prompt should be at least 100 words long. Each prompt you generate in this session should be unique."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7 + (i * 0.05), // Add some variation to each prompt
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        console.log(`[OpenAI] Prompt ${i + 1}/${imageCount} generated successfully:`, parsed.prompt);
        segments.push(parsed);

      } catch (error) {
        console.error(`[OpenAI] Error in generateSegments for prompt ${i + 1}:`, error);
        throw error;
      }
    }
    return { segments };
  }
}

module.exports = new OpenAIService();
