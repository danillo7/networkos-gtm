/**
 * Pitches View Component
 * AI-powered pitch generation interface
 */

'use client';

import * as React from 'react';
import {
  Sparkles,
  Mail,
  Linkedin,
  Phone,
  Building2,
  User,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  ChevronDown,
  Send,
  Loader2,
  AlertCircle,
  MessageSquare,
  Mic,
  Video,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGeneratePitch } from '@/hooks/useApi';

// ElevenLabs products
const ELEVENLABS_PRODUCTS = [
  { id: 'tts', name: 'Text to Speech', icon: Mic },
  { id: 'cloning', name: 'Voice Cloning', icon: User },
  { id: 'conversational', name: 'Conversational AI', icon: MessageSquare },
  { id: 'dubbing', name: 'AI Dubbing', icon: Video },
  { id: 'sfx', name: 'Sound Effects', icon: Zap },
];

// Sample company for demo
const SAMPLE_COMPANY = {
  id: '1',
  name: 'TechCorp Inc',
  domain: 'techcorp.com',
  industry: 'Technology',
  size: '201-500',
  description: 'Enterprise software solutions for modern businesses',
  products: [{ name: 'CloudSuite', description: 'Cloud management platform' }],
  techStack: ['React', 'Node.js', 'AWS'],
};

const SAMPLE_CONTACT = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Chen',
  fullName: 'Sarah Chen',
  title: 'CTO',
  email: 'sarah.chen@techcorp.com',
};

interface GeneratedPitchData {
  id: string;
  type: string;
  subject?: string;
  body: string;
  hooks: string[];
  elevenlabsProducts: Array<{ name: string; relevance: number }>;
}

export function PitchesView() {
  // Form state
  const [pitchType, setPitchType] = React.useState<'email' | 'linkedin' | 'call_script'>('email');
  const [tone, setTone] = React.useState<string>('Professional');
  const [length, setLength] = React.useState<'short' | 'medium' | 'long'>('medium');
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>(['tts', 'conversational']);

  // Generated pitch state
  const [generatedPitch, setGeneratedPitch] = React.useState<GeneratedPitchData | null>(null);
  const [copied, setCopied] = React.useState(false);

  // API hook
  const { loading, error, generate, reset } = useGeneratePitch();

  const handleGenerate = async () => {
    reset();
    setGeneratedPitch(null);

    const result = await generate({
      company: SAMPLE_COMPANY,
      contact: SAMPLE_CONTACT,
      type: pitchType,
      tone,
      length,
      focusProducts: selectedProducts.map(id =>
        ELEVENLABS_PRODUCTS.find(p => p.id === id)?.name || ''
      ).filter(Boolean),
    });

    if (result?.pitch) {
      setGeneratedPitch(result.pitch);
    }
  };

  const handleCopy = () => {
    if (generatedPitch) {
      const text = generatedPitch.subject
        ? `Subject: ${generatedPitch.subject}\n\n${generatedPitch.body}`
        : generatedPitch.body;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">Pitch Generator</h2>
        <p className="text-sm text-white/50">
          Create AI-powered personalized outreach content
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Target Selection */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Target
            </h3>

            <div className="space-y-4">
              {/* Company */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{SAMPLE_COMPANY.name}</p>
                  <p className="text-xs text-white/50">{SAMPLE_COMPANY.industry} • {SAMPLE_COMPANY.size} employees</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-medium">
                  SC
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{SAMPLE_CONTACT.fullName}</p>
                  <p className="text-xs text-white/50">{SAMPLE_CONTACT.title} • {SAMPLE_CONTACT.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pitch Type */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-white/80 mb-4">Pitch Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                { id: 'call_script', label: 'Call Script', icon: Phone },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPitchType(type.id as typeof pitchType)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                    pitchType === type.id
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  )}
                >
                  <type.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Length */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-white/80 mb-4">Tone & Length</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white"
                >
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Technical">Technical</option>
                  <option value="Executive">Executive</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as typeof length)}
                  className="w-full h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white"
                >
                  <option value="short">Short (50-100 words)</option>
                  <option value="medium">Medium (100-200 words)</option>
                  <option value="long">Long (200-350 words)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Focus */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-white/80 mb-4">Products to Highlight</h3>
            <div className="space-y-2">
              {ELEVENLABS_PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                    selectedProducts.includes(product.id)
                      ? 'bg-purple-500/20 border-purple-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  )}
                >
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    selectedProducts.includes(product.id)
                      ? 'bg-purple-500/30 text-purple-400'
                      : 'bg-white/10 text-white/50'
                  )}>
                    <product.icon className="h-4 w-4" />
                  </div>
                  <span className={cn(
                    'text-sm font-medium',
                    selectedProducts.includes(product.id) ? 'text-white' : 'text-white/70'
                  )}>
                    {product.name}
                  </span>
                  {selectedProducts.includes(product.id) && (
                    <Check className="h-4 w-4 text-purple-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full btn-primary h-12 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Pitch
              </>
            )}
          </button>
        </div>

        {/* Right Column - Generated Pitch */}
        <div className="glass-card p-6 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/80 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Generated Pitch
            </h3>
            {generatedPitch && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                  Regenerate
                </button>
              </div>
            )}
          </div>

          {/* Pitch Content */}
          <div className="flex-1 flex flex-col">
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
                  <p className="text-white/70">Creating your personalized pitch...</p>
                  <p className="text-sm text-white/40 mt-1">Analyzing company and contact data</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-white/70">Failed to generate pitch</p>
                  <p className="text-sm text-white/40 mt-1">{error}</p>
                  <button onClick={handleGenerate} className="btn-primary mt-4">
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && !generatedPitch && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg mx-auto mb-4">
                    <Wand2 className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-white/70">Configure your pitch and click Generate</p>
                  <p className="text-sm text-white/40 mt-1">
                    AI will create a personalized message based on company research
                  </p>
                </div>
              </div>
            )}

            {generatedPitch && !loading && (
              <div className="flex-1 flex flex-col">
                {/* Subject Line (for emails) */}
                {generatedPitch.subject && (
                  <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                    <label className="text-xs text-white/50 mb-1 block">Subject</label>
                    <p className="text-white font-medium">{generatedPitch.subject}</p>
                  </div>
                )}

                {/* Body */}
                <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 overflow-auto">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-white/90 leading-relaxed">
                      {generatedPitch.body}
                    </pre>
                  </div>
                </div>

                {/* Products Used */}
                {generatedPitch.elevenlabsProducts && generatedPitch.elevenlabsProducts.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-white/5">
                    <label className="text-xs text-white/50 mb-2 block">Products Referenced</label>
                    <div className="flex flex-wrap gap-2">
                      {generatedPitch.elevenlabsProducts.map((product, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-400"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                    <Wand2 className="h-4 w-4" />
                    Improve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                    <RefreshCw className="h-4 w-4" />
                    Generate Variants
                  </button>
                  <button className="flex-1 btn-primary h-10">
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PitchesView;
