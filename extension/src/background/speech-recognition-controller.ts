import {
  AutoTokenizer,
  AutoProcessor,
  WhisperForConditionalGeneration,
  TextStreamer,
  full,
} from "@huggingface/transformers";

const MAX_NEW_TOKENS = 64;
const MODEL_ID = "onnx-community/whisper-base";

type StatusCallback = (status: string, data?: any) => void;

/**
 * Manages speech recognition using Hugging Face's Whisper model.
 * Uses a singleton pattern to ensure only one instance exists.
 */
export class SpeechRecognitionController {
  private static instance: SpeechRecognitionController | null = null;
  private tokenizer: typeof AutoTokenizer | null = null;
  private processor: typeof AutoProcessor | null = null;
  private model: typeof WhisperForConditionalGeneration | null = null;
  private processing = false;
  private onStatusUpdate: StatusCallback;

  private constructor(onStatusUpdate: StatusCallback) {
    this.onStatusUpdate = onStatusUpdate;
  }

  /**
   * Gets or creates the singleton instance of the controller
   */
  public static getInstance(
    onStatusUpdate: StatusCallback,
  ): SpeechRecognitionController {
    if (!this.instance) {
      this.instance = new SpeechRecognitionController(onStatusUpdate);
    }
    return this.instance;
  }

  /**
   * Initializes the speech recognition pipeline
   */
  public async initialize(): Promise<void> {
    try {
      this.onStatusUpdate("loading", "Loading model...");

      // Load all models in parallel
      [this.tokenizer, this.processor, this.model] = await Promise.all([
        AutoTokenizer.from_pretrained(MODEL_ID, {
          progress_callback: this.onStatusUpdate,
        }),
        AutoProcessor.from_pretrained(MODEL_ID, {
          progress_callback: this.onStatusUpdate,
        }),
        WhisperForConditionalGeneration.from_pretrained(MODEL_ID, {
          dtype: {
            encoder_model: "fp32",
            decoder_model_merged: "q4",
          },
          device: "webgpu",
          progress_callback: this.onStatusUpdate,
        }),
      ]);

      this.onStatusUpdate(
        "loading",
        "Compiling shaders and warming up model...",
      );

      // Warm up the model with dummy input
      if (this.model) {
        await this.model.generate({
          input_features: full([1, 80, 3000], 0.0),
          max_new_tokens: 1,
        });
      }

      this.onStatusUpdate("ready");
    } catch (error) {
      this.onStatusUpdate("error", error.message);
      throw error;
    }
  }

  /**
   * Transcribes audio data to text
   */
  public async transcribe(
    audio: ArrayBuffer,
    language: string = "en",
  ): Promise<void> {
    if (this.processing || !this.tokenizer || !this.processor || !this.model) {
      throw new Error("Speech recognition not ready");
    }

    this.processing = true;
    this.onStatusUpdate("start");

    try {
      let startTime: number;
      let numTokens = 0;

      const streamer = new TextStreamer(this.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (output: string) => {
          startTime ??= performance.now();
          let tps;
          if (numTokens++ > 0) {
            tps = (numTokens / (performance.now() - startTime)) * 1000;
          }
          this.onStatusUpdate("update", { output, tps, numTokens });
        },
      });

      const inputs = await this.processor(audio);
      const outputs = await this.model.generate({
        ...inputs,
        max_new_tokens: MAX_NEW_TOKENS,
        language,
        streamer,
      });

      const outputText = this.tokenizer.batch_decode(outputs, {
        skip_special_tokens: true,
      });
      this.onStatusUpdate("complete", { output: outputText });
    } catch (error) {
      this.onStatusUpdate("error", error.message);
      throw error;
    } finally {
      this.processing = false;
    }
  }

  /**
   * Cleans up resources
   */
  public cleanup(): void {
    // Release model resources
    this.tokenizer = null;
    this.processor = null;
    this.model = null;
    this.processing = false;
    SpeechRecognitionController.instance = null;
  }
}

// Export convenience functions that match the previous API
let controller: SpeechRecognitionController | null = null;

export async function initializeSpeechRecognition(
  onStatusUpdate: StatusCallback,
): Promise<void> {
  controller = SpeechRecognitionController.getInstance(onStatusUpdate);
  await controller.initialize();
}

export async function transcribeAudio(
  audioData: ArrayBuffer,
  language: string = "en",
): Promise<void> {
  if (!controller) {
    throw new Error("Speech recognition not initialized");
  }
  await controller.transcribe(audioData, language);
}

export function cleanupSpeechRecognition(): void {
  if (controller) {
    controller.cleanup();
    controller = null;
  }
}
