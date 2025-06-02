import OpenAI from 'openai';

let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the backend
  });
};

export const analyzeImage = async (imageBase64: string): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Please provide an API key.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a warehouse quality control expert. Analyze images with attention to pallet conditions, packaging integrity, safety compliance, and proper storage practices. Provide observations in a paragraph format. Be extremely objective and only cover what the image shows. Dont draw conclusions."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this warehouse image focusing on:\n" +
                    "- Pallet condition and configuration\n" +
                    "- Packaging integrity and alignment\n" +
                    "- Label visibility and placement\n" +
                    "- Safety compliance\n" +
                    "- Storage practices\n" +
                    "- Potential handling issues\n" +
                    "Provide a detailed analysis in a single, well-structured paragraph."
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    return response.choices[0]?.message?.content || 'No description available';
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze image');
  }
};