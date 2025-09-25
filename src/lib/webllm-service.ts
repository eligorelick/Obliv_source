import * as webllm from '@mlc-ai/web-llm';
import type { ModelConfig } from './model-config';
import { sanitizeInput } from './security';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface GenerationProgress {
  progress: number;
  text: string;
  timeElapsed: number;
}

export class WebLLMService {
  private engine: webllm.MLCEngine | null = null;
  private currentModel: string | null = null;
  private isLoading = false;
  private loadingProgress = 0;
  private loadingStatus = '';
  private abortController: AbortController | null = null;

  private async cleanup(): Promise<void> {
    if (this.engine) {
      try {
        await this.engine.unload();
      } catch (e) {
        // Silently handle unload errors
      }
      this.engine = null;
    }
    this.currentModel = null;
    this.loadingProgress = 0;
    this.loadingStatus = '';
  }

  async initializeModel(
    modelConfig: ModelConfig,
    onProgress?: (progress: number, status: string) => void
  ): Promise<void> {
    if (this.isLoading) {
      throw new Error('Model is already loading');
    }

    // Clean up existing engine if switching models
    if (this.engine && this.currentModel !== modelConfig.id) {
      await this.cleanup();
    }

    // If same model is already loaded, return
    if (this.engine && this.currentModel === modelConfig.id) {
      return;
    }

    this.isLoading = true;
    this.loadingProgress = 0;
    this.loadingStatus = 'Initializing model...';
    onProgress?.(this.loadingProgress, this.loadingStatus);

    try {
      // Create the engine with privacy-focused configuration
      this.loadingStatus = 'Creating ML engine...';
      onProgress?.(5, this.loadingStatus);

      // Initialize with real-time progress tracking
      this.engine = new webllm.MLCEngine({
        initProgressCallback: (report: any) => {
          // Update progress in real-time
          if (report.progress !== undefined && report.progress !== null) {
            // Convert progress (0-1) to percentage (0-100)
            const progressPercent = Math.round(report.progress * 100);
            this.loadingProgress = progressPercent;

            // Dynamic status messages based on progress
            if (progressPercent < 5) {
              this.loadingStatus = 'Initializing WebGPU...';
            } else if (progressPercent < 15) {
              this.loadingStatus = 'Checking model cache...';
            } else if (progressPercent < 25) {
              this.loadingStatus = 'Downloading model metadata...';
            } else if (progressPercent < 40) {
              this.loadingStatus = 'Downloading model weights...';
            } else if (progressPercent < 55) {
              this.loadingStatus = 'Loading model into memory...';
            } else if (progressPercent < 70) {
              this.loadingStatus = 'Compiling WebGPU shaders...';
            } else if (progressPercent < 85) {
              this.loadingStatus = 'Optimizing for your device...';
            } else if (progressPercent < 95) {
              this.loadingStatus = 'Finalizing model initialization...';
            } else {
              this.loadingStatus = 'Almost ready...';
            }

            // Include time elapsed if available
            if (report.timeElapsed) {
              const elapsed = Math.round(report.timeElapsed);
              this.loadingStatus += ` (${elapsed}s)`;
            }

            // Include descriptive text if provided
            if (report.text && report.text.length > 0) {
              // Use the actual text from WebLLM for more accuracy
              this.loadingStatus = report.text;
            }

            onProgress?.(this.loadingProgress, this.loadingStatus);
          }
        }
      });

      this.loadingStatus = 'Starting model download...';
      onProgress?.(10, this.loadingStatus);

      // Load the model with progress tracking
      await this.engine.reload(modelConfig.id);

      // Update progress to 100% when loading is complete
      this.loadingProgress = 100;
      this.loadingStatus = 'Model loaded successfully';
      onProgress?.(this.loadingProgress, this.loadingStatus);

      this.currentModel = modelConfig.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.loadingStatus = `Error loading model: ${errorMessage}`;
      onProgress?.(0, this.loadingStatus);
      // Model loading error handled
      throw new Error(`Failed to load model: ${errorMessage}`);
    } finally {
      this.isLoading = false;
    }
  }

  async generateResponse(
    messages: ChatMessage[],
    onToken?: (token: string) => void,
    maxTokens = 2048,
    systemInstruction?: string
  ): Promise<string> {
    if (!this.engine) {
      throw new Error('Model not initialized');
    }

    try {
      // Convert messages to the format expected by WebLLM
      const chatMessages: Array<{role: string, content: string}> = [];

      // Add system instruction if provided
      if (systemInstruction && systemInstruction.trim()) {
        chatMessages.push({
          role: 'system',
          content: systemInstruction.trim()
        });
      }

      // Add user and assistant messages
      for (const msg of messages) {
        chatMessages.push({
          role: msg.role,
          content: msg.role === 'user' ? sanitizeInput(msg.content) : msg.content
        });
      }

      // Set up abort controller for this generation
      this.abortController = new AbortController();

      // Use chat completions API for streaming
      const completion = await this.engine.chat.completions.create({
        messages: chatMessages as webllm.ChatCompletionMessageParam[],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.95,
        stream: true
      });

      let fullResponse = '';

      for await (const chunk of completion) {
        if (this.abortController.signal.aborted) {
          break;
        }

        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          fullResponse += delta;
          if (onToken) {
            onToken(delta);
          }
        }
      }

      return fullResponse;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Generation cancelled');
      }
      // Response generation error handled
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.abortController = null;
    }
  }

  async getTokenCount(text: string): Promise<number> {
    // Rough estimation - WebLLM doesn't expose tokenizer directly
    // Average is ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  isModelLoaded(): boolean {
    return this.engine !== null;
  }

  getCurrentModel(): string | null {
    return this.currentModel;
  }

  cancelGeneration(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  async dispose(): Promise<void> {
    await this.cleanup();
    this.cancelGeneration();
  }

  getLoadingStatus(): boolean {
    return this.isLoading;
  }

  getLoadingProgress(): { progress: number; status: string } {
    return {
      progress: this.loadingProgress,
      status: this.loadingStatus
    };
  }
}