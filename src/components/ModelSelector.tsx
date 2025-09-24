import React, { useEffect, useState } from 'react';
import { Cpu, Zap, AlertCircle, Check, Loader2 } from 'lucide-react';
import { MODELS } from '../lib/model-config';
import type { ModelConfig } from '../lib/model-config';
import { detectHardware } from '../lib/hardware-detect';
import type { HardwareInfo } from '../lib/hardware-detect';
import { useChatStore } from '../store/chat-store';

interface ModelSelectorProps {
  onModelSelect: (model: ModelConfig) => void;
  isLoading: boolean;
  loadingProgress: number;
  loadingStatus: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  onModelSelect,
  isLoading,
  loadingProgress,
  loadingStatus
}) => {
  const [hardware, setHardware] = useState<HardwareInfo | null>(null);
  const [detecting, setDetecting] = useState(true);
  const selectedModel = useChatStore(state => state.selectedModel);

  useEffect(() => {
    detectHardware().then(hw => {
      setHardware(hw);
      setDetecting(false);
    });
  }, []);

  const getModelStatus = (modelKey: 'tiny' | 'medium' | 'large' | 'xl' | 'uncensored') => {
    if (!hardware) return 'checking';

    const model = MODELS[modelKey];

    if (hardware.memory < model.requirements.ram) {
      return 'insufficient';
    }

    if (model.requirements.gpu === 'required' && !hardware.hasWebGPU) {
      return 'insufficient';
    }

    if (modelKey === hardware.recommendedModel) {
      return 'recommended';
    }

    return 'compatible';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended':
        return 'border-green-500 bg-green-500/10';
      case 'compatible':
        return 'border-gray-500 bg-gray-500/10';
      case 'insufficient':
        return 'border-red-500 bg-red-500/10 opacity-50 cursor-not-allowed';
      default:
        return 'border-gray-600 bg-gray-600/10';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recommended':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-400">
            Recommended
          </span>
        );
      case 'insufficient':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500/20 text-red-400">
            Insufficient Hardware
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Choose Your AI Model</h2>
        <p className="text-sm sm:text-base text-gray-400">Select a model based on your device capabilities</p>
      </div>

      {/* Hardware Info */}
      {hardware && (
        <div className="glass rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-300">
              Your Device: {hardware.memory}GB RAM • {hardware.cores} Cores •{' '}
              {hardware.hasWebGPU ? 'WebGPU Enabled' : 'CPU Only'}
            </span>
          </div>
          {detecting && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        </div>
      )}

      {/* Model Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {(Object.keys(MODELS) as Array<'tiny' | 'medium' | 'large' | 'xl' | 'uncensored'>).map(modelKey => {
          const model = MODELS[modelKey];
          const status = getModelStatus(modelKey);
          const isSelected = selectedModel?.id === model.id;
          const isDisabled = status === 'insufficient' || isLoading;

          return (
            <button
              key={modelKey}
              onClick={() => !isDisabled && onModelSelect(model)}
              disabled={isDisabled}
              className={`
                glass rounded-xl p-4 sm:p-6 text-left transition-all transform hover:scale-105
                ${getStatusColor(status)}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                ${isDisabled ? '' : 'hover:bg-white/10'}
                w-full
              `}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{model.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">{model.size}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 ml-2" />}
              </div>

              {getStatusBadge(status)}

              <p className="text-gray-300 mt-3 sm:mt-4 text-xs sm:text-sm">{model.description}</p>

              <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Zap className="h-3 w-3 flex-shrink-0" />
                  <span>Min {model.requirements.ram}GB RAM</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Cpu className="h-3 w-3 flex-shrink-0" />
                  <span>GPU {model.requirements.gpu}</span>
                </div>
              </div>

              {isSelected && isLoading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="truncate pr-2">{loadingStatus}</span>
                    <span className="font-mono flex-shrink-0">{Math.round(loadingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                    <div className="relative h-full">
                      <div
                        className="gradient-primary h-full transition-all duration-500 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                      />
                      {loadingProgress > 0 && loadingProgress < 100 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {loadingProgress < 30 && 'Downloading model...'}
                    {loadingProgress >= 30 && loadingProgress < 70 && 'Loading into memory...'}
                    {loadingProgress >= 70 && loadingProgress < 100 && 'Initializing...'}
                    {loadingProgress >= 100 && 'Ready!'}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Warning for low-end devices */}
      {hardware && hardware.memory < 4 && (
        <div className="mt-6 glass rounded-xl p-4 border-yellow-500/50 bg-yellow-500/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold mb-1">Limited Device Resources Detected</p>
              <p>
                Your device has limited memory. We recommend using the smallest model for the best
                experience. Larger models may cause performance issues or fail to load.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};