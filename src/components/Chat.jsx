import { useState, useCallback, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { chatWithBot, getSuggestions } from '../services/api';
import { Link } from 'react-router';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    // Load suggestions on component mount
    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        try {
            const data = await getSuggestions();
            setSuggestions(data.suggestions || [
                "What are the admission requirements?",
                "When is the application deadline?",
                "How do I apply?",
            ]);
        } catch (err) {
            console.error('Failed to load suggestions:', err);
            // Set default suggestions if API fails
            setSuggestions([
                "What are the admission requirements?",
                "When is the application deadline?",
                "How do I apply?",
            ]);
        }
    };

    const handleSendMessage = useCallback(async (userMessage) => {
        // Add user message to chat
        const userMsgId = Date.now();
        const userMsg = {
            id: userMsgId,
            sender: 'user',
            text: userMessage,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        try {
            // Prepare conversation history for API
            const conversationHistory = messages.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
            }));

            // Get bot response
            const response = await chatWithBot(userMessage, conversationHistory);

            // Add bot message to chat
            const botMsgId = Date.now() + 1;
            const botMsg = {
                id: botMsgId,
                sender: 'bot',
                text: response.reply || response.message || "I couldn't process your request. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to get response. Please try again.');

            // Add error message
            const errorMsgId = Date.now() + 1;
            const errorMsg = {
                id: errorMsgId,
                sender: 'bot',
                text: 'Sorry, I encountered an error. Please try again later.',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const handleClearChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Helmet */}
            <title>Chat | Admission Bot</title>

            {/* Header */}
            <div className='border-b border-slate-200 bg-white px-4 py-3 shadow-sm'>
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-lg">
                                AB
                            </div>
                            <span className="text-xl md:text-2xl font-bold">Admission Bot</span>
                        </div>
                    </Link>
                    <button
                        onClick={handleClearChat}
                        className="btn btn-primary"
                    >
                        <span className='hidden md:block'>Clear Chat</span>
                        <span className='block md:hidden'>Clear</span>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 text-sm text-red-700 text-center drop-shadow-md py-3">
                    <div className="container mx-auto">
                        {error}
                    </div>
                </div>
            )}

            {/* Messages */}
            <MessageList messages={messages} isLoading={isLoading} />

            {/* Input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                suggestions={suggestions}
            />
        </div>
    );
}
