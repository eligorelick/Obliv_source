import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, AlertCircle } from 'lucide-react';
import { RateLimiter } from '../lib/security';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  isGenerating,
  onStopGeneration,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const [rateLimitWarning, setRateLimitWarning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rateLimiter = useRef(new RateLimiter(10, 60000));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || disabled || isGenerating) return;

    if (!rateLimiter.current.canProceed()) {
      setRateLimitWarning(true);
      setTimeout(() => setRateLimitWarning(false), 3000);
      return;
    }

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-white/10 p-4">
      {rateLimitWarning && (
        <div className="mb-3 glass rounded-lg p-3 border-yellow-500/50 bg-yellow-500/10">
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <span>Please slow down. Too many messages sent.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? 'Please select a model first...'
                : 'Type your message... (Shift+Enter for new line)'
            }
            disabled={disabled || isGenerating}
            className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-primary resize-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
            maxLength={4000}
          />

          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {input.length}/4000
          </div>
        </div>

        {isGenerating ? (
          <button
            type="button"
            onClick={onStopGeneration}
            className="glass px-6 py-3 rounded-xl text-white hover:bg-red-500/20
                     transition-colors flex items-center gap-2"
            aria-label="Stop generation"
          >
            <Square className="h-5 w-5" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="gradient-primary px-6 py-3 rounded-xl text-white
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:opacity-90 transition-opacity flex items-center gap-2"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        )}
      </form>

      <div className="mt-2 text-xs text-gray-500 text-center">
        All messages are processed locally • No data leaves your device
      </div>
    </div>
  );
};