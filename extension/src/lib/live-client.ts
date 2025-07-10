import { ToolCall, ToolCallCancellation } from "@/multimodal-live-types";
import { StreamingLog } from "@/multimodal-live-types";
import {
  gemini,
  Gemini,
  GEMINI_MODEL,
  GeminiLiveSession,
} from "@llamaindex/google";
import EventEmitter from "eventemitter3";

import {
  ChatMessage,
  LiveConnectConfig,
  liveEvents,
  MessageContentDetail,
} from "llamaindex";

import { base64ToArrayBuffer } from "./client-utils";
import { GenerativeContentBlob } from "@google/generative-ai";
interface LiveClientEventTypes {
  open: () => void;
  log: (log: StreamingLog) => void;
  close: (event: CloseEvent) => void;
  error: (error: string) => void;
  audio: (data: ArrayBuffer) => void;
  content: (data: string) => void;
  interrupted: () => void;
  setupcomplete: () => void;
  turncomplete: () => void;
  toolcall: (toolCall: ToolCall) => void;
  toolcallcancellation: (toolcallCancellation: ToolCallCancellation) => void;
}

export class LiveClient extends EventEmitter<LiveClientEventTypes> {
  private llm: Gemini | undefined;
  private session: GeminiLiveSession | undefined;
  private apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    super();
    this.apiKey = apiKey;
  }

  log(type: string, message: StreamingLog["message"]) {
    const log: StreamingLog = {
      date: new Date(),
      type,
      message,
    };
    this.emit("log", log);
  }

  async connect(config: LiveConnectConfig) {
    this.llm = gemini({
      apiKey: this.apiKey,
      model: GEMINI_MODEL.GEMINI_2_0_FLASH_LIVE,
      httpOptions: { apiVersion: "v1alpha" },
    });

    this.session = await this.llm.live.connect(config);
    this.listening();
  }

  protected async listening() {
    if (!this.session) {
      throw new Error("Session not connected");
    }
    try {
      for await (const event of this.session.streamEvents()) {
        if (liveEvents.open.include(event)) {
          this.log("client.open", "connected to Live llm");
          this.emit("open");
        }
        if (liveEvents.setupComplete.include(event)) {
          this.log("server.send", "setupComplete");
          this.emit("setupcomplete");
        }
        if (liveEvents.interrupted.include(event)) {
          this.log("receive.serverContent", "interrupted");
          this.emit("interrupted");
        }
        if (liveEvents.turnComplete.include(event)) {
          this.log("server.send", "turnComplete");
          this.emit("turncomplete");
        }
        if (liveEvents.error.include(event)) {
          this.emit("error", (event.error as Error).message);
        }
        if (liveEvents.text.include(event)) {
          this.log("receive.serverContent", "text");
          this.emit("content", event.text);
        }
        if (liveEvents.close.include(event)) {
          this.log("client.close", `Disconnected`);
          this.emit("close", event as CloseEvent);
        }
        if (liveEvents.audio.include(event)) {
          const audioData = event.data;
          const isUint8Array = (data: unknown): data is Uint8Array => {
            return data instanceof Uint8Array;
          };

          if (isUint8Array(audioData)) {
            const buffer: ArrayBuffer = audioData.buffer.slice(
              0,
            ) as ArrayBuffer;
            this.emit("audio", buffer);
            this.log(`server.audio`, `buffer (${buffer.byteLength})`);
          } else if (typeof audioData === "string") {
            const data = base64ToArrayBuffer(audioData);
            this.emit("audio", data);
            this.log(`server.audio`, `buffer (${data.byteLength})`);
          }
        }
      }
    } catch (error) {
      this.disconnect();
      console.log("error", error);
      const message = `Could not connect to Live llm`;
      this.log(`server.${error}`, message);
    }
  }

  async disconnect() {
    if (this.session) {
      await this.session.disconnect();
    }
  }

  sendRealtimeInput(chunks: GenerativeContentBlob[]) {
    if (!this.session) {
      console.warn(
        "Cannot send screenshot or audio - connection already closed",
      );
      return;
    }
    let hasAudio = false;
    let hasVideo = false;
    for (let i = 0; i < chunks.length; i++) {
      const ch = chunks[i];
      if (ch.mimeType.includes("audio")) {
        hasAudio = true;
      }
      if (ch.mimeType.includes("image")) {
        hasVideo = true;
      }
      if (hasAudio && hasVideo) {
        break;
      }
    }

    if (hasAudio) {
      const data: MessageContentDetail[] = chunks.map((chunk) => ({
        type: "audio",
        data: chunk.data,
        mimeType: chunk.mimeType,
      }));

      const message: ChatMessage = {
        role: "user",
        content: data,
      };

      this._sendDirect(message);
      this.log(`client.realtimeInput`, "audio");
    } else if (hasVideo) {
      const data: MessageContentDetail[] = chunks.map((chunk) => ({
        type: "image",
        data: chunk.data,
        mimeType: chunk.mimeType,
      }));

      const message: ChatMessage = {
        role: "user",
        content: data,
      };

      this._sendDirect(message);
      this.log(`client.realtimeInput`, "video");
    }
  }

  /**
   * send normal content parts such as { text }
   */
  send(text: string, turnComplete: boolean = true) {
    const chatMessage: ChatMessage = {
      role: "user",
      content: text,
    };
    console.log("turnComplete", turnComplete);
    this._sendDirect(chatMessage);
    this.log(`client.send`, text);
  }

  /**
   *  used internally to send all messages
   *  don't use directly unless trying to send an unsupported message type
   */
  _sendDirect(request: ChatMessage) {
    if (!this.session) {
      throw new Error("Session not connected");
    }
    this.session.sendMessage(request);
  }
}
