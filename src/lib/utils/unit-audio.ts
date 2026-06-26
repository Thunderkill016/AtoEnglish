let activeElement: HTMLAudioElement | null = null;

/** Stop any in-flight native audio clip */
export function stopUnitAudio(): void {
  if (activeElement) {
    activeElement.pause();
    activeElement.currentTime = 0;
    activeElement = null;
  }
}

function probeAudio(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio();
    const done = (ok: boolean) => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onError);
      resolve(ok);
    };
    const onReady = () => done(true);
    const onError = () => done(false);
    audio.addEventListener("canplaythrough", onReady);
    audio.addEventListener("error", onError);
    audio.preload = "auto";
    audio.src = src;
  });
}

/**
 * Play native MP3 when available; fall back to browser TTS.
 * Used across lesson sections while audio assets are rolled out unit-by-unit.
 */
/** @returns true when a native MP3 clip was played */
export async function playUnitAudio(
  options: { src?: string; text: string; rate?: number },
  playTTS: (text: string, rate?: number) => void
): Promise<boolean> {
  stopUnitAudio();
  window.speechSynthesis?.cancel();

  const text = options.text?.trim();
  if (!text) return false;

  if (options.src && typeof window !== "undefined") {
    const available = await probeAudio(options.src);
    if (available) {
      const audio = new Audio(options.src);
      activeElement = audio;
      try {
        await audio.play();
        await new Promise<void>((resolve) => {
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
        });
        return true;
      } catch {
        stopUnitAudio();
      }
    }
  }

  playTTS(text, options.rate);
  return false;
}