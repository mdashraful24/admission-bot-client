// API Service for Admission Bot with OpenAI GPT Integration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt to restrict bot to admission-related topics
const SYSTEM_PROMPT = `You are a helpful admission advisor assistant. You ONLY answer questions related to:
- University/school admissions process
- Application requirements and deadlines
- Documents needed for admission
- Admission eligibility criteria
- Academic requirements (GPA, test scores)
- Tuition and financial aid
- Student life and campus information
- Enrollment procedures

If the user asks about topics unrelated to admissions (like cooking, sports, politics, etc.), politely decline and redirect them to ask about admissions-related topics. Keep responses concise and helpful.`;

export const chatWithBot = async (message, conversationHistory = []) => {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to .env.local');
    }

    try {
        // Format conversation history for OpenAI API
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const botReply = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
        
        return {
            reply: botReply,
            message: botReply,
        };
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
};

export const getSuggestions = async () => {
    // Return default admission-related suggestions
    return {
        suggestions: [
            "What are the admission requirements?",
            "When is the application deadline?",
            "How do I apply?",
            "What documents do I need?",
            "What's the GPA requirement?",
        ]
    };
};

export const searchAdmissionInfo = async (query) => {
    // This function now uses GPT to search admission info
    return chatWithBot(query);
};
