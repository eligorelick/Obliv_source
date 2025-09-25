export interface HardwareInfo {
  memory: number; // System RAM in GB
  cores: number; // CPU cores
  hasWebGPU: boolean;
  gpuInfo?: {
    name: string;
    vram?: number; // VRAM in GB
    isHighPerformance: boolean;
  };
  cpuInfo?: {
    name?: string;
    architecture?: string;
  };
  recommendedModel: 'tiny' | 'medium' | 'large' | 'xl' | 'uncensored';
  deviceType: 'mobile' | 'desktop' | 'unknown';
}

// Helper function to get more accurate system memory
function getSystemMemory(): number {
  // Try to get device memory from navigator
  let detectedMemory = 4; // Default fallback

  if ('deviceMemory' in navigator) {
    detectedMemory = (navigator as any).deviceMemory || 4;
  }

  // Enhanced heuristics based on other system indicators
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const isDesktop = !isMobile;

  // If we have high core count, likely more RAM than reported
  if (isDesktop && cores >= 8) {
    // Modern desktop with 8+ cores likely has 16-32GB+ RAM
    detectedMemory = Math.max(detectedMemory, 16);

    // High-end desktop indicators
    if (cores >= 12) {
      detectedMemory = Math.max(detectedMemory, 32);
    }
  } else if (isDesktop && cores >= 6) {
    // Mid-range desktop with 6+ cores likely has 8-16GB RAM
    detectedMemory = Math.max(detectedMemory, 12);
  }

  // Check for high-performance indicators
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('windows nt') && cores >= 8) {
    // Windows desktop with many cores
    detectedMemory = Math.max(detectedMemory, 16);
  }

  return detectedMemory;
}

// Helper function to detect device type
function detectDeviceType(): 'mobile' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

export async function detectHardware(): Promise<HardwareInfo> {
  const memory = getSystemMemory();
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceType = detectDeviceType();

  // Hardware detection completed successfully
  
  // Default values
  const result: HardwareInfo = {
    memory,
    cores: hardwareConcurrency,
    hasWebGPU: false,
    recommendedModel: 'medium',
    deviceType
  };

  // Try to detect WebGPU and GPU information
  try {
    if ('gpu' in navigator) {
      const gpu = (navigator as any).gpu;
      if (gpu) {
        try {
          const adapter = await gpu.requestAdapter();
          if (adapter) {
            result.hasWebGPU = true;
            
            // Get GPU info
            const adapterInfo = await adapter.requestAdapterInfo?.();
            let gpuName = adapterInfo?.description || 'Unknown GPU';
            let vramEstimate = 4; // Default VRAM estimate
            let isHighPerformance = false;

            // Enhanced GPU detection using renderer info
            try {
              const canvas = document.createElement('canvas');
              const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
              if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                  if (renderer && typeof renderer === 'string') {
                    gpuName = renderer;

                    // Better GPU detection based on actual names
                    const gpuLower = renderer.toLowerCase();

                    // NVIDIA RTX detection
                    if (gpuLower.includes('rtx') || gpuLower.includes('geforce rtx')) {
                      isHighPerformance = true;
                      if (gpuLower.includes('3090')) {
                        vramEstimate = 24; // RTX 3090 has 24GB
                      } else if (gpuLower.includes('3080')) {
                        vramEstimate = 10; // RTX 3080 has 10GB
                      } else if (gpuLower.includes('3070')) {
                        vramEstimate = 8;
                      } else if (gpuLower.includes('3060')) {
                        vramEstimate = 12;
                      } else if (gpuLower.includes('4080') || gpuLower.includes('4090')) {
                        vramEstimate = 16;
                      } else if (gpuLower.includes('4070')) {
                        vramEstimate = 12;
                      } else {
                        vramEstimate = 8; // Other RTX cards
                      }
                    }
                    // NVIDIA GTX detection
                    else if (gpuLower.includes('gtx') || gpuLower.includes('geforce gtx')) {
                      isHighPerformance = true;
                      if (gpuLower.includes('1080') || gpuLower.includes('1070')) {
                        vramEstimate = 8;
                      } else if (gpuLower.includes('1060')) {
                        vramEstimate = 6;
                      } else {
                        vramEstimate = 4;
                      }
                    }
                    // AMD detection
                    else if (gpuLower.includes('radeon') || gpuLower.includes('amd')) {
                      isHighPerformance = true;
                      if (gpuLower.includes('rx 6800') || gpuLower.includes('rx 6900')) {
                        vramEstimate = 16;
                      } else if (gpuLower.includes('rx 6700') || gpuLower.includes('rx 7700')) {
                        vramEstimate = 12;
                      } else {
                        vramEstimate = 8;
                      }
                    }
                    // Intel Arc detection
                    else if (gpuLower.includes('arc') || gpuLower.includes('intel')) {
                      if (gpuLower.includes('a770')) {
                        isHighPerformance = true;
                        vramEstimate = 16;
                      } else if (gpuLower.includes('a750')) {
                        isHighPerformance = true;
                        vramEstimate = 8;
                      }
                    }
                  }
                }
              }
            } catch (e) {
              // Error getting detailed GPU info
            }

            // Fallback to adapter limits if we couldn't get specific GPU info
            if (adapter.limits && !isHighPerformance) {
              const maxTextureSize = adapter.limits.maxTextureDimension2D;
              const maxBufferSize = adapter.limits.maxBufferSize;

              // High-end GPU indicators
              if (maxTextureSize >= 16384 && maxBufferSize >= 2**30) {
                isHighPerformance = true;
                vramEstimate = Math.max(vramEstimate, 8);
              }
            }

            result.gpuInfo = {
              name: gpuName,
              vram: vramEstimate,
              isHighPerformance: isHighPerformance
            };
          }
        } catch (e) {
          // Error getting GPU info
        }
      }
    }
  } catch (e) {
    // Error initializing WebGPU
    result.hasWebGPU = false;
  }

  // Try to get CPU info (limited in browser)
  try {
    const cpuInfo = {
      name: (navigator as any).userAgentData?.platform || navigator.platform,
      architecture: (navigator as any).userAgentData?.platform || ''
    };
    result.cpuInfo = cpuInfo;
  } catch (e) {
    // Error getting CPU info
  }

  // Recommend model based on capabilities
  if (!result.hasWebGPU) {
    result.recommendedModel = 'tiny';
  } else if (result.gpuInfo?.isHighPerformance && memory >= 32 && hardwareConcurrency >= 8) {
    // Enthusiast-level system: RTX 3080+, 32GB+ RAM, 8+ cores
    result.recommendedModel = 'xl';
  } else if (result.gpuInfo?.isHighPerformance && memory >= 16) {
    // High-end desktop with dedicated GPU and lots of RAM
    result.recommendedModel = 'large';
  } else if (result.gpuInfo?.isHighPerformance || memory >= 12) {
    // Mid-range desktop or laptop with decent specs
    result.recommendedModel = 'medium';
  } else if (memory >= 6) {
    // Lower-end devices but still capable
    result.recommendedModel = 'medium';
  } else {
    // Very low-end devices
    result.recommendedModel = 'tiny';
  }

  return result;
}