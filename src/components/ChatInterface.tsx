import React from 'react';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { ChatHeader } from './ChatHeader';
import { sanitizeInput } from '../lib/security';
import { useChatStore } from '../store/chat-store';
import { WebLLMService } from '../lib/webllm-service';
import type { ChatMessage } from '../lib/webllm-service';

interface ChatInterfaceProps {
  webllmService: WebLLMService;
  onBack?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ webllmService, onBack }) => {
  const {
    messages,
    isGenerating,
    addMessage,
    setGenerating,
    selectedModel
  } = useChatStore();
  const systemInstruction = useChatStore(state => state.systemInstruction);

  const handleSendMessage = async (content: string) => {
    if (!selectedModel || !webllmService.isModelLoaded()) {
      return;
    }

    // Sanitize user input before sending to the model
    const cleaned = sanitizeInput(content).slice(0, 4000);

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: cleaned,
      timestamp: new Date()
    };
    addMessage(userMessage);
    setGenerating(true);

    try {
      // Prepare messages for the model
      const contextMessages = messages.slice(-10); // Keep last 10 messages for context
      const allMessages = [...contextMessages, userMessage];

      // Generate response
      let assistantContent = '';
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      // Add empty assistant message that will be updated
      addMessage(assistantMessage);

      await webllmService.generateResponse(
        allMessages,
        (token) => {
          assistantContent += token;
          // Update the last message in the store
          useChatStore.setState((state) => ({
            messages: [
              ...state.messages.slice(0, -1),
              { ...assistantMessage, content: assistantContent }
            ]
          }));
        },
        undefined,
        systemInstruction
      );
    } catch (error) {
      console.error('Error generating response:', error);

      // Add error message
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to generate response'}`,
        timestamp: new Date()
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleStopGeneration = () => {
    webllmService.cancelGeneration();
    setGenerating(false);
  };

  return (
    <div className="flex flex-col h-screen bg-dark">
      <ChatHeader onBack={onBack} />

      <div className="flex-1 overflow-hidden flex flex-col max-w-6xl mx-auto w-full px-2 sm:px-4">
        <MessageList messages={messages} />

        <InputArea
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          onStopGeneration={handleStopGeneration}
          disabled={!selectedModel || !webllmService.isModelLoaded()}
        />
      </div>
    </div>
  );
};