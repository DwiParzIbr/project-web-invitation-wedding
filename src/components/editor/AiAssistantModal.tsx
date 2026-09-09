'use client';

import React, { useState } from 'react';
import { Sparkles, X, Wand2, FileText, CheckCircle2, RefreshCw, Layers, Copy, Check, MessageSquare, Calendar, HeartHandshake, Clock } from 'lucide-react';
import { AiEngine, AiDesignPreset } from '@/lib/ai-engine';
import { DesignSchema, MagicDesignScore } from '@/types/wedding';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchema: DesignSchema;
  onApplySchema: (newSchema: DesignSchema) => void;
  groomName: string;
  brideName: string;
  onApplyCopywriting: (copy: { quoteText: string; quoteSource: string; openingText: string; loveStory: any[] }) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  currentSchema,
  onApplySchema,
  groomName,
  brideName,
  onApplyCopywriting,
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'copywriting' | 'magic' | 'replies' | 'rundown'>('design');
  const [presets] = useState<AiDesignPreset[]>(() => AiEngine.getPresets());

  // Design Prompt State
  const [designPrompt, setDesignPrompt] = useState('');
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);
  const [previewSchema, setPreviewSchema] = useState<DesignSchema | null>(null);

  // Copywriting State
  const [copyTheme, setCopyTheme] = useState<'Islami' | 'Formal' | 'Romantis' | 'Modern' | 'Adat'>('Islami');
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [copiedWaText, setCopiedWaText] = useState(false);

  // Magic Score State
  const [score, setScore] = useState<MagicDesignScore>(() => AiEngine.evaluateDesignScore(currentSchema));

  // Auto-Reply State
  const [wishReplies] = useState(() => AiEngine.generateWishReplies(groomName, brideName));
  const [copiedReplyIndex, setCopiedReplyIndex] = useState<number | null>(null);

  // Event Rundown State
  const [rundownList] = useState(() => AiEngine.generateRundown());
  const [copiedRundown, setCopiedRundown] = useState(false);

  if (!isOpen) return null;

  const handleGenerateDesign = (promptText?: string) => {
    const finalPrompt = promptText || designPrompt;
    if (!finalPrompt.trim()) return;

    setIsGeneratingDesign(true);

    setTimeout(() => {
      const schema = AiEngine.generateDesignSchema({ prompt: finalPrompt });
      setPreviewSchema(schema);
      setIsGeneratingDesign(false);
    }, 400);
  };

  const handleGenerateCopy = () => {
    const copy = AiEngine.generateCopywriting({ groomName, brideName, theme: copyTheme });
    setGeneratedCopy(copy);
  };

  const handleAutoImproveDesign = () => {
    const improved = AiEngine.autoImproveDesign(currentSchema);
    onApplySchema(improved);
    setScore(AiEngine.evaluateDesignScore(improved));
  };

  const handleCopyWaText = () => {
    if (!generatedCopy?.whatsappTemplate) return;
    navigator.clipboard.writeText(generatedCopy.whatsappTemplate);
    setCopiedWaText(true);
    setTimeout(() => setCopiedWaText(false), 3000);
  };

  const handleCopyReplyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedReplyIndex(index);
    setTimeout(() => setCopiedReplyIndex(null), 3000);
  };

  const handleCopyRundown = () => {
    const formattedRundown = rundownList
      .map((item) => `• ${item.time}\n  ${item.activity} (${item.note})`)
      .join('\n\n');
    navigator.clipboard.writeText(`RUNDOWN ACARA PERNIKAHAN:\n\n${formattedRundown}`);
    setCopiedRundown(true);
    setTimeout(() => setCopiedRundown(false), 3000);
  };

  const handleFixContrast = () => {
    const updated = AiEngine.fixContrastAndReadability(currentSchema);
    onApplySchema(updated);
    setScore(AiEngine.evaluateDesignScore(updated));
  };

  const handleFixFonts = () => {
    const updated = AiEngine.fixTypographyPairing(currentSchema);
    onApplySchema(updated);
    setScore(AiEngine.evaluateDesignScore(updated));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92dvh] text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold font-playfair text-white flex items-center gap-2 truncate">
                Weddora Studio Designer Suite
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">Asisten cerdas rancangan desain, isi undangan & rundown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-2 sm:px-6 text-xs font-bold overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('design')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'design'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Studio Desain</span>
          </button>

          <button
            onClick={() => setActiveTab('copywriting')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'copywriting'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kata Mutiara & WA</span>
          </button>

          <button
            onClick={() => setActiveTab('magic')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'magic'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quality Score ({score.overall})</span>
          </button>

          <button
            onClick={() => setActiveTab('replies')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'replies'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Balas Doa</span>
          </button>

          <button
            onClick={() => setActiveTab('rundown')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'rundown'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rundown</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-slate-300">
          {/* TAB 1: STUDIO DESIGN SCHEMA */}
          {activeTab === 'design' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  1. Pilih Preset Gaya Desain Eksklusif:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setDesignPrompt(preset.prompt);
                        handleGenerateDesign(preset.prompt);
                      }}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/5 text-left transition-all group"
                    >
                      <span className="text-xl block mb-1">{preset.icon}</span>
                      <h5 className="font-bold text-[11px] text-white truncate group-hover:text-purple-300">
                        {preset.name}
                      </h5>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Atau Tulis Konsep Desain:
                </label>
                <textarea
                  value={designPrompt}
                  onChange={(e) => setDesignPrompt(e.target.value)}
                  placeholder="Contoh: Saya ingin undangan pernikahan mewah warna champagne dan emas, minimalis tetapi anggun..."
                  className="w-full h-20 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={() => handleGenerateDesign()}
                disabled={isGeneratingDesign || !designPrompt.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 font-bold text-xs text-white shadow-xl shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingDesign ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Merancang Skema Warna & Font...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Terapkan Skema Desain Studio</span>
                  </>
                )}
              </button>

              {previewSchema && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5 animate-fadeIn">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Preview Skema Warna & Tipografi:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: previewSchema.theme.primary }} />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Primary Color</span>
                        <span className="font-mono font-bold text-white text-[11px]">{previewSchema.theme.primary}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: previewSchema.theme.background }} />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Background</span>
                        <span className="font-mono font-bold text-white text-[11px]">{previewSchema.theme.background}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Heading Font:</span>
                    <span className="font-bold text-gold-400 font-playfair">{previewSchema.fonts.heading}</span>
                  </div>
                  <button
                    onClick={() => {
                      onApplySchema(previewSchema);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terapkan Desain Ini ke Editor</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI COPYWRITING */}
          {activeTab === 'copywriting' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Pilih Nuansa Teks Undangan:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['Islami', 'Romantis', 'Formal', 'Modern', 'Adat'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCopyTheme(t)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        copyTheme === t
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateCopy}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Teks Undangan, Quotes & Template WA</span>
              </button>

              {generatedCopy && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs animate-fadeIn">
                  <div>
                    <span className="font-bold text-purple-400 block mb-1">Quote / Ayat Suci:</span>
                    <p className="italic text-slate-200">"{generatedCopy.quoteText}"</p>
                    <span className="text-slate-400 block text-[10px] mt-0.5 font-mono">{generatedCopy.quoteSource}</span>
                  </div>

                  <div>
                    <span className="font-bold text-purple-400 block mb-1">Teks Kata Pembuka:</span>
                    <p className="text-slate-200 leading-relaxed">{generatedCopy.openingText}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Template Pesan Broadcast WhatsApp:
                      </span>
                      <button
                        onClick={handleCopyWaText}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                      >
                        {copiedWaText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedWaText ? 'Tersalin!' : 'Salin Text WA'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {generatedCopy.whatsappTemplate}
                    </pre>
                  </div>

                  <button
                    onClick={() => {
                      onApplyCopywriting(generatedCopy);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Gunakan Teks Ini Pada Editor</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MAGIC DESIGN SCORE DASHBOARD */}
          {activeTab === 'magic' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Gauge & Overview Card */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Score Gauge Circle */}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-1 flex items-center justify-center shadow-2xl shadow-purple-500/30 shrink-0 animate-pulse">
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-center p-2">
                    <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{score.overall}</span>
                    <span className="text-[9px] text-purple-300 uppercase font-bold tracking-widest">Score / 100</span>
                  </div>
                </div>

                {/* Granular Breakdown Bars */}
                <div className="flex-1 w-full space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      Weddora Magic Quality Index:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      score.overall >= 95
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : score.overall >= 85
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {score.overall >= 95 ? '✨ PERFECT VIP DESIGN' : score.overall >= 85 ? '🌟 EXCELLENT QUALITY' : '👍 GOOD DESIGN'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-400">✒️ Typography & Font Harmony</span>
                        <span className="text-purple-300 font-mono font-bold">{score.typography}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all duration-700" style={{ width: `${score.typography}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-400">🎨 Color Contrast & Luminance</span>
                        <span className="text-gold-400 font-mono font-bold">{score.colorHarmony}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-gradient-to-r from-amber-500 to-gold-400 h-full rounded-full transition-all duration-700" style={{ width: `${score.colorHarmony}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-400">📱 Mobile Spacing & Ergonomics</span>
                        <span className="text-emerald-400 font-mono font-bold">{score.mobileUx}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-700" style={{ width: `${score.mobileUx}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-400">📐 Visual Hierarchy & Card Separation</span>
                        <span className="text-blue-400 font-mono font-bold">{score.visualHierarchy}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-700" style={{ width: `${score.visualHierarchy}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Palette Swatches Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider shrink-0">Live Palette Evaluation:</span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentSchema.theme.primary }} />
                    <span className="font-mono text-[10px] text-slate-300">Primary</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentSchema.theme.background }} />
                    <span className="font-mono text-[10px] text-slate-300">Background</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentSchema.theme.cardBg }} />
                    <span className="font-mono text-[10px] text-slate-300">CardBg</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentSchema.theme.accent }} />
                    <span className="font-mono text-[10px] text-slate-300">Accent</span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Recommendations */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Hasil Analisis Desain & Saran Optimasi:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {score.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/90 shadow-sm">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Optimization Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAutoImproveDesign}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-gold-500 to-gold-600 text-slate-950 font-extrabold text-xs shadow-xl shadow-gold-500/25 flex items-center justify-center gap-2 hover:from-amber-400 hover:to-gold-500 transition-all border border-gold-400/50"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>1-Click Master Auto Improve (Capai Score 98-100)</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
                  <button
                    onClick={handleFixContrast}
                    className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🎨 Fix Kontras Kartu</span>
                  </button>
                  <button
                    onClick={handleFixFonts}
                    className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>✒️ Fix Font Pairing</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLATE BALAS DOA & UCAPAN */}
          {activeTab === 'replies' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" /> Template Generator Balas Ucapan & Doa RSVP
                </h3>
                <p className="text-xs text-slate-400">
                  Template balasan santun & ramah dari pengantin untuk membalas ucapan selamat dari tamu di WhatsApp atau buku tamu:
                </p>
              </div>

              <div className="space-y-3">
                {wishReplies.map((reply, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                          {reply.category}
                        </span>
                        {reply.title}
                      </span>
                      <button
                        onClick={() => handleCopyReplyText(reply.text, idx)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-purple-600 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 border border-slate-700"
                      >
                        {copiedReplyIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedReplyIndex === idx ? 'Tersalin!' : 'Salin Balasan'}</span>
                      </button>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      "{reply.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RUNDOWN EVENT PLANNER */}
          {activeTab === 'rundown' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Wedding Event Rundown Planner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Rancangan susunan acara & rundown waktu akad nikah hingga resepsi pernikahan:
                  </p>
                </div>

                <button
                  onClick={handleCopyRundown}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-1.5 transition-all shrink-0"
                >
                  {copiedRundown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRundown ? 'Tersalin!' : 'Salin Seluruh Rundown'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {rundownList.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5 text-xs">
                    <div className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold shrink-0 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{item.time}</span>
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-white text-xs">{item.activity}</h5>
                      <p className="text-[11px] text-slate-400">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
