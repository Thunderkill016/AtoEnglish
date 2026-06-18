"use client";

import { useState } from "react";
import {
  BookOpen,
  Cpu,
  PenTool,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Volume2,
  Bookmark,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LearnPage() {
  // We can track the current active IPOR phase in the demo
  const [activePhase, setActivePhase] = useState<"input" | "processing" | "output" | "review">("processing");
  const [addedVocab, setAddedVocab] = useState<string[]>([]);
  const [savedSentences, setSavedSentences] = useState<boolean>(false);

  const unitInfo = {
    title: "Unit 4: Technology & Society",
    subtitle: "Chủ đề: Công nghệ và Xã hội loài người",
    progress: 40,
  };

  const iporSteps: {
    id: "input" | "processing" | "output" | "review";
    title: string;
    icon: typeof BookOpen;
    desc: string;
    status: "completed" | "active" | "locked";
  }[] = [
    {
      id: "input",
      title: "1. Input (Nạp)",
      icon: BookOpen,
      desc: "Đọc/Nghe ngữ cảnh thực tế",
      status: "completed",
    },
    {
      id: "processing",
      title: "2. Processing (Xử lý)",
      icon: Cpu,
      desc: "Phân tích ngữ pháp & từ vựng",
      status: "active",
    },
    {
      id: "output",
      title: "3. Output (Sản xuất)",
      icon: PenTool,
      desc: "Đặt câu thực tế, thực hành nói",
      status: "locked",
    },
    {
      id: "review",
      title: "4. Review (Ôn tập)",
      icon: RotateCcw,
      desc: "Đẩy từ vựng vào SRS card",
      status: "locked",
    },
  ];

  const vocabularyList = [
    { word: "artificial intelligence", ipa: "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/", meaning: "Trí tuệ nhân tạo" },
    { word: "omnipresent", ipa: "/ˌɒm.nɪˈprez.ənt/", meaning: "Có mặt ở khắp mọi nơi" },
    { word: "revolutionize", ipa: "/ˌrev.əˈluː.ʃən.aɪz/", meaning: "Cách mạng hóa" },
  ];

  const toggleVocab = (word: string) => {
    if (addedVocab.includes(word)) {
      setAddedVocab(addedVocab.filter((w) => w !== word));
    } else {
      setAddedVocab([...addedVocab, word]);
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 -z-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Lesson Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10">
            <Sparkles className="size-3" />
            Lộ trình B1 Intermediate
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {unitInfo.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unitInfo.subtitle}
          </p>
        </div>

        {/* Lesson Progress */}
        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tiến độ bài học</span>
            <span className="font-semibold text-foreground">{unitInfo.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
              style={{ width: `${unitInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* IPOR Steps Horizontal Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {iporSteps.map((step) => {
          const Icon = step.icon;
          const isActive = activePhase === step.id;
          const isCompleted = step.status === "completed" || (step.id === "input" && activePhase !== "input");

          return (
            <button
              key={step.id}
              onClick={() => {
                // Let user toggle in this demo interface
                setActivePhase(step.id as "input" | "processing" | "output" | "review");
              }}
              className={`text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? "bg-primary/10 border-primary/50 shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
                  : isCompleted
                  ? "bg-glass border-emerald-500/20 hover:border-emerald-500/40"
                  : "bg-glass border-border/40 opacity-70 hover:opacity-90 hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex size-8 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="size-4" />
                </span>
                {isCompleted && (
                  <CheckCircle className="size-4 text-emerald-500" />
                )}
              </div>
              <h3 className={`mt-3 font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                {step.title}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
                {step.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main IPOR Workspace */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activePhase === "input" && (
            <div className="rounded-2xl border border-glass bg-glass p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  Pha 1: Input (Đọc & Nghe)
                </h3>
                <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1">
                  <Volume2 className="size-3.5" />
                  Nghe Audio bài đọc
                </Button>
              </div>

              <div className="space-y-4 text-sm md:text-base leading-relaxed text-foreground/80 font-sans">
                <p>
                  In the 21st century, <strong className="text-primary underline decoration-dotted">artificial intelligence</strong> has become <strong className="text-primary underline decoration-dotted">omnipresent</strong>. It is no longer a concept confined to science fiction novels, but an active technology driving our everyday lives.
                </p>
                <p>
                  From autonomous self-driving cars to algorithms that recommend our next favorite songs, AI technologies are beginning to <strong className="text-primary underline decoration-dotted">revolutionize</strong> how society operates. However, as we integrate machines deeper into our social fabrics, questions arise about ethics and security.
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end">
                <Button onClick={() => setActivePhase("processing")} className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2 font-medium">
                  Tiếp tục bước Processing (Xử lý)
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {activePhase === "processing" && (
            <div className="rounded-2xl border border-glass bg-glass p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Cpu className="size-5 text-primary" />
                  Pha 2: Processing (Phân tích ngữ pháp & nghĩa)
                </h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="size-3.5 text-primary" />
                  Click vào từ vựng để thêm vào SRS Flashcards
                </span>
              </div>

              {/* Grammar highlights */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Cấu trúc Ngữ pháp tiêu điểm</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">B1 Level</span>
                  </div>
                  <h4 className="font-bold text-foreground">Sử dụng mệnh đề: confined to / revolutionize how...</h4>
                  <p className="text-sm text-muted-foreground">
                    Cấu trúc <strong>&quot;revolutionize how [clause]&quot;</strong> dùng để mô tả sự thay đổi mang tính cách mạng đối với cách thức hoạt động của một cái gì đó.
                  </p>
                  <div className="text-xs bg-muted p-2.5 rounded-lg font-mono text-foreground/80">
                    Ví dụ: &quot;AI will revolutionize how we learn languages.&quot; (AI sẽ cách mạng hóa cách chúng ta học ngôn ngữ.)
                  </div>
                </div>

                <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/60">
                  {vocabularyList.map((vocab) => {
                    const isAdded = addedVocab.includes(vocab.word);
                    return (
                      <div key={vocab.word} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{vocab.word}</span>
                            <span className="text-xs text-muted-foreground font-mono">{vocab.ipa}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{vocab.meaning}</p>
                        </div>
                        <Button
                          onClick={() => toggleVocab(vocab.word)}
                          variant={isAdded ? "secondary" : "outline"}
                          size="sm"
                          className={`rounded-lg text-xs gap-1.5 ${isAdded ? "text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20" : ""}`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle className="size-3.5" />
                              Đã lưu vào SRS
                            </>
                          ) : (
                            <>
                              <Plus className="size-3.5" />
                              Thêm Flashcard
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setActivePhase("input")} className="rounded-xl">
                  Quay lại bài đọc
                </Button>
                <Button onClick={() => setActivePhase("output")} className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2 font-medium">
                  Tiến lên bước Output (Thực hành)
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {activePhase === "output" && (
            <div className="rounded-2xl border border-glass bg-glass p-6 space-y-6 shadow-sm">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <PenTool className="size-5 text-primary" />
                Pha 3: Output (Thực hành đặt câu cá nhân hóa)
              </h3>
              <p className="text-sm text-muted-foreground">
                Hãy đặt 1 câu tiếng Anh sử dụng từ vựng đã học hôm nay: <strong>omnipresent</strong> hoặc <strong>revolutionize</strong> để áp dụng trực tiếp kiến thức.
              </p>

              <div className="space-y-4">
                <textarea
                  className="w-full min-h-[100px] rounded-xl border border-input bg-background p-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 text-foreground"
                  placeholder="Ví dụ: Smartphones have become omnipresent in our daily life..."
                />
                
                {savedSentences ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-2.5">
                    <CheckCircle className="size-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Tuyệt vời! Câu của bạn đã được ghi nhận.</p>
                      <p className="text-xs mt-0.5 text-muted-foreground">AI đã phân tích ngữ pháp: Câu hoàn toàn chính xác.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <HelpCircle className="size-3.5" />
                      Gợi ý: Cố gắng kết hợp với chủ đề bản thân.
                    </span>
                    <Button onClick={() => setSavedSentences(true)} className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-medium">
                      Nộp câu trả lời
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setActivePhase("processing")} className="rounded-xl">
                  Quay lại Processing
                </Button>
                <Button onClick={() => setActivePhase("review")} className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2 font-medium">
                  Hoàn thành để ôn tập SRS
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {activePhase === "review" && (
            <div className="rounded-2xl border border-glass bg-glass p-6 text-center space-y-6 shadow-sm">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-bounce">
                <RotateCcw className="size-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-foreground">Bài học đã sẵn sàng để ôn tập!</h3>
                <p className="max-w-md mx-auto text-sm text-muted-foreground">
                  Chúc mừng! Bạn đã hoàn thành toàn bộ các pha Input, Processing, Output của bài học này. Các từ vựng mới đã được đóng gói thành các thẻ thông minh.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border max-w-sm mx-auto text-left space-y-2">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Thẻ ôn tập đã tạo:</h4>
                <ul className="text-sm text-foreground/80 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    artificial intelligence
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    omnipresent
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    revolutionize
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setActivePhase("input")} className="rounded-xl">
                  Học lại bài này
                </Button>
                <Button className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-medium">
                  Truy cập trình Flashcards SRS
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          {/* IPOR Framework Info */}
          <div className="rounded-2xl border border-glass bg-glass p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Khung học tập IPOR
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mô hình <strong>IPOR</strong> giúp bạn chuyển đổi kiến thức từ trạng thái tiếp thu thụ động (Input) sang phân tích có chiều sâu (Processing), tự tạo sản phẩm viết nói cá nhân hóa (Output) và ghi nhớ vĩnh viễn (Review).
            </p>
            <div className="text-[11px] text-primary bg-primary/5 border border-primary/10 p-3 rounded-xl flex items-start gap-2">
              <Sparkles className="size-4 shrink-0 mt-0.5" />
              <span>Chỉ bằng việc đặt câu và ôn SRS hằng ngày, bạn sẽ đẩy nhanh hơn 3 lần khả năng phản xạ từ vựng.</span>
            </div>
          </div>

          {/* Quick Notes */}
          <div className="rounded-2xl border border-glass bg-glass p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                Sổ tay ghi chú từ vựng
              </h3>
              <Bookmark className="size-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Các từ bạn đánh dấu lưu trong các pha học sẽ được chuyển thẳng tới hộp thẻ Flashcards.
            </p>
            <div className="space-y-2">
              {addedVocab.length === 0 ? (
                <div className="text-xs text-center py-4 text-muted-foreground border border-dashed border-border rounded-xl">
                  Chưa lưu từ vựng nào trong bài này.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {addedVocab.map((w) => (
                    <span key={w} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                      {w}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}