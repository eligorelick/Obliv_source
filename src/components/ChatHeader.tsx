import React from 'react';
import {
  Brain,
  Trash2,
  Download,
  Moon,
  Sun,
  Shield,
  Settings,
  X
} from 'lucide-react';
import { useChatStore } from '../store/chat-store';

export const ChatHeader: React.FC = () => {
  const {
    messages,
    selectedModel,
    isDarkMode,
    autoDeleteChats,
    clearMessages,
    toggleDarkMode,
    setAutoDeleteChats,
    exportChat
  } = useChatStore();

  const [showSettings, setShowSettings] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  const handleExport = () => {
    const markdown = exportChat();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oblivai-chat-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    clearMessages();
    setShowClearConfirm(false);
  };

  return (
    <>
      <header className="glass border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-white">OBLIVAI</h1>
                <p className="text-xs text-gray-400">
                  {selectedModel ? selectedModel.name : 'No model selected'} •{' '}
                  {messages.length} messages • 100% Private
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="glass p-2 rounded-lg glass-hover"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-300" />
                )}
              </button>

              {messages.length > 0 && (
                <>
                  <button
                    onClick={handleExport}
                    className="glass p-2 rounded-lg glass-hover"
                    aria-label="Export chat"
                  >
                    <Download className="h-5 w-5 text-gray-300" />
                  </button>

                  <button
                    onClick={handleClear}
                    className="glass p-2 rounded-lg glass-hover"
                    aria-label="Clear chat"
                  >
                    <Trash2 className="h-5 w-5 text-gray-300" />
                  </button>
                </>
              )}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="glass p-2 rounded-lg glass-hover"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Privacy Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="glass p-2 rounded-lg glass-hover"
              >
                <X className="h-4 w-4 text-gray-300" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-white font-medium">Auto-delete chats</p>
                    <p className="text-xs text-gray-400">Clear chat history on session end</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDeleteChats}
                    onChange={(e) => setAutoDeleteChats(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="glass rounded-lg p-4 border-green-500/30 bg-green-500/10">
                <p className="text-sm text-green-400">
                  ✓ All data stays in your browser
                </p>
                <p className="text-sm text-green-400 mt-1">
                  ✓ No server connections
                </p>
                <p className="text-sm text-green-400 mt-1">
                  ✓ No tracking or analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Clear all messages?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will permanently delete all messages in the current chat. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 glass px-4 py-2 rounded-lg glass-hover text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};