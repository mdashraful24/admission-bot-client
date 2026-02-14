# Admission Bot - Complete Chat Interface Setup

## Project Structure Overview

```
src/
├── components/
│   ├── Chat.jsx           # Main chat interface component
│   ├── ChatInput.jsx      # Message input with suggestions
│   ├── MessageBubble.jsx  # Individual message display
│   └── MessageList.jsx    # Messages container
├── services/
│   └── api.js            # API integration service
├── router/
│   └── Router.jsx        # Route configuration
├── App.jsx               # Landing page
└── main.jsx
```

## Components Created

### 1. **Chat Component** (`src/components/Chat.jsx`)
Main interface managing:
- Message state and conversation history
- API communication
- Loading states and error handling
- Auto-loading suggestions
- Clear chat functionality

### 2. **MessageList Component** (`src/components/MessageList.jsx`)
- Displays all messages (user & bot)
- Auto-scrolls to latest message
- Shows loading animation
- Empty state UI
- Message timestamps

### 3. **MessageBubble Component** (`src/components/MessageBubble.jsx`)
- Individual message styling
- User vs Bot message differentiation
- Time formatting
- Clean, responsive design

### 4. **ChatInput Component** (`src/components/ChatInput.jsx`)
- Auto-expanding textarea
- Suggestion pills
- Keyboard support (Shift+Enter for newline)
- Loading state handling
- Message validation

### 5. **API Service** (`src/services/api.js`)
Three main endpoints:
- `chatWithBot()` - Send message and get response
- `searchAdmissionInfo()` - Search specific admission info
- `getSuggestions()` - Fetch suggested questions

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Then update with your backend API URL:
```
VITE_API_URL=http://your-backend-url/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Server
```bash
npm run dev
```

Access the app at: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## Backend API Requirements

Your backend should provide these endpoints:

### `POST /api/chat`
Send a message and get a response.

**Request:**
```json
{
  "message": "User question",
  "history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Bot response"}
  ]
}
```

**Response:**
```json
{
  "reply": "Bot's response text",
  "success": true
}
```

### `POST /api/search`
Search for specific admission information.

**Request:**
```json
{
  "query": "Search term"
}
```

**Response:**
```json
{
  "results": [],
  "success": true
}
```

### `GET /api/suggestions`
Get suggested questions for the chat.

**Response:**
```json
{
  "suggestions": [
    "What are admission requirements?",
    "When is the deadline?",
    "How do I apply?"
  ]
}
```

## Features

✅ Real-time chat interface
✅ Auto-expanding message input
✅ Conversation history
✅ Suggested questions
✅ Loading states and animations
✅ Error handling and display
✅ Responsive design (mobile, tablet, desktop)
✅ Smooth message scrolling
✅ Message timestamps
✅ Clear chat functionality
✅ Keyboard shortcuts (Shift+Enter for newline)

## Styling

Uses:
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Pre-built Tailwind components
- Custom gradient and animation classes

## Customization Tips

### Change bot name/avatar
Edit the bot avatar in:
- `MessageBubble.jsx` - "AB" text and background color
- `MessageList.jsx` - Loading indicator bot avatar
- `Chat.jsx` - Header title

### Add more suggestions
Update `loadSuggestions()` in `Chat.jsx` to fetch from your backend or hardcode defaults.

### Modify colors
Update Tailwind classes:
- Primary color: Change `bg-blue-*` classes
- Background: Modify `bg-slate-*` classes

### Change message bubble style
Edit classes in `MessageBubble.jsx`:
```jsx
// User message styling
className={isUser ? 'bg-blue-500 text-white' : 'bg-slate-100'}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Messages are memoized via React keys
- Textarea auto-resize to prevent layout shift
- Lazy loading of suggestions
- Efficient state management
- Auto-scroll used only when needed

## Future Enhancements

- [ ] Message search functionality
- [ ] Export conversation history
- [ ] Typing indicators
- [ ] Message reactions/ratings
- [ ] File upload support
- [ ] Voice input
- [ ] Multi-language support
- [ ] Dark mode
- [ ] User preferences storage

## Troubleshooting

**API Connection Issues:**
1. Check backend is running on correct port
2. Verify `VITE_API_URL` in `.env` is correct
3. Check browser console for CORS errors
4. Ensure backend API endpoints are implemented

**Messages not sending:**
1. Check browser console for JavaScript errors
2. Verify API endpoint responses
3. Check network tab for failed requests
4. Ensure message is not empty

**Styling issues:**
1. Clear browser cache
2. Run `npm run build` to rebuild CSS
3. Check Tailwind CSS is properly installed

## License

This project is part of the Admission Bot system.
