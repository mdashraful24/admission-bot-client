// API Service for Admission Bot
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Generate or retrieve user ID for conversation tracking
const getUserId = () => {
    let userId = localStorage.getItem('admission_bot_user_id');
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('admission_bot_user_id', userId);
    }
    return userId;
};

export const chatWithBot = async (message) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: getUserId(),
                message,
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getSuggestions = async () => {
    // Default suggestions for the admission bot
    return {
        suggestions: [
            "What are the admission requirements?",
            "When is the application deadline?",
            "How do I apply?",
            "What documents do I need?",
            "What is the tuition fee?",
        ]
    };
};
