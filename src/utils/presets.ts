import { MathPreset } from "../types";

// Helper to convert inline SVG string to a Base64 data URL
const svgToBase64 = (svg: string): { dataUrl: string; rawBase64: string } => {
  const cleanSvg = svg.trim();
  const rawBase64 = btoa(unescape(encodeURIComponent(cleanSvg)));
  return {
    dataUrl: `data:image/svg+xml;base64,${rawBase64}`,
    rawBase64,
  };
};

const algebraSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#1e293b" rx="12" />
  <!-- Grid pattern background -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" rx="12" />
  
  <!-- Subtle handwritten accent -->
  <path d="M 20 25 L 380 25" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.4" />
  <text x="25" y="45" font-family="'Courier New', monospace" font-size="14" fill="#38bdf8" font-weight="bold">ALGEBRA PRACTICE: PROBLEM #14</text>
  
  <!-- The Equation -->
  <text x="50" y="110" font-family="'Georgia', serif" font-style="italic" font-size="32" fill="#f8fafc">
    3x + 5 = 2(x - 4) + 15
  </text>
  
  <!-- Prompt note -->
  <text x="25" y="150" font-family="'Courier New', monospace" font-size="12" fill="#94a3b8">Solve for x. Show each step logically.</text>
</svg>
`;

const limitsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <!-- Blackboard grid -->
  <defs>
    <pattern id="dots" width="15" height="15" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#1e293b" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#dots)" rx="12" />
  
  <path d="M 20 25 Q 200 15 380 25" stroke="#06b6d4" stroke-width="1" fill="none" opacity="0.3" />
  <text x="25" y="45" font-family="'Courier New', monospace" font-size="14" fill="#2dd4bf" font-weight="bold">CALCULUS I: LIMIT OPERATIONS</text>
  
  <!-- The Equation with correct fractions -->
  <g transform="translate(60, 70)">
    <!-- lim notation -->
    <text x="0" y="30" font-family="'Georgia', serif" font-style="italic" font-weight="500" font-size="28" fill="#f8fafc">lim</text>
    <text x="0" y="48" font-family="'Georgia', serif" font-style="italic" font-size="14" fill="#2dd4bf">x → 3</text>
    
    <!-- Fraction numerator -->
    <text x="65" y="14" font-family="'Georgia', serif" font-style="italic" font-size="26" fill="#f8fafc">x² - 9</text>
    <!-- Fraction line -->
    <line x1="60" y1="23" x2="140" y2="23" stroke="#f8fafc" stroke-width="2" />
    <!-- Fraction denominator -->
    <text x="70" y="47" font-family="'Georgia', serif" font-style="italic" font-size="26" fill="#f8fafc">x - 3</text>
  </g>
  
  <text x="25" y="155" font-family="'Courier New', monospace" font-size="12" fill="#64748b">Evaluate the indeterminate form.</text>
</svg>
`;

const derivativesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#180f2a" rx="12" />
  <defs>
    <pattern id="diagonal" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#251642" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#diagonal)" rx="12" />
  
  <text x="25" y="40" font-family="'Courier New', monospace" font-size="14" fill="#e879f9" font-weight="bold">CALCULUS I: QUOTIENT DERIVATIVE</text>
  
  <!-- The Equation -->
  <g transform="translate(45, 60)">
    <!-- f(x) = -->
    <text x="0" y="40" font-family="'Georgia', serif" font-style="italic" font-size="30" fill="#f8fafc">f(x) =</text>
    
    <!-- Numerator -->
    <text x="90" y="22" font-family="'Georgia', serif" font-style="italic" font-size="28" fill="#f8fafc">eˣ</text>
    <!-- Division line -->
    <line x1="82" y1="31" x2="165" y2="31" stroke="#f8fafc" stroke-width="2" />
    <!-- Denominator -->
    <text x="85" y="58" font-family="'Georgia', serif" font-style="italic" font-size="28" fill="#f8fafc">x² + 1</text>
  </g>
  
  <text x="25" y="150" font-family="'Courier New', monospace" font-size="12" fill="#c084fc">Find f'(x). Don't skip intermediate fields.</text>
</svg>
`;

const resAlgebra = svgToBase64(algebraSvg);
const resLimits = svgToBase64(limitsSvg);
const resDerivatives = svgToBase64(derivativesSvg);

export const mathPresets: MathPreset[] = [
  {
    id: "preset-algebra",
    title: "Doğrusal Cebir Denklemi",
    topic: "Algebra",
    description: "Parantezleri dağıtmayı, x'leri bir tarafa toplamayı ve denklemi adım adım dengelemeyi öğrenin.",
    difficulty: "Beginner",
    imageUrl: resAlgebra.dataUrl,
    base64Data: resAlgebra.rawBase64,
    mimeType: "image/svg+xml",
  },
  {
    id: "preset-limits",
    title: "Belirsiz Limit Durumu",
    topic: "Calculus-Limits",
    description: "Belirsizlik biçimlerini teşhis edin, çarpanlara ayırma yapın ve limiti kolayca hesaplayın.",
    difficulty: "Intermediate",
    imageUrl: resLimits.dataUrl,
    base64Data: resLimits.rawBase64,
    mimeType: "image/svg+xml",
  },
  {
    id: "preset-derivatives",
    title: "Bölümün Türevi Sorusu",
    topic: "Calculus-Derivatives",
    description: "Üstel fonksiyonların rasyonel polinomlara bölümünün türevini adım adım alın.",
    difficulty: "Advanced",
    imageUrl: resDerivatives.dataUrl,
    base64Data: resDerivatives.rawBase64,
    mimeType: "image/svg+xml",
  },
];
