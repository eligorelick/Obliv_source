# OBLIVAI - Private AI Chat in Browser

True AI privacy with no servers, no tracking, and no compromise. Chat with AI models running entirely in your browser.

## Features

- **100% Private**: Everything runs locally in your browser
- **No Data Collection**: Conversations never leave your device
- **No Account Needed**: Just open and chat
- **Works Offline**: After initial model download
- **Open Source**: Verify privacy claims yourself
- **Multiple Models**: Choose from various model sizes based on your device

## Security

- Comprehensive Content Security Policy (CSP)
- Input sanitization with DOMPurify
- Runtime security monitoring
- No external dependencies for privacy
- All processing happens client-side

## Available Models

- Hermes 3 Llama 3.2 (1B/3B)
- Phi 3.5 Mini (3.8B)
- Gemma 2 (2B/9B)
- Llama 3.2 (1B/3B)
- DeepSeek R1 Distill (7B/8B)

## Tech Stack

- React + TypeScript
- WebLLM for browser-based AI
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Requirements

- Modern browser with WebGPU support
- 8GB+ RAM recommended
- GPU recommended for larger models

## License

MIT