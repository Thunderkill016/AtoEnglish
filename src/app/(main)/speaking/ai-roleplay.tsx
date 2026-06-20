"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Mic,
  Square,
  Volume2,
  RefreshCw,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { saveSpeakingSession } from "@/app/actions/speaking";

interface SpeechRecognitionMock {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart?: () => void;
  onresult?: (event: SpeechRecognitionEventMock) => void;
  onend?: () => void;
  onerror?: (event: SpeechRecognitionErrorEventMock) => void;
}

interface SpeechRecognitionEventMock {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEventMock {
  error: string;
}

interface SpeechWindowMock extends Window {
  SpeechRecognition?: new () => SpeechRecognitionMock;
  webkitSpeechRecognition?: new () => SpeechRecognitionMock;
}


interface DialogStep {
  aiPrompt: string;
  userSuggestion: string;
  userSuggestionVi: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  aiCharacter: string;
  difficulty: "Easy" | "Medium" | "Hard";
  initialMessage: string;
  steps: DialogStep[];
}

export const ROLEPLAY_SCENARIOS: Scenario[] = [
  {
    id: "hotel-checkin",
    title: "Hotel Check-in",
    description: "Nhận phòng khách sạn tại quầy lễ tân.",
    aiCharacter: "Receptionist (Lễ tân)",
    difficulty: "Easy",
    initialMessage: "Welcome to the Grand Plaza Hotel! How can I assist you today?",
    steps: [
      {
        aiPrompt: "Let me check our reservation system. Ah, yes, a deluxe room for three nights under the name John. Could you please show me your ID or passport?",
        userSuggestion: "Hi, I would like to check in, please. I have a reservation under the name John.",
        userSuggestionVi: "Chào bạn, tôi muốn nhận phòng. Tôi có đặt phòng trước dưới tên John."
      },
      {
        aiPrompt: "Perfect, thank you. Yes, breakfast is included and served from seven to ten AM in the main restaurant on the first floor. Here is your room key, room five-o-three. Do you have any other questions?",
        userSuggestion: "Sure, here is my passport. By the way, is breakfast included in the room rate?",
        userSuggestionVi: "Chắc chắn rồi, đây là hộ chiếu của tôi. Nhân tiện, bữa sáng có bao gồm trong giá phòng không?"
      },
      {
        aiPrompt: "You are very welcome! If you need anything else, just dial zero on your room phone to reach the reception desk. Have a wonderful stay with us!",
        userSuggestion: "No, that's all. Thank you so much for your help!",
        userSuggestionVi: "Không, thế là đủ rồi. Cảm ơn bạn rất nhiều vì sự giúp đỡ!"
      }
    ]
  },
  {
    id: "job-interview",
    title: "Job Interview",
    description: "Phỏng vấn xin việc bằng tiếng Anh.",
    aiCharacter: "Hiring Manager (Nhà tuyển dụng)",
    difficulty: "Medium",
    initialMessage: "Good morning! Thank you for coming in today. To start, could you please tell me a little bit about yourself?",
    steps: [
      {
        aiPrompt: "That sounds impressive. We are looking for someone who works well in teams. Can you describe a time when you solved a difficult problem with your team?",
        userSuggestion: "Good morning! I have over three years of experience in software engineering and I'm passionate about building user-friendly web apps.",
        userSuggestionVi: "Chào buổi sáng! Tôi có hơn 3 năm kinh nghiệm trong lĩnh vực kỹ nghệ phần mềm và đam mê xây dựng các ứng dụng web thân thiện với người dùng."
      },
      {
        aiPrompt: "Excellent problem-solving skills. Communication is indeed key. Why do you want to work for our company specifically?",
        userSuggestion: "In my last project, we had a major bug before deployment. I organized an emergency meeting and we split the debugging tasks to fix it on time.",
        userSuggestionVi: "Trong dự án trước, chúng tôi gặp một lỗi lớn trước khi triển khai. Tôi đã tổ chức một cuộc họp khẩn cấp và chúng tôi chia nhau sửa lỗi để kịp tiến độ."
      },
      {
        aiPrompt: "I appreciate your enthusiasm. Your skills align very well with what we need. Do you have any questions for me about the role?",
        userSuggestion: "I admire your company's innovative culture and I believe my engineering skills can help accelerate your new language learning project.",
        userSuggestionVi: "Tôi ngưỡng mộ văn hóa đổi mới của công ty bạn và tin rằng các kỹ năng kỹ thuật của tôi có thể giúp thúc đẩy dự án học ngôn ngữ mới của bạn."
      },
      {
        aiPrompt: "That is a great question. A typical day involves stand-up meetings, coding core features, and collaborating with designers. We will contact you next week about the next steps. Have a great day!",
        userSuggestion: "Yes, could you tell me what a typical day looks like for a developer in this team?",
        userSuggestionVi: "Vâng, bạn có thể cho tôi biết một ngày làm việc điển hình của một lập trình viên trong đội ngũ này diễn ra thế nào không?"
      }
    ]
  },
  {
    id: "coffee-shop",
    title: "Ordering Coffee",
    description: "Gọi đồ uống tại một quán cà phê London.",
    aiCharacter: "Barista (Nhân viên pha chế)",
    difficulty: "Easy",
    initialMessage: "Hi there! What can I get started for you today?",
    steps: [
      {
        aiPrompt: "Sure, a latte. What size would you like? We have small, medium, and large. Also, do you prefer regular milk, oat milk, or soy milk?",
        userSuggestion: "Hi! I would like to order a hot latte, please.",
        userSuggestionVi: "Xin chào! Tôi muốn đặt một ly latte nóng."
      },
      {
        aiPrompt: "Got it, a medium hot latte with oat milk. And would you like any pastries or snacks to go with that today? Our croissants are freshly baked.",
        userSuggestion: "I will take a medium size with oat milk, please.",
        userSuggestionVi: "Tôi lấy cỡ vừa với sữa yến mạch, làm ơn."
      },
      {
        aiPrompt: "Perfect! That will be five pounds and fifty pence. Will you be paying by cash or card today?",
        userSuggestion: "No thanks, just the coffee. To go, please.",
        userSuggestionVi: "Không, cảm ơn, chỉ cà phê thôi. Mang đi, làm ơn."
      },
      {
        aiPrompt: "Payment approved! Thank you. Please wait a moment at the pick-up counter. Have a lovely day!",
        userSuggestion: "I will pay by card, please. Here you go.",
        userSuggestionVi: "Tôi sẽ thanh toán bằng thẻ, làm ơn. Của bạn đây."
      }
    ]
  }
];

interface ChatMessage {
  sender: "ai" | "user";
  text: string;
}

export function AIRoleplay() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(ROLEPLAY_SCENARIOS[0].id);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1); // -1: chưa bắt đầu hoặc đang chào
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const activeScenario = ROLEPLAY_SCENARIOS.find(s => s.id === selectedScenarioId) || ROLEPLAY_SCENARIOS[0];
  const currentStep: DialogStep | undefined = activeScenario.steps[currentStepIndex];

  // Speech Recognition & Synthesis Setup
  const SpeechRecognition = typeof window !== "undefined"
    ? ((window as unknown as SpeechWindowMock).SpeechRecognition || (window as unknown as SpeechWindowMock).webkitSpeechRecognition)
    : null;
  const recognitionRef = useRef<SpeechRecognitionMock | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cuộn xuống cuối hội thoại
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Khởi động cuộc trò chuyện khi chọn Scenario
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    startRoleplay();
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId]);

  const startRoleplay = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    setChatHistory([{ sender: "ai", text: activeScenario.initialMessage }]);
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setRecognizedText("");
    setIsAiSpeaking(false);
    setIsListening(false);
    // eslint-disable-next-line react-hooks/purity
    startTimeRef.current = Date.now();
    
    // Tự động phát câu chào đầu tiên của AI
    setTimeout(() => {
      speakText(activeScenario.initialMessage);
    }, 300);
  };

  // Hàm phát giọng đọc AI
  const speakText = (text: string) => {
    if (typeof window === "undefined") return;
    
    window.speechSynthesis.cancel();
    setIsAiSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95; // Đọc chậm một chút để người học dễ nghe

    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find(voice => voice.lang === "en-US" && voice.name.includes("Google")) 
                   || voices.find(voice => voice.lang.startsWith("en-"));
    if (usVoice) {
      utterance.voice = usVoice;
    }

    utterance.onend = () => {
      setIsAiSpeaking(false);
    };

    utterance.onerror = () => {
      setIsAiSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Hàm lắng nghe giọng nói của người học
  const startListening = () => {
    if (typeof window === "undefined" || !SpeechRecognition) {
      toast.error("Trình duyệt của bạn không hỗ trợ Nhận diện giọng nói.");
      return;
    }

    window.speechSynthesis.cancel();
    setIsAiSpeaking(false);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setRecognizedText("");
      };

      recognition.onresult = (event: SpeechRecognitionEventMock) => {
        const text = event.results[0][0].transcript;
        setRecognizedText(text);
        handleUserAnswer(text);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventMock) => {
        console.error("Listening Error:", event.error);
        setIsListening(false);
        if (event.error === "no-speech") {
          toast.error("Không nghe thấy bạn nói gì. Hãy thử lại!");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Xử lý sau khi người học trả lời xong
  const handleUserAnswer = (text: string) => {
    if (!text.trim()) return;

    // 1. Thêm tin nhắn của user vào history
    setChatHistory(prev => [...prev, { sender: "user", text }]);

    // 2. Kích hoạt AI trả lời ở bước tiếp theo
    setTimeout(async () => {
      if (currentStepIndex < activeScenario.steps.length) {
        const step = activeScenario.steps[currentStepIndex];
        
        // Đưa câu thoại tiếp theo của AI vào chat
        setChatHistory(prev => [...prev, { sender: "ai", text: step.aiPrompt }]);
        speakText(step.aiPrompt);

        // Chuyển step tiếp theo
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Hoàn thành đoạn hội thoại
        setIsCompleted(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success("Tuyệt vời! Bạn đã hoàn thành buổi hội thoại nhập vai này.");

        // Lưu lịch sử luyện tập vào database
        const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        // Nối toàn bộ câu thoại của user để lưu lại làm transcript
        const userTexts = chatHistory
          .filter(m => m.sender === "user")
          .map(m => m.text)
          .join(" | ");
        const fullTranscript = userTexts ? `${userTexts} | ${text}` : text;

        await saveSpeakingSession({
          practiceType: "roleplay",
          duration,
          transcript: fullTranscript,
          scenarioId: activeScenario.id
        });
      }
    }, 1500);
  };

  // Bỏ qua bước nói và nộp trực tiếp bằng cách click vào Suggestion
  const handleUseSuggestion = () => {
    if (!currentStep) return;
    setRecognizedText(currentStep.userSuggestion);
    handleUserAnswer(currentStep.userSuggestion);
  };

  return (
    <div className="space-y-6">
      {/* Scenarios Header Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROLEPLAY_SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenarioId(s.id)}
            className={`shrink-0 snap-start px-5 h-11 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center ${
              selectedScenarioId === s.id
                ? "bg-violet-600 text-white border-violet-600 shadow-md"
                : "bg-glass border-glass text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
            }`}
          >
            {s.title} ({s.difficulty})
          </button>
        ))}
      </div>

      {/* Main Interactive Chat Box */}
      <div className="rounded-3xl border border-glass bg-glass p-4 sm:p-8 space-y-4 shadow-sm relative overflow-hidden flex flex-col min-h-[400px] sm:min-h-[500px] justify-between">
        
        {/* Chat Header info */}
        <div className="flex items-center justify-between border-b border-foreground/[0.04] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
              <MessageSquare className="size-4.5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-foreground">{activeScenario.title}</h4>
              <p className="text-[10px] text-muted-foreground font-normal">Đóng vai cùng: {activeScenario.aiCharacter}</p>
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
            activeScenario.difficulty === "Easy"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : activeScenario.difficulty === "Medium"
              ? "bg-amber-500/10 text-amber-505 text-amber-600 border-amber-500/20"
              : "bg-red-500/10 text-red-600 border-red-500/20"
          }`}>
            {activeScenario.difficulty}
          </span>
        </div>

        {/* Chat History Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-2 scrollbar-thin">
          {chatHistory.map((msg, index) => {
            const isAi = msg.sender === "ai";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Character avatar indicator */}
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isAi ? "bg-violet-500/10 text-violet-500" : "bg-primary/10 text-primary"
                }`}>
                  {isAi ? "AI" : "ME"}
                </span>

                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? "bg-foreground/[0.03] text-foreground rounded-tl-none border border-foreground/[0.04]"
                      : "bg-primary text-primary-foreground rounded-tr-none shadow-sm font-medium"
                  }`}>
                    {msg.text}
                  </div>
                  
                  {isAi && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-[10px] text-muted-foreground font-bold hover:text-primary flex items-center gap-1 mt-1 px-1 transition-colors"
                    >
                      <Volume2 className="size-3" />
                      Nghe phát âm
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* User Interaction Controls */}
        <div className="pt-4 border-t border-foreground/[0.04] space-y-4">
          
          {/* Scenario Completed Screen */}
          {isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 sm:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-3"
            >
              <div className="inline-flex size-12 items-center justify-center bg-emerald-500 text-white rounded-full">
                <CheckCircle className="size-6" />
              </div>
              <h5 className="font-bold text-foreground">Hội thoại hoàn thành xuất sắc!</h5>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto font-normal">
                Chúc mừng bạn đã luyện nói phản xạ thành công toàn bộ kịch bản giao tiếp &quot;{activeScenario.title}&quot;.
              </p>
              <Button
                onClick={startRoleplay}
                variant="outline"
                className="h-10 rounded-xl gap-2 font-bold text-xs uppercase border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 bg-transparent"
              >
                <RefreshCw className="size-3.5" />
                Luyện lại hội thoại
              </Button>
            </motion.div>
          ) : (
            // Active interaction step
            <div className="space-y-4">
              
              {/* Suggestion Card for User */}
              {currentStep && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      Gợi ý câu thoại nói
                    </span>
                    <button
                      onClick={handleUseSuggestion}
                      className="hover:underline flex items-center gap-0.5 normal-case font-bold"
                    >
                      Bỏ qua và Đi tiếp <ArrowRight className="size-3" />
                    </button>
                  </div>
                  
                  <p className="text-xs sm:text-sm font-semibold text-foreground font-sans">
                    &quot;{currentStep.userSuggestion}&quot;
                  </p>
                  
                  <p className="text-[11px] text-muted-foreground font-normal italic">
                    Dịch nghĩa: {currentStep.userSuggestionVi}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-stretch sm:items-center gap-3">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isAiSpeaking}
                  className={`flex-1 h-14 sm:h-12 rounded-2xl font-bold transition-all duration-300 gap-2 flex items-center justify-center ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg"
                      : "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 active:scale-[0.98]"
                  }`}
                >
                  {isListening ? (
                    <>
                      <Square className="size-4.5 fill-white" />
                      <span>Đang lắng nghe... Nói đi bạn</span>
                    </>
                  ) : (
                    <>
                      <Mic className="size-4.5" />
                      <span>Nhấn để trả lời AI</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={startRoleplay}
                  variant="outline"
                  size="icon"
                  className="size-14 sm:size-12 rounded-2xl border-glass shrink-0 active:scale-[0.98] flex items-center justify-center"
                  title="Khởi động lại cuộc trò chuyện"
                >
                  <RefreshCw className="size-4.5 text-muted-foreground" />
                </Button>
              </div>

              {/* Interim recognized text feedback */}
              {isListening && recognizedText && (
                <div className="p-3 bg-foreground/[0.02] border border-dashed border-foreground/10 rounded-xl text-xs font-mono text-muted-foreground italic text-center">
                  Nhận diện: &quot;{recognizedText}...&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
