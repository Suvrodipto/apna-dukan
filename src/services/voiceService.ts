export class VoiceAssistantService {
  private static instance: VoiceAssistantService;
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public static getInstance(): VoiceAssistantService {
    if (!VoiceAssistantService.instance) {
      VoiceAssistantService.instance = new VoiceAssistantService();
    }
    return VoiceAssistantService.instance;
  }

  // Paytm/PhonePe Style Audio Soundbox Announcement for APNA DUKAN
  public announcePayment(amount: number, paymentMode: string = 'UPI', lang: 'en' | 'hi' | 'hinglish' = 'hi') {
    if (!this.synth) return;

    let text = `Apna Dukan par ${amount} rupaye mil gaye!`;
    if (lang === 'en') {
      text = `Payment of ${amount} rupees received successfully on Apna Dukan via ${paymentMode}!`;
    } else if (lang === 'hinglish') {
      text = `Awesome! ${amount} rupees ${paymentMode} payment successfully received on Apna Dukan!`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    const voices = this.synth.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    this.synth.speak(utterance);
  }

  public startVoiceRecognition(
    onCommandRecognized: (text: string) => void,
    onError?: (err: string) => void
  ): () => void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onError) onError('Speech Recognition is not supported in this browser.');
      return () => {};
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'hi-IN';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onCommandRecognized(transcript);
      };

      this.recognition.onerror = (event: any) => {
        if (onError) onError(event.error);
      };

      this.recognition.start();

      return () => {
        if (this.recognition) {
          try { this.recognition.stop(); } catch {}
        }
      };
    } catch (err: any) {
      if (onError) onError(err.message || 'Error starting microphone.');
      return () => {};
    }
  }
}

export const voiceService = VoiceAssistantService.getInstance();
