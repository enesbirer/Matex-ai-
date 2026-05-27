import React from "react";
import Markdown from "react-markdown";
import { UIMessage } from "../types";
import { Sparkles, MessageCircle, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface SocraticMessageProps {
  message: UIMessage;
}

export default function SocraticMessage({ message }: SocraticMessageProps) {
  const isModel = message.role === "model";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`flex w-full gap-4 ${isModel ? "justify-start" : "justify-end"} mb-6`}
    >
      {isModel && (
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm border border-emerald-200/55">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      )}

      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 ${
        isModel
          ? "bg-white border border-slate-100 shadow-sm text-slate-800"
          : "bg-emerald-600 text-white shadow-sm"
      }`}>
        {/* Render associated uploaded image preview if it's the student's first upload */}
        {message.image && (
          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 max-h-[220px] flex items-center justify-center shadow-inner">
            <img
              src={message.image}
              alt="Uploaded mathematical equation"
              className="max-h-[220px] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-mono font-medium tracking-wide uppercase ${
            isModel ? "text-emerald-700" : "text-emerald-100/90"
          }`}>
            {isModel ? "Öğretmen Patientia" : "Öğrenci"}
          </span>
          {message.isWhyQuestion && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-mono leading-none">
              <HelpCircle className="h-3 w-3" /> Temel Kavram Sorgusu
            </span>
          )}
          {message.isHint && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-mono leading-none">
              <Sparkles className="h-3 w-3" /> İpucu Talebi
            </span>
          )}
        </div>

        {/* Content Box with React Markdown */}
        <div className={`font-sans leading-relaxed text-sm ${isModel ? "text-slate-700" : "text-white prose-invert"}`}>
          {isModel ? (
            <div className="markdown-body text-slate-700 prose max-w-none">
              <Markdown
                components={{
                  // Enhance rendering styles of various tags inside markdown
                  p: ({ children }) => <p className="mb-3 last:mb-0 text-slate-700 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 text-slate-700">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 text-slate-700">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-slate-900 bg-emerald-50 px-1 rounded border border-emerald-100/50">{children}</strong>,
                  code: ({ children }) => <code className="font-mono bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-xs select-all">{children}</code>
                }}
              >
                {message.text}
              </Markdown>
            </div>
          ) : (
            <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={`text-[10px] font-mono ${isModel ? "text-slate-400" : "text-emerald-200/80"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {!isModel && (
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-emerald-100 shadow-sm">
            <MessageCircle className="h-5 w-5" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
