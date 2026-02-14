
import { useState, useRef, useEffect } from 'react';
import { GoDotFill } from "react-icons/go";

export default function ChatInput({ onSendMessage, isLoading, suggestions = [] }) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [placeholder, setPlaceholder] = useState('Ask about admissions...');
    const textareaRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setPlaceholder('Ask about admissions, requirements, deadlines...');
            } else {
                setPlaceholder('Ask about admissions...');
            }
        };

        // Set initial placeholder
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        onSendMessage(suggestion);
        setInput('');
        setShowSuggestions(false);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <div className="border-t border-slate-200 bg-white px-4 py-4 drop-shadow">
            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="container mx-auto mb-5 flex flex-wrap gap-3">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="container mx-auto flex gap-3">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-slate-50 border-2 border-gray-300 rounded-lg md:text-base px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 placeholder:text-gray-500 resize-none overflow-hidden max-h-16"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center"
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
                        </svg>
                    )}
                </button>
            </form>

            <p className="container mx-auto text-xs font-medium mt-2 flex items-center gap-1"><GoDotFill /> Press Enter to send <GoDotFill className='ml-2' /> Press Shift + Enter for new line</p>
        </div>
    );
}
