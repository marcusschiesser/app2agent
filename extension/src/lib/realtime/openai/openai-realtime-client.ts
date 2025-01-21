import { EventEmitter } from "eventemitter3";
import { createRealtimeConnection } from "./realtime-connection";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from "react";

export type OpenAILiveConfig = {
  modalities: string[];
  instructions?: string;
  voice?: string;
  input_audio_format?: string;
  output_audio_format?: string;
  input_audio_transcription?: {
    model: string;
  };
  turn_detection?: {
    type: string;
    threshold: number;
    prefix_padding_ms: number;
    silence_duration_ms: number;
    create_response: boolean;
  } | null;
  tools?: any[];
};

type OpenAILiveClientEventTypes = {
  log: (log: StreamingLog) => void;
  open: () => void;
  close: (ev: Event) => void;
  toolcall: (toolCall: any) => void;
  toolcallcancellation: (cancellation: any) => void;
  setupcomplete: () => void;
  interrupted: () => void;
  turncomplete: () => void;
  audio: (data: ArrayBuffer) => void;
};

type StreamingLog = {
  date: Date;
  type: string;
  message: any;
};

type RealtimeInput = {
  mimeType: string;
  data: string;
};

export class OpenAIRealTimeClient extends EventEmitter<OpenAILiveClientEventTypes> {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  protected config: OpenAILiveConfig | null = null;
  private ephemeralKey: string;
  private audioElement: RefObject<HTMLAudioElement | null>;

  constructor({
    apiKey,
    audioElement,
  }: {
    apiKey: string;
    audioElement: RefObject<HTMLAudioElement | null>;
  }) {
    super();
    this.ephemeralKey = apiKey;
    this.audioElement = audioElement;
  }

  log(type: string, message: StreamingLog["message"]) {
    const log: StreamingLog = {
      date: new Date(),
      type,
      message,
    };
    this.emit("log", log);
  }

  async connect(config: OpenAILiveConfig): Promise<boolean> {
    this.config = config;

    try {
      const { pc, dc } = await createRealtimeConnection(
        this.ephemeralKey,
        this.audioElement,
      );
      this.pc = pc;
      this.dc = dc;

      return new Promise<boolean>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout after 10 seconds"));
        }, 10000);

        dc.addEventListener("open", () => {
          clearTimeout(timeout);
          this.log("data_channel", "open");
          this.emit("open");

          dc.addEventListener("close", (ev: Event) => {
            this.log("data_channel", "close");
            this.emit("close", ev);
          });

          dc.addEventListener("error", (err: any) => {
            this.log("data_channel", `error: ${err}`);
          });

          dc.addEventListener("message", (e: MessageEvent) => {
            this.handleServerEvent(JSON.parse(e.data));
          });

          // Send session update on connection
          this.updateSession();

          resolve(true);
        });
      });
    } catch (err) {
      console.error("Error connecting to realtime:", err);
      return false;
    }
  }

  disconnect() {
    if (this.pc) {
      this.pc.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      this.pc.close();
      this.pc = null;
    }
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    this.log("client", "disconnected");
  }

  private handleServerEvent(event: any) {
    if (event.toolCall) {
      this.log("server.toolCall", event);
      this.emit("toolcall", event.toolCall);
      return;
    }
    if (event.toolCallCancellation) {
      this.log("receive.toolCallCancellation", event);
      this.emit("toolcallcancellation", event.toolCallCancellation);
      return;
    }
    if (event.setupComplete) {
      this.log("server.send", "setupComplete");
      this.emit("setupcomplete");
      return;
    }
    if (event.serverContent) {
      if (event.serverContent.interrupted) {
        this.log("receive.serverContent", "interrupted");
        this.emit("interrupted");
        return;
      }
      if (event.serverContent.end_of_turn) {
        this.log("server.send", "turnComplete");
        this.emit("turncomplete");
      }
    }
  }

  private sendClientEvent(event: any) {
    if (this.dc && this.dc.readyState === "open") {
      this.log("client.send", event);
      this.dc.send(JSON.stringify(event));
    } else {
      this.log("client.error", "data channel not open");
      console.error(
        "Failed to send message - no data channel available",
        event,
      );
    }
  }

  updateSession() {
    if (!this.config) return;

    this.sendClientEvent({
      type: "session.update",
      session: this.config,
    });
  }

  sendMessage(text: string) {
    const id = uuidv4().slice(0, 32);

    this.sendClientEvent({
      type: "conversation.item.create",
      item: {
        id,
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    });

    this.sendClientEvent({ type: "response.create" });
  }

  cancelAssistantSpeech(messageId: string, createdAtMs: number) {
    this.sendClientEvent({
      type: "conversation.item.truncate",
      item_id: messageId,
      content_index: 0,
      audio_end_ms: Date.now() - createdAtMs,
    });
    this.sendClientEvent({ type: "response.cancel" });
  }

  clearAudioBuffer() {
    this.sendClientEvent({ type: "input_audio_buffer.clear" });
  }

  commitAudioBuffer() {
    this.sendClientEvent({ type: "input_audio_buffer.commit" });
    this.sendClientEvent({ type: "response.create" });
  }

  sendRealtimeInput(inputs: RealtimeInput[]) {
    for (const input of inputs) {
      if (input.mimeType.startsWith("audio/")) {
        // First clear any existing audio buffer
        this.sendClientEvent({
          type: "input_audio_buffer.clear",
        });

        // Append the new audio data
        this.sendClientEvent({
          type: "input_audio_buffer.append",
          audio: {
            type: "inline_data",
            mime_type: input.mimeType,
            data: input.data,
          },
        });

        // Commit the audio buffer and trigger response
        this.sendClientEvent({
          type: "input_audio_buffer.commit",
        });
        this.sendClientEvent({
          type: "response.create",
        });
      } else {
        throw new Error(`Unsupported mime type: ${input.mimeType}`);
      }
    }
  }
}
