# Admission Bot

<div align="center">
  <img height="500" src="https://drive.google.com/uc?export=view&id=1khBWoVZm2E09dkPdpec78MfT9P4TbZue" />
</div>

An intelligent AI-powered chatbot for answering university admission-related questions using OpenAI's GPT API.

## Features

- 💬 **AI-Powered Chat** - Uses OpenAI GPT to answer admission questions intelligently
- 🎯 **Admission-Only Focus** - Automatically declines non-admission topics and redirects to relevant questions
- 📱 **Responsive Design** - Mobile-friendly interface built with Tailwind CSS
- 💾 **Conversation History** - Maintains context across multiple messages
- ⚡ **Fast & Modern** - Built with React and Vite for optimal performance
- 🎨 **Clean UI** - Professional chat interface with message styling

## Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Styling**: Tailwind CSS, DaisyUI
- **Icons**: React Icons
- **API**: OpenAI GPT
- **Build Tool**: Vite

## Prerequisites

- Node.js 16+ and npm
- OpenAI API key (get one from [platform.openai.com](https://platform.openai.com))

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd admission-bot-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create or edit `.env.local` in the project root:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_MODEL=gpt-3.5-turbo
   ```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the optimized production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm preview
```

## Deployment

### Netlify

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore`)
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard:
   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Add `VITE_OPENAI_API_KEY` and `VITE_OPENAI_MODEL`
4. Deploy automatically on push or trigger manually

**Note**: Never commit `.env.local` to git. Always use Netlify's environment variable settings for production.

## Project Structure

```
src/
├── components/
│   ├── Chat.jsx              # Main chat interface
│   ├── ChatInput.jsx         # Message input with suggestions
│   ├── MessageBubble.jsx     # Individual message styling
│   └── MessageList.jsx       # Messages container
├── services/
│   └── api.js                # OpenAI API integration
├── router/
│   └── Router.jsx            # Route configuration
├── App.jsx                   # Landing page
├── App.css                   # Global styles
├── main.jsx                  # Entry point
└── index.css                 # Base styles
```

## API Configuration

The bot uses OpenAI's Chat Completion API with the following settings:

- **Model**: GPT-3.5-turbo (configurable to GPT-4)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 500 (response length limit)
- **System Prompt**: Enforces admission-only topic restrictions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Chat Interface
- Auto-scrolling message list
- Loading indicators
- Error handling and user feedback
- Clear chat history option

### Smart Suggestions
- Pre-populated questions about admissions
- Click-to-send suggestions
- Dynamic suggestion loading

### Admission-Only Restrictions
The bot is programmed to:
- Answer questions about admissions requirements
- Explain application processes and deadlines
- Discuss financial aid and enrollment
- Provide campus information
- Politely decline off-topic questions

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `VITE_OPENAI_MODEL` | No | GPT model to use (default: gpt-3.5-turbo) |

## Troubleshooting

**Bot not responding?**
- Verify your API key is correct in `.env.local`
- Check your OpenAI account has available credits
- Ensure the model specified is available in your account

**Build fails?**
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

**Styles not loading?**
- Rebuild with `npm run build`
- Clear browser cache (Ctrl+Shift+Delete)

## License

MIT

## Support

For issues or questions, please open an issue in the repository or contact the development team.
