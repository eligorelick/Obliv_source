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
  private abortController: AbortController | null = null;

  async initializeModel(
    modelConfig: ModelConfig,
    _onProgress?: (report: webllm.InitProgressReport) => void
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

    try {
      this.engine = new webllm.MLCEngine();

      // Use the model ID directly - WebLLM will handle downloading from the registry
      await this.engine.reload(modelConfig.id);

      this.currentModel = modelConfig.id;
    } catch (error) {
      await this.cleanup();
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async generateResponse(
    messages: ChatMessage[],
    onToken?: (token: string) => void,
    maxTokens = 2048
  ): Promise<string> {
    if (!this.engine) {
      throw new Error('Model not initialized');
    }

    // Sanitize user inputs
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: msg.role === 'user' ? sanitizeInput(msg.content) : msg.content
    }));

    // Convert to WebLLM format
    const chatMessages: webllm.ChatCompletionMessageParam[] = sanitizedMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    this.abortController = new AbortController();

    try {
      const completion = await this.engine.chat.completions.create({
        messages: chatMessages,
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
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  async getTokenCount(text: string): Promise<number> {
    // Rough estimation - WebLLM doesn't expose tokenizer directly
    // Average is ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  async cleanup(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort();
    }

    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
    }

    this.currentModel = null;
    this.isLoading = false;
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
    }
  }

  getLoadingStatus(): boolean {
    return this.isLoading;
  }
}