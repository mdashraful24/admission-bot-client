// API Service for Admission Bot with OpenAI GPT Integration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt to restrict bot to DIU admission-related topics only
const SYSTEM_PROMPT = `You are a specialist assistant for Daffodil International University (DIU) admissions. You MUST only provide information, guidance, or answers that are directly related to DIU admission processes, requirements, deadlines, tuition, financial aid, required documents, eligibility, enrollment procedures, and DIU-specific student life or campus information.

If the user asks about admissions for any other university or requests comparisons involving other universities, politely respond that you only provide DIU admission information and cannot provide authoritative details for other institutions. Offer to answer the user's question as it relates to DIU (for example, how DIU handles similar topics) or direct them to official sites of the other institutions.

If the user asks about topics unrelated to admissions (for example: cooking, sports, politics, or non-admissions academic queries), decline politely and invite them to ask DIU admission-related questions. Keep responses concise, DIU-focused, and helpful.`;

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
            "What are the DIU admission requirements?",
            "When is the DIU application deadline?",
            "How do I apply to DIU?",
            "How can I contact the DIU admissions office?"
        ]
    };
};

export const searchAdmissionInfo = async (query) => {
    // This function now uses GPT to search admission info
    return chatWithBot(query);
};
