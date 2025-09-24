import { useState, useRef, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { ModelSelector } from './components/ModelSelector';
import { ChatInterface } from './components/ChatInterface';
import { WebLLMService } from './lib/webllm-service';
import { useChatStore } from './store/chat-store';
import type { ModelConfig } from './lib/model-config';
import * as webllm from '@mlc-ai/web-llm';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'model-select' | 'chat'>('landing');
  const webllmService = useRef(new WebLLMService());

  const {
    setSelectedModel,
    setModelLoadingProgress,
    isDarkMode
  } = useChatStore();

  useEffect(() => {
    // Set initial dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode]);

  const handleStartChat = () => {
    setCurrentView('model-select');
  };

  const handleModelSelect = async (model: ModelConfig) => {
    setSelectedModel(model);
    setModelLoadingProgress(0, 'Initializing model...');

    try {
      await webllmService.current.initializeModel(
        model,
        (report: webllm.InitProgressReport) => {
          const progress = report.progress * 100;
          setModelLoadingProgress(progress, report.text);
        }
      );

      // Once model is loaded, switch to chat view
      setCurrentView('chat');
      setModelLoadingProgress(100, 'Model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
      setModelLoadingProgress(0, `Failed to load model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    const currentService = webllmService.current;
    return () => {
      currentService.cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      {currentView === 'landing' && (
        <LandingPage onStartChat={handleStartChat} />
      )}

      {currentView === 'model-select' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <ModelSelector
            onModelSelect={handleModelSelect}
            isLoading={webllmService.current.getLoadingStatus()}
            loadingProgress={useChatStore.getState().modelLoadingProgress}
            loadingStatus={useChatStore.getState().modelLoadingStatus}
          />
        </div>
      )}

      {currentView === 'chat' && (
        <ChatInterface webllmService={webllmService.current} />
      )}
    </div>
  );
}

export default App;