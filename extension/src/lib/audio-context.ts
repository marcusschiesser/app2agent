import { worklets } from "./inlined-worklets";

export type GetAudioContextOptions = AudioContextOptions & {
  id?: string;
};

const map: Map<string, AudioContext> = new Map();

export const audioContext: (
  options?: GetAudioContextOptions,
) => Promise<AudioContext> = (() => {
  const didInteract = new Promise((res) => {
    window.addEventListener("pointerdown", res, { once: true });
    window.addEventListener("keydown", res, { once: true });
  });

  return async (options?: GetAudioContextOptions) => {
    try {
      if (options?.id && map.has(options.id)) {
        const ctx = map.get(options.id);
        if (ctx) {
          return ctx;
        }
      }
      const ctx = new AudioContext(options);
      if (options?.id) {
        map.set(options.id, ctx);
      }
      return ctx;
    } catch {
      await didInteract;
      if (options?.id && map.has(options.id)) {
        const ctx = map.get(options.id);
        if (ctx) {
          return ctx;
        }
      }
      const ctx = new AudioContext(options);
      if (options?.id) {
        map.set(options.id, ctx);
      }
      return ctx;
    }
  };
})();

export const loadAudioWorklet = async (
  context: AudioContext,
  workletName: string,
): Promise<AudioWorkletNode> => {
  try {
    // Instead of loading from a URL, create a Blob URL from the inlined code
    if (!worklets[workletName]) {
      throw new Error(`Worklet ${workletName} not found in inlined worklets`);
    }

    // Create a Blob with the worklet code
    const blob = new Blob([worklets[workletName]], {
      type: "application/javascript",
    });

    // Create a URL for the Blob
    const workletUrl = URL.createObjectURL(blob);

    // Add the worklet module and clean up the Blob URL
    await context.audioWorklet.addModule(workletUrl);
    URL.revokeObjectURL(workletUrl); // Clean up the blob URL

    return new AudioWorkletNode(context, workletName);
  } catch (error) {
    console.error(`Failed to load audio worklet: ${workletName}`, error);
    throw error;
  }
};
