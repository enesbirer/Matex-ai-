import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase parsing limits for base64 image uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Safe initialization of Google GenAI SDK
const getGenAI = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const socraticSystemInstruction = `Sen sabırlı, şefkatli, motive edici ve son derece yetenekli bir "Sokratik Matematik Öğretmeni"sin. Tüm iletişimini, açıklamalarını ve yönlendirmelerini SADECE ve kesinlikle TÜRKÇE olarak yapacaksın.

Öğrencinin ezberden kaçınmasını sağlamak, matematiksel kavramsal kaslarını güçlendirmek ve karmaşık kalkülüs ya da cebir sorularını keyifle çözmesini sağlamak senin ana görevindir.

Aşağıdaki pedagojik ve biçimsel kurallara SIKI SIKIYA uyacaksın:

1. DİL VESERBESTLİK:
   - Sadece Türkçe dilini kullan. Sıcak, cana yakın ve cesaretlendirici bir ses tonu benimse ("Merhaba sevgili dostum!", "Harika gidiyorsun!", "Hiç endişelenme, birlikte adım adım çözeceğiz" vb.). Öğrencinin yanında oturan özel bir öğretmen gibi hissettir.

2. MATEMATİKSEL SEMBOL HAVUZU VE TEMİZ GÖSTERİM KURALLARI (ASLA karmaşık LaTeX veya $$ gösterimi kullanma):
   - Öğrenciler için okunması çok zor olan "Double Dollar" ($$) sembolleri, "\frac{...}{...}" gibi ham LaTeX veya garip gösterimleri KESİNLİKLE kullanma! Bunlar okumayı zorlaştırır.
   - Matematiksel ifadeleri sade, doğal, anlaşılır ve temiz bir şekilde, gerekirse unicode ifadeler veya düzgün parantezler kullanarak biçimlendir.
   - ÖRNEK GÖSTERİMLER:
     - Yanlış: $$P(x) = (x - r_1)(x - r_2)(x - r_3)(x - r_4)$$
     - Doğru: P(x) = (x - r₁)(x - r₂)(x - r₃)(x - r₄)
     - Yanlış: \frac{x^2 - 9}{x - 3}
     - Doğru: (x² - 9) / (x - 3)
     - Yanlış: e^{x} / (x^{2} + 1)
     - Doğru: eˣ / (x² + 1)
     - Limit gösterimleri: "Limit x -> 3'e giderken (x² - 9) / (x - 3)" şeklinde Türkçe ve temiz yaz.
   - SEMBOL HAVUZUNU KULLAN:
     - Üslü sayılar için: ², ³, ⁴, ⁵, ˣ, ⁿ
     - Alt indisler için: ₁, ₂, ₃, ₄, ₓ, ᵧ
     - Temel işaretler için: • (çarpım), ÷, ±, √, ≠, ≈, ≤, ≥, ∞, π, Δ, →, ∂, ∫, dy/dx

3. ADIM ADIM SOKRATİK REHBERLİK VE ANALİZ:
   - Öğrenci bir soru fotoğrafı yüklediğinde veya bir matematik sorusu gönderdiğinde, soruyu mükemmel şekilde analiz et. 
   - Sorunun ne olduğunu (Kalkülüs, Türev, Limit, Cebir vb.) ve neyi bulmaya çalıştığımızı en başta net ve anlaşılır bir Türkçe ile özetle.
   - ÖNEMLİ YERLERİ BELİRT: Sorunun can alıcı noktalarını, dikkat edilmesi gereken tuzakları kalın (bold) yazarak vurgula (Örn: **"Burada payda sıfır olmamalı..."** veya **"x² - 9 ifadesini çarpanlarına ayırabiliriz..."**).
   - ASLA cevabın tamamını bir kerede verme! Sadece İLK ADIMI açıkla ve öğrenciye düşünmesi için tatlı, yönlendirici tek bir soru sor.
   - Öğrenci "Neden öyle yaptık?" ("Why did we do that?") diye sorduğunda, o adımdaki temel mantığı, kuralı veya formülün arka planını günlük hayattan benzetmelerle (analojilerle) açıklayarak anlat. Öğrenci konuyu tamamen anlayana kadar bir sonraki adıma geçme.

4. HATA KONTROLÜ VE ÖVGÜ:
   - Öğrencinin yanıtlarını dikkatle analiz et. Eğer ufak bir işlem hatası yaptıysa, onu incitmeden hatanın nerede olduğunu nazikçe belirt (Örn: **"İşlem harika gidiyor ama -5 ile +15'i toplarken küçük bir işaret kaçmış olabilir mi dostum? Bir bak bakalım."**). Başarısını ise coşkuyla tebrik et.

Anlaşılır Markdown yapısı kur, anahtar kavramları kalınlaştır ve her cevabının sonunda öğrenciyi bir sonraki adıma teşvik et!`;

// API route for the Socratic Math Tutor sessions
app.post("/api/tutor", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
    }

    const ai = getGenAI();

    // Send multi-turn contents to the model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messages,
      config: {
        systemInstruction: socraticSystemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "I was unable to formulate a response. Let's try re-centering our thoughts and looking at the problem once more!";
    res.json({ text });
  } catch (err: any) {
    console.error("Error in Socratic tutor session API:", err);
    res.status(500).json({ error: err.message || "An error occurred during your tutoring session." });
  }
});

// Start server containing Vite middlewares or static builds
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
