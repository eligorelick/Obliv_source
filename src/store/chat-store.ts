import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '../lib/webllm-service';
import type { ModelConfig } from '../lib/model-config';

export interface ChatState {
  messages: ChatMessage[];
  selectedModel: ModelConfig | null;
  isGenerating: boolean;
  modelLoadingProgress: number;
  modelLoadingStatus: string;
  isDarkMode: boolean;
  autoDeleteChats: boolean;

  // Actions
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setSelectedModel: (model: ModelConfig) => void;
  setGenerating: (isGenerating: boolean) => void;
  setModelLoadingProgress: (progress: number, status: string) => void;
  toggleDarkMode: () => void;
  setAutoDeleteChats: (autoDelete: boolean) => void;
  exportChat: () => string;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      selectedModel: null,
      isGenerating: false,
      modelLoadingProgress: 0,
      modelLoadingStatus: '',
      isDarkMode: true,
      autoDeleteChats: false,

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, { ...message, timestamp: new Date() }]
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      setSelectedModel: (model) => {
        set({ selectedModel: model });
      },

      setGenerating: (isGenerating) => {
        set({ isGenerating });
      },

      setModelLoadingProgress: (progress, status) => {
        set({ modelLoadingProgress: progress, modelLoadingStatus: status });
      },

      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newMode };
        });
      },

      setAutoDeleteChats: (autoDelete) => {
        set({ autoDeleteChats: autoDelete });
      },

      exportChat: () => {
        const state = get();
        const markdown = state.messages
          .map(msg => `**${msg.role === 'user' ? 'You' : 'AI'}**: ${msg.content}`)
          .join('\n\n');

        const header = `# OBLIVAI Chat Export\n\nExported: ${new Date().toISOString()}\nModel: ${state.selectedModel?.name || 'Unknown'}\n\n---\n\n`;

        return header + markdown;
      }
    }),
    {
      name: 'oblivai-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        autoDeleteChats: state.autoDeleteChats,
        messages: state.autoDeleteChats ? [] : state.messages
      })
    }
  )
);