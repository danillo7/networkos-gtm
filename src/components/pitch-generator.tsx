/**
 * NetworkOS - Pitch Generator Component
 * AI-powered pitch generation interface
 */

'use client';

import * as React from 'react';
import {
  Sparkles,
  Mail,
  Linkedin,
  Phone,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { Company, Contact, GeneratedPitch, PitchType, PitchTone } from '@/api/lib/types';

interface PitchGeneratorProps {
  company: Company;
  contacts?: Contact[];
  onGenerate: (options: PitchOptions) => Promise<GeneratedPitch>;
  onSavePitch?: (pitch: GeneratedPitch) => void;
  isLoading?: boolean;
}

interface PitchOptions {
  type: PitchType;
  tone: PitchTone;
  contactId?: string;
  focusProducts?: string[];
  length: 'short' | 'medium' | 'long';
}

const PITCH_TYPES: Array<{ value: PitchType; label: string; icon: React.ReactNode }> = [
  { value: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
  { value: 'call_script', label: 'Call Script', icon: <Phone className="h-4 w-4" /> },
];

const PITCH_TONES: Array<{ value: PitchTone; label: string; description: string }> = [
  { value: 'Professional', label: 'Professional', description: 'Formal and business-focused' },
  { value: 'Friendly', label: 'Friendly', description: 'Warm and conversational' },
  { value: 'Technical', label: 'Technical', description: 'Detail-oriented for tech audience' },
  { value: 'Executive', label: 'Executive', description: 'Concise for C-level' },
];

const ELEVENLABS_PRODUCTS = [
  'Text to Speech API',
  'Voice Cloning',
  'Conversational AI',
  'AI Dubbing',
  'Sound Effects Generation',
];

export function PitchGenerator({
  company,
  contacts = [],
  onGenerate,
  onSavePitch,
  isLoading = false,
}: PitchGeneratorProps) {
  const [selectedType, setSelectedType] = React.useState<PitchType>('email');
  const [selectedTone, setSelectedTone] = React.useState<PitchTone>('Professional');
  const [selectedContact, setSelectedContact] = React.useState<string | undefined>(
    contacts[0]?.id
  );
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [length, setLength] = React.useState<'short' | 'medium' | 'long'>('medium');
  const [generatedPitch, setGeneratedPitch] = React.useState<GeneratedPitch | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const pitch = await onGenerate({
        type: selectedType,
        tone: selectedTone,
        contactId: selectedContact,
        focusProducts: selectedProducts.length > 0 ? selectedProducts : undefined,
        length,
      });
      setGeneratedPitch(pitch);
    } catch (error) {
      console.error('Failed to generate pitch:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPitch) return;

    const textToCopy = generatedPitch.subject
      ? `Subject: ${generatedPitch.subject}\n\n${generatedPitch.body}`
      : generatedPitch.body;

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const selectedContactData = contacts.find((c) => c.id === selectedContact);

  return (
    <div className="space-y-4">
      {/* Configuration Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate Pitch
              </CardTitle>
              <CardDescription>
                Create personalized outreach for {company.name}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pitch Type Selection */}
          <div className="flex gap-2">
            {PITCH_TYPES.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className="flex-1"
              >
                {type.icon}
                <span className="ml-2">{type.label}</span>
              </Button>
            ))}
          </div>

          {/* Contact Selection */}
          {contacts.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Target Contact</label>
              <select
                value={selectedContact || ''}
                onChange={(e) => setSelectedContact(e.target.value || undefined)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Generic (no specific contact)</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.fullName} - {contact.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Advanced Settings */}
          {showSettings && (
            <div className="space-y-4 pt-4 border-t">
              {/* Tone Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {PITCH_TONES.map((tone) => (
                    <Button
                      key={tone.value}
                      variant={selectedTone === tone.value ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedTone(tone.value)}
                      className="justify-start"
                    >
                      <div className="text-left">
                        <div className="font-medium">{tone.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {tone.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Length</label>
                <div className="flex gap-2">
                  {(['short', 'medium', 'long'] as const).map((l) => (
                    <Button
                      key={l}
                      variant={length === l ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setLength(l)}
                      className="flex-1 capitalize"
                    >
                      {l}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Product Focus */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Focus Products (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ELEVENLABS_PRODUCTS.map((product) => (
                    <Badge
                      key={product}
                      variant={selectedProducts.includes(product) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleProduct(product)}
                    >
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={generating || isLoading}
            loading={generating}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate {selectedType === 'email' ? 'Email' : selectedType === 'linkedin' ? 'LinkedIn Message' : 'Call Script'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Pitch Card */}
      {generatedPitch && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Generated Pitch</CardTitle>
                <CardDescription>
                  {generatedPitch.type} - {generatedPitch.tone} tone
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <RefreshCw className={cn('h-4 w-4', generating && 'animate-spin')} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Subject Line */}
            {generatedPitch.subject && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Subject
                </label>
                <p className="mt-1 font-medium">{generatedPitch.subject}</p>
              </div>
            )}

            {/* Body */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                {generatedPitch.type === 'call_script' ? 'Script' : 'Body'}
              </label>
              <div className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm">
                {generatedPitch.body}
              </div>
            </div>

            {/* Hooks */}
            {generatedPitch.hooks && generatedPitch.hooks.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Alternative Hooks
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {generatedPitch.hooks.map((hook, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {hook}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Products Referenced */}
            {generatedPitch.elevenlabsProducts && generatedPitch.elevenlabsProducts.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Products Referenced
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {generatedPitch.elevenlabsProducts.map((product, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {product.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-1 h-3 w-3" />
                  Good
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="mr-1 h-3 w-3" />
                  Improve
                </Button>
              </div>
              <Button
                size="sm"
                onClick={() => onSavePitch?.(generatedPitch)}
              >
                Save Pitch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PitchGenerator;
