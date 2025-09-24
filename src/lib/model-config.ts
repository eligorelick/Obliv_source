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

export const MODELS: Record<'tiny' | 'medium' | 'large', ModelConfig> = {
  tiny: {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 1B',
    size: '550MB',
    requirements: { ram: 2, gpu: 'optional' },
    description: 'Fastest, works on all devices'
  },
  medium: {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 3B',
    size: '1.7GB',
    requirements: { ram: 4, gpu: 'recommended' },
    description: 'Balanced performance and quality'
  },
  large: {
    id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.1 8B',
    size: '4.5GB',
    requirements: { ram: 8, gpu: 'required' },
    description: 'Best quality, needs powerful device'
  }
};