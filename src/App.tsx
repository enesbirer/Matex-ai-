import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Send, 
  BookOpen, 
  ArrowRight, 
  Activity, 
  CheckCircle,
  Clock,
  Compass,
  FileQuestion,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Dropzone from "./components/Dropzone";
import SocraticMessage from "./components/SocraticMessage";
import { mathPresets } from "./utils/presets";
import { UIMessage, ChatMessage, MathPreset } from "./types";

const loadingQuotes = [
  "Matematik probleminin can alıcı noktaları analiz ediliyor...",
  "Çözümün ilk mantıksal adımı hazırlanıyor...",
  "Anlamanı kolaylaştıracak ipuçları bir araya getiriliyor...",
  "Sezgisel ve net bir açıklama yolu oluşturuluyor...",
  "Matematiksel ilkeler sabırla inceleniyor..."
];

export default function App() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [sessionImage, setSessionImage] = useState<string | null>(null);
  const [sessionImageRaw, setSessionImageRaw] = useState<{ rawBase64: string; mimeType: string } | null>(null);
  const [activePreset, setActivePreset] = useState<MathPreset | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat feed on update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Rotate loading quote every 2.5s
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % loadingQuotes.length);
      }, 2500);
    } else {
      setQuoteIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Start learning session on selecting or uploading a problem
  const handleProblemSelected = async (base64Data: string, mimeType: string, imageUrl: string, preset?: MathPreset) => {
    setIsLoading(true);
    setSessionImage(imageUrl);
    setSessionImageRaw({ rawBase64: base64Data, mimeType });
    if (preset) {
      setActivePreset(preset);
    } else {
      setActivePreset(null);
    }

    const studentStarterText = "İşte matematik sorum. Lütfen bana bu soruyu tanımlamakta, can alıcı noktalarını görmemde ve Sokratik bir yöntemle ilk adımda ne yapmam gerektiğini bulmamda adım adım rehberlik et.";
    
    // Add initial student message state
    const firstUserMsg: UIMessage = {
      id: "msg-starter-user",
      role: "user",
      text: studentStarterText,
      image: imageUrl,
      timestamp: new Date()
    };

    setMessages([firstUserMsg]);

    try {
      // Build standard API payload
      const payload: ChatMessage[] = [
        {
          role: "user",
          parts: [
            { text: studentStarterText },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              }
            }
          ]
        }
      ];

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!response.ok) {
        throw new Error("Tutor API rejected the request.");
      }

      const data = await response.json();
      
      const firstModelMsg: UIMessage = {
        id: "msg-starter-model",
        role: "model",
        text: data.text || "Merhaba! Harika bir matematik problemi yüklemişsin. Birlikte inceleyelim. Çözüm için aklına gelen ilk adım nedir dostum?",
        timestamp: new Date()
      };

      setMessages([firstUserMsg, firstModelMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages([
        firstUserMsg,
        {
          id: "msg-error-starter",
          role: "model",
          text: `Ah! Matematik öğretmenimizle bağlantı kurarken ufak bir sorun oluştu. Lütfen Gemini API Anahtarınızın ayarlarda tanımlı olduğundan emin olup tekrar deneyin.\n\nHata: ${err.message}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Standard interactive dialogue submission
  const handleSendMessage = async (textToSend: string, overrides?: { isWhy?: boolean; isHint?: boolean }) => {
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend;
    setInputMessage("");
    setIsLoading(true);

    const newUserMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: userText,
      timestamp: new Date(),
      isWhyQuestion: overrides?.isWhy || false,
      isHint: overrides?.isHint || false
    };

    const currentMessages = [...messages, newUserMsg];
    setMessages(currentMessages);

    try {
      // Transform full state into standard Gemini contents payload
      const payload: ChatMessage[] = currentMessages.map((msg, index) => {
        const parts: any[] = [{ text: msg.text }];
        // Only attach base64 image representation onto the absolute first message of history
        if (index === 0 && sessionImageRaw) {
          parts.push({
            inlineData: {
              mimeType: sessionImageRaw.mimeType,
              data: sessionImageRaw.rawBase64,
            }
          });
        }
        return {
          role: msg.role,
          parts,
        };
      });

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!response.ok) {
        throw new Error("Unable to formulate a response from the tutor.");
      }

      const data = await response.json();

      const newModelMsg: UIMessage = {
        id: crypto.randomUUID(),
        role: "model",
        text: data.text,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, newModelMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: `I'm deeply sorry, I had difficulty analyzing that question. Let's compose our thoughts together and try again.\n\nError details: ${err.message}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setSessionImage(null);
    setSessionImageRaw(null);
    setActivePreset(null);
    setInputMessage("");
  };

  const firstImgMessage = messages.find((m) => m.image);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 py-4 shadow-sm px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg md:text-xl text-slate-900 tracking-tight flex items-center gap-2">
                Matex ai
              </h1>
              <p className="text-xs text-slate-500 font-sans hidden sm:block">
                Cebir ve kalkülüs konularında sabırlı, şefkatli ve adım adım yol gösteren özel öğretmeniniz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono bg-slate-100 py-1.5 px-3 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Tarih: 2026-05-27
            </span>
            {sessionImage && (
              <button
                id="reset-session-button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-sans font-medium transition-colors border border-slate-200"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Yeni Soruyu Çöz
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!sessionImage ? (
            /* INTRO SCREEN - DROPZONE & PRESETS */
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full"
            >
              <div className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium font-sans mb-4 w-fit border border-emerald-100">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Şefkatli Sokratik Eğitim Modeli
                </div>
                
                <h2 className="font-sans font-extrabold text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight mb-4">
                  Sadece sonuç veren bir hesap makinesiyle değil, sabırlı bir öğretmenle çalışın.
                </h2>
                
                <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-6">
                  Hesap makineleri size sonucu söyler ama anlamanızı sağlamaz. Yapay zeka öğretmenimiz yüklediğiniz soruyu mükemmel analiz eder, can alıcı noktalarını vurgular ve her seferinde sizi düşünmeye teşvik edecek <strong>tek bir adımla</strong> rehberlik eder. İstediğiniz an tıklayıp <em>&quot;Neden öyle yaptık?&quot;</em> diyerek kavramı öğrenebilirsiniz.
                </p>

                <div className="space-y-3.5 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-semibold mt-0.5">1</div>
                    <p className="text-slate-600 text-sm font-sans">
                      <strong>Sorunun Fotoğrafını Yükleyin:</strong> Defterinizden bir fotoğrafı sürükleyin, ekran görüntüsü yapıştırın ya da aşağıdaki hazır matematik örneklerine tıklayın.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-semibold mt-0.5">2</div>
                    <p className="text-slate-600 text-sm font-sans">
                      <strong>Adım Adım İlerleyin:</strong> Öğretmenimiz tüm çözümü dökmez. İlk adımı yazıp kavramsal olarak ne yapmamız gerektiğini sorar.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-semibold mt-0.5">3</div>
                    <p className="text-slate-600 text-sm font-sans">
                      <strong>Sorun, Keşfedin, Kavrayın:</strong> Anlamadığınız her an hazırdaki hızlı butonlarla ipuçları, konunun açıklamalarını veya günlük hayat benzetmelerini isteyebilirsiniz!
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5">
                    VEYA SİSTEMİ ANINDA TEST ETMEK İÇİN BİR MATEMATİK ÖRNEĞİ SEÇİN
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {mathPresets.map((preset) => (
                      <button
                        key={preset.id}
                        id={`btn-${preset.id}`}
                        onClick={() => handleProblemSelected(preset.base64Data, preset.mimeType, preset.imageUrl, preset)}
                        className="flex flex-col text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all duration-300 group"
                      >
                        <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full w-fit mb-2 ${
                          preset.difficulty === "Beginner" 
                            ? "bg-slate-100 text-slate-600"
                            : preset.difficulty === "Intermediate"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {preset.difficulty === "Beginner" ? "Başlangıç" : preset.difficulty === "Intermediate" ? "Orta Seviye" : "İleri Seviye"}
                        </span>
                        <h5 className="font-sans font-semibold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors mb-1">
                          {preset.title}
                        </h5>
                        <p className="text-xs text-slate-500 font-sans line-clamp-2">
                          {preset.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Dropzone Side */}
              <div className="lg:col-span-5 h-full flex flex-col justify-center">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <Dropzone onImageSelected={handleProblemSelected} isLoading={isLoading} />
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE LESSON BOARD PAGE */
            <motion.div
              key="lesson-board"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch"
            >
              {/* LEFT SIDEBAR: ACTIVE HOMEWORK CANVAS */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-24">
                  <div className="flex items-center justify-between mb-4.5 pb-3 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 font-sans font-bold text-xs tracking-wider uppercase text-slate-400">
                      <Activity className="h-4 w-4 text-emerald-600" /> AKTİF MATERYAL
                    </span>
                    {activePreset && (
                      <span className="text-[10px] font-mono bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">
                        {activePreset.topic === "Algebra" ? "Cebir" : activePreset.topic === "Calculus-Limits" ? "Limit" : "Türev"}
                      </span>
                    )}
                  </div>

                  {/* High Fidelity Math Display */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 aspect-[4/3] flex items-center justify-center shadow-inner relative group mb-4">
                    <img
                      src={sessionImage}
                      alt="Active mathematical problem"
                      className="max-h-full max-w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-3 p-1">
                    <h4 className="font-sans font-semibold text-sm text-slate-800">
                      {activePreset ? activePreset.title : "Kişisel Sınıf Probleminiz"}
                    </h4>
                    <p className="text-xs font-sans text-slate-500 leading-relaxed">
                      Yüklediğiniz bu soru, sohbetimizin ana kılavuzudur. Defterinize çözmeye çalışırken her adımda doğru yolda olup olmadığınızı öğretmenimize sorabilirsiniz.
                    </p>
                  </div>

                  {/* Socratic Reminders Sidebar Card */}
                  <div className="mt-5 rounded-xl bg-emerald-50/50 border border-emerald-100/50 p-4">
                    <h5 className="font-sans font-semibold text-xs text-emerald-800 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-emerald-600" /> Çalışma Odası Tavsiyeleri
                    </h5>
                    <ul className="text-xs text-slate-600 space-y-2 font-sans leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        Çözüme hızlıca atlamadan önce değişkenleri veya kuralı defterinize not alın.
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        Anlaşılması güç bir adım geldiğinde <strong className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">&quot;Neden öyle yaptık?&quot;</strong> butonuna basın.
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        Hata yapmaktan korkmayın; her hata gerçek anlamda öğrenmenizi tetikler.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR: ACTIVE CHAT FEED */}
              <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[580px] overflow-hidden">
                {/* Chat Feed Messages Header */}
                <div className="bg-slate-50/70 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-sans font-semibold text-slate-600">
                      Öğretmen Patientia ile Sokratik Ders Odası
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {messages.length} mesajlaşma
                  </span>
                </div>

                {/* Messages Box */}
                <div className="flex-grow p-4 md:p-6 overflow-y-auto max-h-[580px] min-h-[440px] space-y-4">
                  {messages.map((msg) => (
                    <SocraticMessage key={msg.id} message={msg} />
                  ))}

                  {/* LOADING PLACEHOLDER SENTENCE */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4 mb-4"
                    >
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <Compass className="h-5 w-5 animate-spin" />
                      </div>
                      <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100/30 max-w-[85%] md:max-w-[75%]">
                        <p className="text-xs font-mono text-emerald-700 uppercase tracking-wider mb-2 animate-pulse">
                          Öğretmeniniz Düşünüyor...
                        </p>
                        <p className="text-sm font-sans italic text-slate-500 font-medium">
                          &quot;{loadingQuotes[quoteIndex]}&quot;
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* QUICK REACTIONS BOX */}
                <div className="px-5 pt-3 pb-2 border-t border-slate-100 bg-slate-50/20 flex flex-wrap gap-2 items-center">
                  <button
                    id="action-why-btn"
                    onClick={() => handleSendMessage("Neden bu işlemi yaptık? Bu adımın arkasındaki temel mantığı veya formülü bana basitçe açıklayabilir misiniz?", { isWhy: true })}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-50 text-blue-700 text-xs font-medium font-sans hover:shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> ❓ Neden öyle yaptık?
                  </button>
                  <button
                    id="action-hint-btn"
                    onClick={() => handleSendMessage("Burada biraz tıkandım. Bana tam cevabı vermeden bir sonraki adım için küçük bir ipucu verebilir misiniz?", { isHint: true })}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-50 text-amber-700 text-xs font-medium font-sans hover:shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> 🛋️ Bana küçük bir ipucu ver
                  </button>
                  <button
                    id="action-analogy-btn"
                    onClick={() => handleSendMessage("Bu matematik formülünü ya da adımı daha iyi anlamam için bana fiziksel veya günlük hayattan açıklayıcı bir benzetme yapar mısınız?")}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50/70 hover:bg-purple-50 text-purple-700 text-xs font-medium font-sans hover:shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Compass className="w-3.5 h-3.5" /> 💡 Günlük hayattan benzetme yap
                  </button>
                  <button
                    id="action-check-btn"
                    onClick={() => handleSendMessage("Biraz ilerleme kaydettim! Defterimdeki şu anki işlem satırının doğru olup olmadığını kontrol edebilir misiniz?")}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-50 text-emerald-700 text-xs font-medium font-sans hover:shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> ✅ Mevcut satırımı kontrol et
                  </button>
                </div>

                {/* TEXT INPUT FOOTER */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }}
                  className="p-4 border-t border-slate-100 bg-white flex gap-2 items-center"
                >
                  <input
                    id="dialog-text-input"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Bir soru sorun veya yaptığınız işlem satırını buraya yazın..."
                    disabled={isLoading}
                    className="flex-grow font-sans text-sm border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-60"
                  />
                  <button
                    id="dialog-send-button"
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center h-[46px] w-[46px]"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Styled Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white mt-auto px-4 md:px-8 text-center text-xs text-slate-400 font-sans">
        <p>
          &copy; 2026 Matex ai. Matematiksel kaslarınızı güçlendirmek üzere sabırla ve şefkatle tasarlandı.
        </p>
      </footer>
    </div>
  );
}
