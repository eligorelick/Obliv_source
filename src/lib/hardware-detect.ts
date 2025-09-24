export interface HardwareInfo {
  memory: number;
  cores: number;
  hasWebGPU: boolean;
  recommendedModel: 'tiny' | 'medium' | 'large';
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
  let recommendedModel: 'tiny' | 'medium' | 'large';

  if (!hasWebGPU || memory < 4) {
    recommendedModel = 'tiny';
  } else if (memory < 8 || hardwareConcurrency < 8) {
    recommendedModel = 'medium';
  } else {
    recommendedModel = 'large';
  }

  return {
    memory,
    cores: hardwareConcurrency,
    hasWebGPU,
    recommendedModel
  };
}