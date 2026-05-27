import React, { useState, useEffect, useRef } from "react";
import { Upload, Clipboard, Compass, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DropzoneProps {
  onImageSelected: (base64Data: string, mimeType: string, imageUrl: string) => void;
  isLoading: boolean;
}

export default function Dropzone({ onImageSelected, isLoading }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle clipboard paste across the screen
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isLoading]);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Yalınızca geçerli bir resim dosyası seçin (PNG, JPG, WEBP veya SVG).");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Extract raw base64 data and mime type
        const match = result.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const rawBase64 = match[2];
          onImageSelected(rawBase64, mimeType, result);
        } else {
          setErrorMessage("Görsel işlenirken hata oluştu. Lütfen başka bir ekran görüntüsü deneyin.");
        }
      }
    };
    reader.onerror = () => {
      setErrorMessage("Dosya okunurken bir hata oluştu.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isLoading) return;
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        id="dropzone-container"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[220px] ${
          isDragActive
            ? "border-emerald-500 bg-emerald-50/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]Scale-98"
            : "border-slate-300 hover:border-slate-400 bg-white/70 hover:bg-white/90 shadow-sm"
        } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="mb-4 p-4 rounded-full bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
          <Upload className="h-8 w-8" />
        </div>

        <h3 className="font-sans font-semibold text-lg text-slate-800 mb-1">
          Matematik Problemi Yükleyin
        </h3>
        
        <p className="font-sans text-sm text-slate-500 max-w-sm mb-4">
          Bir resmi sürükleyip bırakın, göz atmak için tıklayın veya doğrudan bir <span className="font-medium text-emerald-600">ekran görüntüsü yapıştırın</span> (Ctrl+V).
        </p>

        <div className="flex flex-wrap gap-2 justify-center items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
            <Clipboard className="h-3 w-3" /> yapıştırma desteklenir (Ctrl+V)
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-mono">
            <Sparkles className="h-3 w-3" /> cebir / limit / türev
          </div>
        </div>

        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl bg-emerald-600/5 backdrop-blur-[1px] flex items-center justify-center"
          >
            <p className="text-emerald-700 font-medium font-sans flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Compass className="h-5 w-5 animate-spin" /> Görseli buraya bırakın!
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-red-500 text-sm mt-3 font-sans text-center font-medium bg-red-50 py-2 px-4 rounded-lg"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
