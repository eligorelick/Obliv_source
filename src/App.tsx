import { useState, useRef, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { ModelSelector } from './components/ModelSelector';
import { ChatInterface } from './components/ChatInterface';
import { WebLLMService } from './lib/webllm-service';
import { useChatStore } from './store/chat-store';
import type { ModelConfig } from './lib/model-config';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'model-select' | 'chat'>('landing');
  const webllmService = useRef(new WebLLMService());

  const {
    setSelectedModel,
    setModelLoadingProgress,
    isDarkMode,
    modelLoadingProgress,
    modelLoadingStatus
  } = useChatStore();

  useEffect(() => {
    // Initialize security measures with balanced settings
    // Temporarily commenting out to debug UI issues
    // SecurityManager.getInstance();

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
      // Set up progress callback that handles both number and InitProgressReport
      const progressCallback = (progress: number, status: string) => {
        setModelLoadingProgress(progress, status);
      };

      await webllmService.current.initializeModel(
        model,
        progressCallback
      );

      // Once model is loaded, switch to chat view
      setCurrentView('chat');
      setModelLoadingProgress(100, 'Model loaded successfully');
    } catch (error) {
      // Failed to load model
      setModelLoadingProgress(0, `Failed to load model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    const currentService = webllmService.current;
    return () => {
      currentService.dispose();
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
            loadingProgress={modelLoadingProgress}
            loadingStatus={modelLoadingStatus}
            // Provide back navigation
            onBack={() => setCurrentView('landing')}
          />
        </div>
      )}

      {currentView === 'chat' && (
        <ChatInterface webllmService={webllmService.current} onBack={() => setCurrentView('model-select')} />
      )}
    </div>
  );
}

export default App;