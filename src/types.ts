export interface ChatPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface ChatMessage {
  role: "user" | "model";
  parts: ChatPart[];
}

export interface UIMessage {
  id: string;
  role: "user" | "model";
  text: string;
  image?: string; // Optional Base64 data URL for display
  timestamp: Date;
  isHint?: boolean;
  isWhyQuestion?: boolean;
}

export interface MathPreset {
  id: string;
  title: string;
  topic: "Algebra" | "Calculus-Limits" | "Calculus-Derivatives";
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  imageUrl: string; // Base64 SVG or placeholder for display
  base64Data: string; // Clean Base64 image payload (without metadata prefix)
  mimeType: string;
}
