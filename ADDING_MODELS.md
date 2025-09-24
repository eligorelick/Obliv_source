# Adding Custom Models to OBLIVAI

## 🎯 **Your Goal: Add "TheBloke/Wizard-Vicuna-30B-Uncensored-GPTQ"**

Unfortunately, this exact model **cannot be used directly** because it's in GPTQ format. Here are your options:

## 🔄 **Option 1: Convert GPTQ to MLC (Advanced)**

### Step 1: Install MLC-LLM
```bash
pip install mlc-llm mlc-ai-nightly
```

### Step 2: Download and Convert Model
```bash
# Download the GPTQ model from HuggingFace
git lfs install
git clone https://huggingface.co/TheBloke/Wizard-Vicuna-30B-Uncensored-GPTQ

# Convert to MLC format (this requires significant computational resources)
python -m mlc_llm.build \
  --model ./Wizard-Vicuna-30B-Uncensored-GPTQ \
  --target webgpu \
  --quantization q4f16_1 \
  --max-seq-len 2048
```

### Step 3: Host the Model Files
You'll need to host the converted files on a server with CORS headers enabled.

### Step 4: Add to OBLIVAI
```typescript
// In src/lib/model-config.ts
wizard_30b: {
  id: 'your-hosted-wizard-vicuna-30b-q4f16_1-MLC',
  name: 'Wizard Vicuna 30B Uncensored',
  size: '18GB',
  requirements: { ram: 32, gpu: 'required' },
  description: 'Large uncensored model for creative tasks'
}
```

## ✅ **Option 2: Use Similar Pre-converted Models (Recommended)**

Instead of the exact model, use similar uncensored models that are already in MLC format:

### Available MLC Models Similar to Wizard-Vicuna:

1. **WizardLM Models** (if available in MLC)
2. **Vicuna Models** (check mlc-ai organization)
3. **Uncensored Mistral/Llama variants**

### Where to Find MLC Models:

1. **Official MLC-AI HuggingFace**: https://huggingface.co/mlc-ai
2. **WebLLM Registry**: Check the source code for available models
3. **Community Conversions**: Search for "-MLC" suffix models

## 🚀 **Option 3: Quick Setup with Available Models**

I've already added a "Mistral 7B Uncensored" option. To add more uncensored models:

### Edit `src/lib/model-config.ts`:

```typescript
export const MODELS = {
  // ... existing models ...

  // Add more uncensored variants
  llama_uncensored: {
    id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.1 8B Uncensored',
    size: '4.7GB',
    requirements: { ram: 12, gpu: 'required' },
    description: 'Powerful uncensored responses'
  },

  wizard_7b: {
    id: 'WizardLM-2-7B-q4f16_1-MLC', // If available
    name: 'WizardLM 7B',
    size: '4.2GB',
    requirements: { ram: 10, gpu: 'required' },
    description: 'Creative and instruction-following'
  }
};
```

## 🔍 **Finding Available Models**

### Check WebLLM Source:
1. Visit: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
2. Look at `prebuilt_app_config`
3. Copy model IDs from there

### Test Model Availability:
```typescript
// Add this to test if a model exists
const testModel = async (modelId: string) => {
  try {
    const engine = new webllm.MLCEngine();
    await engine.reload(modelId);
    console.log(`✅ ${modelId} works!`);
    await engine.unload();
  } catch (error) {
    console.log(`❌ ${modelId} failed:`, error);
  }
};

// Test in browser console:
// testModel('WizardLM-2-7B-q4f16_1-MLC');
```

## 📋 **Current Model Status**

✅ **Working Models in OBLIVAI:**
- SmolLM 135M (90MB)
- Qwen2 0.5B (350MB)
- Qwen2 1.5B (950MB)
- Llama 3.2 3B (1.7GB)
- Mistral 7B Uncensored (4.1GB)

❌ **Not Compatible:**
- Any GPTQ models (need conversion)
- Any GGML/GGUF models (need conversion)
- Standard HuggingFace models (need conversion)

## 🎯 **Recommended Next Steps**

1. **Try the current uncensored model** (Mistral 7B) first
2. **Search for WizardLM-MLC** models on HuggingFace
3. **Convert your own model** if you have the resources
4. **Request community conversions** on WebLLM GitHub

## 📞 **Need Help?**

- Check WebLLM documentation: https://webllm.mlc.ai/
- Browse available models: https://huggingface.co/mlc-ai
- Join MLC community for conversion help

The key is finding models that end with "-MLC" or are specifically converted for WebLLM!