export interface ModelConfig {
  id: string;
  name: string;
  size: string;
  requirements: {
    ram: number;
    gpu: 'optional' | 'recommended' | 'required';
  };
  description: string;
}

export const MODELS: Record<'tiny' | 'medium' | 'large' | 'xl' | 'uncensored' | 'hermes_7b' | 'hermes_8b' | 'deepseek_7b' | 'deepseek_8b', ModelConfig> = {
  tiny: {
    id: 'Qwen2-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen2 0.5B (Tiny)',
    size: '945MB',
    requirements: { ram: 2, gpu: 'optional' },
    description: 'Ultra-fast, works on all devices'
  },
  medium: {
    id: 'Qwen2-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen2 1.5B (Medium)',
    size: '1.63GB',
    requirements: { ram: 4, gpu: 'recommended' },
    description: 'Best balance of quality and performance'
  },
  large: {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 3B (Large)',
    size: '2.26GB',
    requirements: { ram: 8, gpu: 'recommended' },
    description: 'High quality, good for complex tasks'
  },
  xl: {
    id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.1 8B (XL)',
    size: '4.60GB',
    requirements: { ram: 16, gpu: 'required' },
    description: 'Most capable model, needs powerful hardware'
  },
  uncensored: {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 1B (Uncensored)',
    size: '879MB',
    requirements: { ram: 4, gpu: 'recommended' },
    description: 'More flexible responses, fewer content restrictions'
  },
  hermes_7b: {
    id: 'Hermes-2-Pro-Mistral-7B-q4f16_1-MLC',
    name: 'Hermes 2 Pro 7B (Uncensored)',
    size: '4.03GB',
    requirements: { ram: 12, gpu: 'required' },
    description: 'Advanced uncensored model, similar capabilities to Wizard-Vicuna'
  },
  hermes_8b: {
    id: 'Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC',
    name: 'Hermes 2 Pro Llama 8B (Uncensored)',
    size: '4.98GB',
    requirements: { ram: 16, gpu: 'required' },
    description: 'Powerful uncensored model based on Llama 3, excellent alternative to Wizard-Vicuna-30B'
  },
  deepseek_7b: {
    id: 'DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC',
    name: 'DeepSeek-R1 7B (Advanced Reasoning)',
    size: '5.11GB',
    requirements: { ram: 12, gpu: 'required' },
    description: 'Advanced reasoning model with strong analytical capabilities'
  },
  deepseek_8b: {
    id: 'DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC',
    name: 'DeepSeek-R1 8B (Advanced Reasoning)',
    size: '5.00GB',
    requirements: { ram: 16, gpu: 'required' },
    description: 'Most advanced reasoning model with exceptional problem-solving abilities'
  }
};