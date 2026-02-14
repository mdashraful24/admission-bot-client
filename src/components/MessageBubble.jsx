export default function MessageBubble({ message }) {
    const isUser = message.sender === 'user';

    return (
        <div className={`container mx-auto flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">AB</span>
                </div>
            )}
            <div
                className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${isUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}
            >
                <p className="wrap-break-word whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                </p>
                {message.timestamp && (
                    <span className={`text-xs text-end mt-1 block ${isUser ? 'text-blue-100' : 'text-slate-500'}`}>
                        {formatTime(message.timestamp)}
                    </span>
                )}
            </div>
        </div>
    );
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
