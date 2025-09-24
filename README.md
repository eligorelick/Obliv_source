# OBLIVAI - True AI Privacy

OBLIVAI is a completely private AI chat interface that runs entirely in your browser. No servers, no tracking, no compromise on privacy.

## Features

- 🔒 **100% Private**: Everything runs locally in your browser
- 🚫 **No Data Collection**: We can't see your chats even if we wanted to
- 💻 **No Account Needed**: Just open and chat
- 🌐 **Works Offline**: After initial model download
- 🛡️ **Open Source**: Verify our privacy claims yourself
- ⚡ **Three Model Sizes**: From lightweight to powerful

## Technology Stack

- **Frontend**: React with TypeScript
- **UI**: Tailwind CSS with custom glassmorphism effects
- **LLM Runtime**: WebLLM for client-side model execution
- **State Management**: Zustand with local persistence
- **Security**: DOMPurify for XSS prevention, comprehensive CSP headers
- **Deployment**: Netlify (static hosting)

## Available Models

1. **Llama 3.2 1B** - Fastest, works on all devices (550MB)
2. **Llama 3.2 3B** - Balanced performance and quality (1.7GB)
3. **Llama 3.1 8B** - Best quality, needs powerful device (4.5GB)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The project is configured for deployment on Netlify:

1. Push to your GitHub repository
2. Connect repository to Netlify
3. Deploy with default settings (configuration in `netlify.toml`)

## Privacy Architecture

- All AI processing happens in-browser using WebLLM
- No external API calls for chat functionality
- Chat history stored only in browser's localStorage
- Optional auto-delete feature for session privacy
- No analytics, tracking, or telemetry

## Browser Requirements

- Modern browser with WebAssembly support
- WebGPU support recommended for best performance
- Minimum 4GB RAM for small models, 8GB+ for larger models

## Security Features

- Content Security Policy (CSP) headers
- Input sanitization to prevent XSS attacks
- Prompt injection protection
- Rate limiting on client-side
- No eval() or innerHTML usage

## Contributing

Contributions are welcome! Please ensure any changes maintain the privacy-first architecture.

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issues page.

---

**Remember**: With OBLIVAI, your conversations never leave your device. True privacy through local execution.