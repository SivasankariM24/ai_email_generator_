
interface EmailForm {
  purpose: string;
  emailType: string;
  recipient: string;
  sender: string;
  company: string;
  subject: string;
  additionalInfo: string;
  maxLength: number;
  preferredAI: string;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const generateEmailWithGemini = async (form: EmailForm): Promise<string> => {
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Gemini API key not found. Please configure your API key in the Service Status tab.');
  }

  const prompt = `Generate a ${form.emailType} email for the purpose of "${form.purpose}".

Email Details:
- To: ${form.recipient || 'the recipient'}
- From: ${form.sender || 'the sender'}
- Subject: ${form.subject || 'Professional Email'}
- Company: ${form.company || 'N/A'}
- Context: ${form.additionalInfo || 'General communication'}
- Tone: ${form.emailType} (${form.emailType === 'casual' ? 'friendly and approachable' : form.emailType === 'formal' ? 'respectful and professional' : 'business professional'})
- Maximum length: approximately ${form.maxLength} words

Please write a complete, well-structured email that:
1. Uses appropriate greeting and closing for the ${form.emailType} tone
2. Incorporates the provided context naturally
3. Matches the specified purpose
4. Maintains professionalism while fitting the requested tone
5. Includes a proper subject line
6. Is approximately ${form.maxLength} words or less

Format the response as a complete email with subject line.`;

  console.log('Sending request to Gemini API with prompt:', prompt);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: Math.min(form.maxLength * 4, 2048),
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    return generatedText.trim();

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const checkGeminiConnection = async (): Promise<boolean> => {
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    return false;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Test connection' }]
        }],
        generationConfig: {
          maxOutputTokens: 10
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error testing Gemini connection:', error);
    return false;
  }
};
