# 🎓 Matex ai - Şefkatli, Sokratik Yapay Zeka Matematik Öğretmeni

> **Matematik ezberlenecek bir formül yığını değil, keşfedilecek bir mantık yolculuğudur.** 
> Matex ai, size sadece nihai sonucu fırlatan soğuk hesap makinelerinin aksine; yanınızda oturan, şefkatli, cana yakın ve her adımda *"neden"* yaptığımızı sabırla açıklayan gerçek bir özel öğretmen deneyimi sunar.

---

## 👨‍💻 Geliştirici Hakkında / Aday Profil

**Merhaba! Ben Enes.** 

> **Amasya Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim.** Backend geliştirme, web/mobil uygulamalar ve yapay zeka/makine öğrenmesi teknolojilerine odaklanıyorum. Node.js, Django ve Flutter mimarileriyle pratik projeler üretiyor; Hugging Face üzerinde Türkçe doğal dil işleme (NLP) modelleri geliştiriyorum. Güçlü analitik düşünme ve takım çalışmasına yatkınlığımla, şirketinize değer katabileceğim bir **Yaz Stajı pozisyonu** arıyorum.

Gerek bu proje gerekse yaptığım diğer çalışmalar, eğitim teknolojileri (EdTech) ve yapay zeka entegrasyonu konusundaki vizyonumu, temiz kod yazma pratiklerimi ve kullanıcı dostu arayüz tasarımı konusundaki hassasiyetimi yansıtmaktadır. Benimle iletişime geçmek, projelerimi incelemek veya staj süreçlerini görüşmek için her zaman açığım!

---

## 🎯 Projenin Amacı ve Felsefesi

Geleneksel yapay zeka çözümleri bir matematik sorusu gördüğünde tüm adımları ve son sonucu tek bir saniyede ekrana dökerek öğrencinin düşünme, sorgulama ve problem çözme kaslarını tembelleştirir. 

**Matex ai** ise **Sokratik Eğitim Modelini** benimser:
- Soruyu analiz eder ama cevabı bir sır olarak saklar.
- Çözümün **sadece ilk adımını** anlatır ve öğrenciyi bir sonraki hamle için düşünmeye teşvik edecek tatlı bir soru yöneltir.
- Öğrencinin aktif katılımını zorunlu tutarak gerçek öğrenmeyi tetikler.

---

## ✨ Şimdi Ne Yapıyor? (Aktif Özellikler)

🚀 **Gelişmiş Görsel Matematik Analizi:** Kalkülüs (Limit, Türev, İntegral) ve doğrusal cebir gibi karmaşık konular içeren el yazısı veya basılı kitap sorularının ekran görüntülerini anında analiz eder.
🧼 **Temiz Sembol Gösterim Havuzu:** Öğrencilerin gözünü korkutan karmaşık, okunması zor LaTeX formülleri veya çift dolar (`$$`) ifadeleri yerine; tamamen Türkçeleştirilmiş, sadeleştirilmiş ve özel unicode sembol havuzumuzdan (², ³, ₄, √, ∫, dy/dx vb.) beslenen temiz matematik gösterimleri sunar.
❓ **"Neden Öyle Yaptık?" Mekanizması:** Öğrencinin tıkandığı an saniyeler içinde o adımdaki temel matematiksel mantığı, formüllerin kaynağını günlük yaşam analojileri ile açıklayan dinamik sorgu yapısı içermektedir.
💡 **İnteraktif Sokratik Butonlar:**
- *Neden öyle yaptık?* (Kavramsal derin açıklamalar üretir)
- *Bana küçük bir ipucu ver* (Çözümü sızdırmadan yönlendirir)
- *Günlük hayattan benzetme yap* (Soyut matematiği somutlaştırır)
- *Mevcu satırımı kontrol et* (Öğrencinin kendi çözüm satırını kontrol edip teşvik eder)
📋 **Üç Kolay Girdi Yöntemi:** Resimleri klasik dosya seçme yöntemi ile yükleyebilir, sürükleyip bırakabilir veya doğrudan panonuzdan (`Ctrl+V`) kopyalayıp anında derse başlayabilirsiniz.
🛠️ **Hazır Kara Tahta Örnekleri:** Sistemi anında test etmeniz için başlangıç, orta ve ileri düzeyde doğrusal cebir, limit belirsizlikleri ve bölüm türevi konularını içeren hazır interaktif test materyalleri sunar.

---

## 🚀 Gelecekte Ne Yapabilir? (Roadmap & Vizyon)

