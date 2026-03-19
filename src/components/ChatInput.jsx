import { useState, useRef, useEffect } from 'react';
import { GoDotFill } from "react-icons/go";

export default function ChatInput({ onSendMessage, isLoading, suggestions = [] }) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [placeholder, setPlaceholder] = useState('Ask about admissions...');
    const [isMobile, setIsMobile] = useState(false);
    const textareaRef = useRef(null);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        // Set initial value
        checkMobile();

        // Add event listener for resize
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            // mark that the user interacted and keep the textarea focused
            userInteractedRef.current = true;
            // Only focus if not on mobile
            if (textareaRef.current && !isLoading && !isMobile) {
                textareaRef.current.focus();
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        onSendMessage(suggestion);
        setInput('');
        setShowSuggestions(false);
        userInteractedRef.current = true;
        // Only focus if not on mobile
        if (textareaRef.current && !isLoading && !isMobile) {
            textareaRef.current.focus();
        }
    };

    // Only auto-focus after the user has started interacting (sent a message or used a suggestion)
    const userInteractedRef = useRef(false);

    useEffect(() => {
        // Only auto-focus if not on mobile
        if (userInteractedRef.current && !isLoading && textareaRef.current && !isMobile) {
            textareaRef.current.focus();
        }
    }, [isLoading, isMobile]);

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
        <div className="border-t border-slate-200 bg-slate-300 px-4 py-4 drop-shadow">
            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="container mx-auto mb-5 flex flex-wrap gap-3">
                    {suggestions.slice(0, 7).map((suggestion, index) => (
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
                    className="w-full bg-slate-50 border-2 border-gray-300 rounded-lg md:text-base px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700 placeholder:text-gray-500 resize-none overflow-hidden max-h-16"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:cursor-not-allowed text-white disabled:text-slate-400 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
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






// import { useState, useRef, useEffect } from 'react';
// import { GoDotFill } from "react-icons/go";

// export default function ChatInput({ onSendMessage, isLoading, suggestions = [] }) {
//     const [input, setInput] = useState('');
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const [placeholder, setPlaceholder] = useState('Ask about admissions...');
//     const textareaRef = useRef(null);

//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 768) { // md breakpoint
//                 setPlaceholder('Ask about admissions, requirements, deadlines...');
//             } else {
//                 setPlaceholder('Ask about admissions...');
//             }
//         };

//         // Set initial placeholder
//         handleResize();

//         // Add event listener
//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         if (input.trim() && !isLoading) {
//             onSendMessage(input.trim());
//             setInput('');
//             setShowSuggestions(false);
//             // mark that the user interacted and keep the textarea focused
//             userInteractedRef.current = true;
//             if (textareaRef.current && !isLoading) textareaRef.current.focus();
//         }
//     };

//     const handleSuggestionClick = (suggestion) => {
//         onSendMessage(suggestion);
//         setInput('');
//         setShowSuggestions(false);
//         userInteractedRef.current = true;
//         if (textareaRef.current && !isLoading) textareaRef.current.focus();
//     };

//     // Only auto-focus after the user has started interacting (sent a message or used a suggestion)
//     const userInteractedRef = useRef(false);

//     useEffect(() => {
//         if (userInteractedRef.current && !isLoading && textareaRef.current) {
//             textareaRef.current.focus();
//         }
//     }, [isLoading]);

//     const handleInputChange = (e) => {
//         setInput(e.target.value);
//         setShowSuggestions(e.target.value.length > 0);
//         // Auto-resize textarea
//         if (textareaRef.current) {
//             textareaRef.current.style.height = 'auto';
//             textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage(e);
//         }
//     };

//     return (
//         <div className="border-t border-slate-200 bg-slate-300 px-4 py-4 drop-shadow">
//             {/* Suggestions */}
//             {showSuggestions && suggestions.length > 0 && (
//                 <div className="container mx-auto mb-5 flex flex-wrap gap-3">
//                     {suggestions.slice(0, 7).map((suggestion, index) => (
//                         <button
//                             key={index}
//                             onClick={() => handleSuggestionClick(suggestion)}
//                             className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
//                         >
//                             {suggestion}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* Input Form */}
//             <form onSubmit={handleSendMessage} className="container mx-auto flex gap-3">
//                 <textarea
//                     ref={textareaRef}
//                     value={input}
//                     onChange={handleInputChange}
//                     onKeyDown={handleKeyDown}
//                     placeholder={placeholder}
//                     className="w-full bg-slate-50 border-2 border-gray-300 rounded-lg md:text-base px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700 placeholder:text-gray-500 resize-none overflow-hidden max-h-16"
//                     rows={1}
//                     disabled={isLoading}
//                 />
//                 <button
//                     type="submit"
//                     disabled={isLoading || !input.trim()}
//                     className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:cursor-not-allowed text-white disabled:text-slate-400 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center"
//                 >
//                     {isLoading ? (
//                         <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                         </svg>
//                     ) : (
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
//                         </svg>
//                     )}
//                 </button>
//             </form>

//             <p className="container mx-auto text-xs font-medium mt-2 flex items-center gap-1"><GoDotFill /> Press Enter to send <GoDotFill className='ml-2' /> Press Shift + Enter for new line</p>
//         </div>
//     );
// }