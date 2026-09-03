import {
  parseOpenAIRealtimeServerEvent,
  type AtoEnglishRealtimeSignal,
} from "@/lib/realtime/events";
import type { OpenAIRealtimeMode } from "@/lib/realtime/openai-session";

export type RealtimeVoiceConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "failed";

export interface ConnectRealtimeVoiceOptions {
  audioElement: HTMLAudioElement;
  mode?: OpenAIRealtimeMode;
  onSignal?: (signal: AtoEnglishRealtimeSignal) => void;
  onRawEvent?: (event: unknown) => void;
  onStateChange?: (state: RealtimeVoiceConnectionState) => void;
}

export interface RealtimeVoiceConnection {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  microphoneStream: MediaStream;
  send: (event: Record<string, unknown>) => boolean;
  close: () => void;
}

function providerErrorMessage(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return null;
  const error = (payload as Record<string, unknown>).error;
  return typeof error === "string" && error.trim().length > 0 ? error : null;
}

async function readSessionError(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return (
        providerErrorMessage((await response.json()) as unknown) ??
        "Không mở được realtime voice session."
      );
    } catch {
      return "Không mở được realtime voice session.";
    }
  }
  return "Không mở được realtime voice session.";
}

/**
 * Minimal native-WebRTC transport for AtoEnglish realtime voice.
 *
 * The browser sends only its SDP offer to AtoEnglish. The OpenAI API key remains server-side in
 * `/api/realtime/session`. Realtime transcript events are surfaced transiently to the caller; this
 * module does not persist raw audio or transcript text.
 */
export async function connectRealtimeVoice(
  options: ConnectRealtimeVoiceOptions,
): Promise<RealtimeVoiceConnection> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    throw new Error("Realtime voice chỉ chạy trong browser.");
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Browser này không hỗ trợ microphone capture cần cho realtime voice.");
  }

  options.onStateChange?.("connecting");

  const peerConnection = new RTCPeerConnection();
  const dataChannel = peerConnection.createDataChannel("oai-events");
  let microphoneStream: MediaStream | null = null;
  let closed = false;

  const close = () => {
    if (closed) return;
    closed = true;
    dataChannel.close();
    peerConnection.getSenders().forEach((sender) => sender.track?.stop());
    microphoneStream?.getTracks().forEach((track) => track.stop());
    peerConnection.close();
    options.audioElement.srcObject = null;
    options.onStateChange?.("disconnected");
  };

  try {
    options.audioElement.autoplay = true;

    peerConnection.addEventListener("track", (event) => {
      const stream = event.streams[0] ?? new MediaStream([event.track]);
      options.audioElement.srcObject = stream;
      void options.audioElement.play().catch(() => {
        // The caller can offer an explicit playback gesture if the browser blocks autoplay.
      });
    });

    peerConnection.addEventListener("connectionstatechange", () => {
      if (peerConnection.connectionState === "connected") {
        options.onStateChange?.("connected");
      } else if (
        peerConnection.connectionState === "failed" ||
        peerConnection.connectionState === "closed"
      ) {
        options.onStateChange?.(
          peerConnection.connectionState === "failed" ? "failed" : "disconnected",
        );
      }
    });

    dataChannel.addEventListener("message", (message) => {
      let event: unknown = message.data;
      if (typeof message.data === "string") {
        try {
          event = JSON.parse(message.data) as unknown;
        } catch {
          return;
        }
      }

      options.onRawEvent?.(event);
      const signal = parseOpenAIRealtimeServerEvent(event);
      if (signal) options.onSignal?.(signal);
    });

    microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    for (const track of microphoneStream.getAudioTracks()) {
      peerConnection.addTrack(track, microphoneStream);
    }

    const offer = await peerConnection.createOffer({ offerToReceiveAudio: true });
    await peerConnection.setLocalDescription(offer);
    const localSdp = peerConnection.localDescription?.sdp;
    if (!localSdp) throw new Error("Không tạo được SDP offer cho realtime voice.");

    const sessionResponse = await fetch("/api/realtime/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/sdp",
        "X-AtoEnglish-Realtime-Mode": options.mode ?? "capture",
      },
      body: localSdp,
      credentials: "same-origin",
      cache: "no-store",
    });

    if (!sessionResponse.ok) {
      throw new Error(await readSessionError(sessionResponse));
    }

    const answerSdp = await sessionResponse.text();
    if (!answerSdp.trim().startsWith("v=0")) {
      throw new Error("Realtime provider trả SDP answer không hợp lệ.");
    }

    await peerConnection.setRemoteDescription({ type: "answer", sdp: answerSdp });

    const send = (event: Record<string, unknown>) => {
      if (dataChannel.readyState !== "open") return false;
      dataChannel.send(JSON.stringify(event));
      return true;
    };

    return {
      peerConnection,
      dataChannel,
      microphoneStream,
      send,
      close,
    };
  } catch (error) {
    options.onStateChange?.("failed");
    close();
    throw error;
  }
}
