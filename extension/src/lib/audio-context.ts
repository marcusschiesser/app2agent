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
      // Request microphone permissions directly
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // Stop the stream immediately since we only want to check permissions
        stream.getTracks().forEach((track) => track.stop());
      } else {
        throw new Error("MediaDevices API not available");
      }

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
    } catch (e) {
      if (e instanceof DOMException && e.name === "NotAllowedError") {
        throw new Error(
          "Microphone access denied. Please allow microphone access in your browser settings and try again.",
        );
      }
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
    // In Chrome extensions, worklets need to be declared in web_accessible_resources
    // and loaded using the extension's URL pattern
    const workletUrl = chrome.runtime.getURL(`worklets/${workletName}.js`);
    await context.audioWorklet.addModule(workletUrl);
    return new AudioWorkletNode(context, workletName);
  } catch (error) {
    console.error(`Failed to load audio worklet: ${workletName}`, error);
    throw error;
  }
};
