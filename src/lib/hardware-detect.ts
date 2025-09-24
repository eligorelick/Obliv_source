export interface HardwareInfo {
  memory: number;
  cores: number;
  hasWebGPU: boolean;
  recommendedModel: 'tiny' | 'medium' | 'large' | 'xl' | 'uncensored';
}

export async function detectHardware(): Promise<HardwareInfo> {
  const memory = (navigator as any).deviceMemory || 4; // GB
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  // Check for WebGPU support
  let hasWebGPU = false;
  try {
    hasWebGPU = 'gpu' in navigator && !!(navigator as any).gpu;
    if (hasWebGPU) {
      const adapter = await (navigator as any).gpu.requestAdapter();
      hasWebGPU = !!adapter;
    }
  } catch {
    hasWebGPU = false;
  }

  // Recommend model based on capabilities
  let recommendedModel: 'tiny' | 'medium' | 'large' | 'xl' | 'uncensored';

  if (!hasWebGPU || memory < 2) {
    recommendedModel = 'tiny';
  } else if (memory < 4 || hardwareConcurrency < 4) {
    recommendedModel = 'medium';
  } else if (memory < 8 || hardwareConcurrency < 8) {
    recommendedModel = 'large';
  } else {
    recommendedModel = 'xl';
  }

  return {
    memory,
    cores: hardwareConcurrency,
    hasWebGPU,
    recommendedModel
  };
}