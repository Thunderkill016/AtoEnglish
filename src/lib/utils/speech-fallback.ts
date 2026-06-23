export interface SpeechRecognitionEventMock {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
  resultIndex?: number;
}

/**
 * Browser-independent fallback for SpeechRecognition.
 * Simulates speech recognition in browsers where the Web Speech API is not supported.
 */
export class SpeechRecognitionFallback {
  static activeTranscript = "";

  continuous = false;
  interimResults = false;
  lang = "en-US";
  activeTranscript?: string;

  onstart: ((event: Event) => void) | null = null;
  onresult: ((event: SpeechRecognitionEventMock) => void) | null = null;
  onend: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  private timeoutId: NodeJS.Timeout | null = null;
  private isListening = false;

  start() {
    if (this.isListening) return;
    this.isListening = true;

    // Asynchronously call onstart to match browser behavior
    setTimeout(() => {
      if (this.isListening && this.onstart) {
        this.onstart(new Event("start"));
      }
    }, 50);
  }

  stop() {
    if (!this.isListening) return;
    this.isListening = false;

    this.timeoutId = setTimeout(() => {
      const transcript =
        this.activeTranscript ||
        SpeechRecognitionFallback.activeTranscript ||
        "I would like to describe my day today. It was a very productive and interesting day...";

      if (this.onresult) {
        // Construct standard structure: event.results[i][0].transcript with isFinal: true
        const item = [{ transcript }];
        const resultList = [Object.assign(item, { isFinal: true })];
        const event: SpeechRecognitionEventMock = {
          results: Object.assign(resultList, { length: resultList.length }),
          resultIndex: 0,
        };
        this.onresult(event);
      }

      if (this.onend) {
        this.onend(new Event("end"));
      }
    }, 1000);
  }

  abort() {
    this.isListening = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.onend) {
      this.onend(new Event("end"));
    }
  }
}

