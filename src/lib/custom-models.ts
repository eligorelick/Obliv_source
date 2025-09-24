import type { ModelConfig } from './model-config';

/**
 * Guide for Adding Custom Models to OBLIVAI
 *
 * WebLLM requires models in MLC format. Here's how to add them:
 *
 * 1. Find MLC-compatible models at:
 *    - https://huggingface.co/mlc-ai (official MLC models)
 *    - Search for models ending in "-MLC" on HuggingFace
 *
 * 2. Check WebLLM registry:
 *    - Visit: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
 *    - Look for prebuilt_app_config to see available models
 *
 * 3. Model ID format: "ModelName-Size-Instruct-q4f16_1-MLC"
 *    Examples:
 *    - "Llama-3.2-1B-Instruct-q4f16_1-MLC"
 *    - "Mistral-7B-Instruct-v0.3-q4f16_1-MLC"
 *    - "Qwen2.5-0.5B-Instruct-q4f16_1-MLC"
 */

// Example custom models that work with WebLLM
export const CUSTOM_MODELS: Record<string, ModelConfig> = {
  // Uncensored/Creative models (if available in MLC format)
  wizard_uncensored: {
    id: 'WizardLM-2-7B-q4f16_1-MLC', // This is hypothetical - need actual MLC version
    name: 'WizardLM 7B',
    size: '4.2GB',
    requirements: { ram: 8, gpu: 'required' },
    description: 'Creative and uncensored responses'
  },

  // Coding models
  codellama: {
    id: 'CodeLlama-7b-Instruct-hf-q4f16_1-MLC',
    name: 'CodeLlama 7B',
    size: '4.0GB',
    requirements: { ram: 8, gpu: 'required' },
    description: 'Specialized for code generation'
  },

  // Larger models for powerful hardware
  llama_13b: {
    id: 'Llama-2-13b-chat-hf-q4f16_1-MLC', // Check if available
    name: 'Llama 2 13B Chat',
    size: '7.5GB',
    requirements: { ram: 16, gpu: 'required' },
    description: 'Large model for complex tasks'
  },

  // Latest models (check availability)
  qwen_7b: {
    id: 'Qwen2.5-7B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 7B',
    size: '4.3GB',
    requirements: { ram: 8, gpu: 'required' },
    description: 'Latest multilingual model'
  }
};

/**
 * Steps to convert your own GPTQ model to MLC format:
 *
 * 1. Install MLC-LLM Python package:
 *    pip install mlc-llm
 *
 * 2. Convert the model:
 *    python -m mlc_llm.build --model path/to/your/model --target webgpu
 *
 * 3. Host the files with CORS headers on your server or CDN
 *
 * 4. Add custom model configuration:
 */

// Template for adding your converted model
export const createCustomModel = (
  id: string,
  name: string,
  size: string,
  ramRequirement: number,
  description: string
): ModelConfig => ({
  id,
  name,
  size,
  requirements: {
    ram: ramRequirement,
    gpu: ramRequirement >= 4 ? 'required' : 'recommended'
  },
  description
});

/**
 * How to add models to your OBLIVAI instance:
 *
 * 1. Add model to MODELS object in model-config.ts
 * 2. Update type definitions in hardware-detect.ts
 * 3. Update ModelSelector component grid layout if needed
 * 4. Test model loading and chat functionality
 */

// Quick way to test if a model ID works:
export const testModelId = async (modelId: string): Promise<boolean> => {
  try {
    // This would be called in the WebLLM service to test availability
    console.log(`Testing model: ${modelId}`);
    return true; // Implement actual test logic
  } catch {
    return false;
  }
};