Matex ai, dinamik geliştirme yapısı sayesinde gelecekte şu vizyoner özelliklere kavuşacak şekilde tasarlanmıştır:

1. **Gerçek Zamanlı Karalama Defteri (Handwriting Recognition Notepad):** Öğrenci tarayıcı üzerinde entegre bir tuvalde (canvas) çözümü eliyle yazarken yapay zeka her satırı gerçek zamanlı kontrol edecek.
2. **Kişiselleştirilmiş Öğrenme Analitiği ve Dashboard:** Öğrencinin takıldığı konuları (örn. *zincir kuralından kaç kez sapan işlem yapıldı*) raporlayan ve veli/öğretmen paneline sunan analiz motoru.
3. **Sesli Sokratik Mentor (Voice-Guided Classroom):** Öğretmen Patientia ile gerçek zamanlı konuşarak, sesli soru sorup sesli dönütler alabileceğiniz iki yönlü ses iletişimi (SST/TTS entegrasyonu).
4. **Çoklu Öğrenci Çalışma Odaları:** Sınıf arkadaşlarının aynı tahtada birlikte Sokratik tartışarak soru çözebileceği bir WebSoket çoklu oyuncu ortamı.

---

## 🛠️ Teknik Detaylar & Sistem Mimarisi

Matex ai, güncel kararlı kütüphaneler ve yüksek güvenlikli sunucu mimarisi kullanılarak sıfırdan TypeScript ile geliştirilmiştir:

- **Frontend (Önyüz):** React 19, Vite, TypeScript, Tailwind CSS, Motion (Akıcı sayfa geçişleri ve mikro etkileşimler için).
- **Backend (Sunucu):** Node.js & Express. Gönderilen base64 görselleri taşımak üzere 10MB veri limitli güvenli parser katmanları mevcuttur.
- **Esbuild Derleme Sistemi:** Sunucu tarafındaki TypeScript kodunu, Node'un katı ES Module kısıtlamalarına takılmadan tek bir bağımsız `dist/server.cjs` dosyasına paketler. Bu sayede soğuk başlatma (cold start) sürelerini sıfıra indirir.
- **Yapay Zeka & LLM:** Google'ın en yeni `@google/genai` resmi TypeScript SDK'sı aracılığıyla **Gemini 3.5 Flash** modeli kullanılmıştır.
- **API Key Güvenliği:** API anahtarının kulllanıcı tarayıcısına asla sızmaması için full-stack (`server + client`) proxy mimarisi kurulmuştur. Tüm istekler sunucu üzerinden geçmektedir.

---

## 🤝 Sponsorlar, Yatırımcılar ve Kariyer Fırsatları İçin Çağrı

Eğitim teknolojilerinde ezberci zihniyete meydan okumak ve yapay zekayı öğrencileri sadece "cevap kopyalamaya" değil, "gerçekten anlamaya" yönlendiren akıllı bir araç haline getirmek istiyoruz.

- **Şirketler & HR Yöneticileri İçin:** Yazılım ekiplerinize değer katacak, öğrenmeye tutkulu, analitik düşünen ve modern yapay zeka mimarilerine hakim bir **Yaz Stajyeri (Amasya Üni. Bilgisayar Müh. 3. Sınıf)** arayışındaysanız, benimle iletişime geçmekten çekinmeyin!
- **Sponsorlar & Yatırımcılar İçin:** EdTech alanında fark yaratacak bir projeye destek olmak, kendi platformlarınıza Sokratik öğrenme modülleri entegre etmek veya Matex ai projesini daha geniş öğrenci kitlelerine ulaştırmak için maddi/altyapısal sponsor olabilirsiniz.

📧 **İletişim E-posta:** [enesbirer5151@gmail.com](mailto:enesbirer5151@gmail.com)

---

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak oldukça basittir:

1. **Depoyu Klonlayın:**
   ```bash
   git clone <github-depo-linkiniz>
   cd matex-ai
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevre Değişkenlerini Tanımlayın:**
   `.env.example` dosyasını `.env` olarak kopyalayın ve içine Google AI Studio'dan aldığınız Gemini API anahtarınızı girin:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```

4. **Geliştirici Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   Uygulamanız tarayıcıda `http://localhost:3000` adresinde hazır olacaktır!

5. **Üretim (Production) Sürümü Oluşturun:**
   ```bash
   npm run build
   npm start
   ```

---

Matematik korkulacak bir şey değildir, sadece doğru öğretmenle karşılaşmamışsınızdır. **Matex ai** ile matematik kaslarınızı güçlendirmeye hemen başlayın! 🚀
