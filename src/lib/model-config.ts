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

export const MODELS: Record<'tiny' | 'medium' | 'large' | 'xl' | 'uncensored', ModelConfig> = {
  tiny: {
    id: 'SmolLM-135M-Instruct-q4f16_1-MLC',
    name: 'SmolLM 135M',
    size: '90MB',
    requirements: { ram: 1, gpu: 'optional' },
    description: 'Ultra-fast, works on all devices'
  },
  medium: {
    id: 'Qwen2-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen2 0.5B',
    size: '350MB',
    requirements: { ram: 2, gpu: 'recommended' },
    description: 'Fast and efficient for most tasks'
  },
  large: {
    id: 'Qwen2-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen2 1.5B',
    size: '950MB',
    requirements: { ram: 4, gpu: 'recommended' },
    description: 'Best balance of quality and performance'
  },
  xl: {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 3B',
    size: '1.7GB',
    requirements: { ram: 8, gpu: 'required' },
    description: 'High quality, needs powerful device'
  },
  uncensored: {
    id: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    name: 'Mistral 7B Uncensored',
    size: '4.1GB',
    requirements: { ram: 8, gpu: 'required' },
    description: 'Less restricted responses, powerful device needed'
  }
};