'use client';
import React, { useEffect } from 'react';
import {
  X, Mail, Linkedin, Phone, MessageCircle, Instagram,
  Twitter, Globe, ChevronLeft, ChevronRight, Copy, Sparkles
} from 'lucide-react';

interface Contact {
  id: number;
  nome: string;
  email?: string;
  linkedin?: string;
  empresa?: string;
  cargo?: string;
  role: string;
  whatsapp?: string;
  foto?: string;
  leadScore?: number;
}

interface ProfileModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalContacts?: number;
}

export function ProfileModal({
  contact, isOpen, onClose, onPrev, onNext, currentIndex, totalContacts
}: ProfileModalProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !contact) return null;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'organizer': return 'bg-blue-500/20 text-blue-400';
      case 'judge': return 'bg-orange-500/20 text-orange-400';
      case 'sponsor': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[var(--bg-secondary)] rounded-3xl overflow-hidden shadow-2xl">
        {/* Header com gradiente */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40">
            <X className="h-5 w-5 text-theme" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-12 relative z-10">
          {contact.foto ? (
            <img src={contact.foto} alt={contact.nome} className="w-24 h-24 rounded-full border-4 border-[var(--bg-secondary)] object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-secondary)] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-theme">
              {getInitials(contact.nome)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-[var(--text)]">{contact.nome}</h2>
          {contact.cargo && <p className="text-[var(--text-secondary)]">{contact.cargo}</p>}
          {contact.empresa && <p className="text-[var(--text-tertiary)] text-sm">{contact.empresa}</p>}

          {/* Role Badge */}
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(contact.role)}`}>
            {contact.role}
          </span>

          {/* Lead Score */}
          {contact.leadScore && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-secondary)]">Lead Score</span>
                <span className="text-[var(--text)]">{contact.leadScore}%</span>
              </div>
              <div className="h-2 bg-[var(--fill-tertiary)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${contact.leadScore >= 60 ? 'bg-red-500' : contact.leadScore >= 35 ? 'bg-orange-500' : 'bg-cyan-500'}`}
                  style={{ width: `${contact.leadScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="flex justify-center gap-3 mt-6">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30">
                <Mail className="h-5 w-5" />
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" className="p-3 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {contact.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" className="p-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <MessageCircle className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 py-2 px-4 rounded-xl bg-[var(--fill-tertiary)] text-[var(--text)] hover:bg-[var(--fill-secondary)] flex items-center justify-center gap-2">
              <Copy className="h-4 w-4" /> Copiar Tudo
            </button>
            <button className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-theme flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" /> AI Enrich
            </button>
          </div>
        </div>

        {/* Navigation */}
        {(onPrev || onNext) && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-color)]">
            <button onClick={onPrev} disabled={!onPrev} className="p-2 rounded-lg hover:bg-[var(--fill-tertiary)] disabled:opacity-30">
              <ChevronLeft className="h-5 w-5 text-[var(--text-secondary)]" />
            </button>
            <span className="text-sm text-[var(--text-tertiary)]">
              {currentIndex !== undefined && totalContacts ? `${currentIndex + 1} de ${totalContacts}` : ''}
            </span>
            <button onClick={onNext} disabled={!onNext} className="p-2 rounded-lg hover:bg-[var(--fill-tertiary)] disabled:opacity-30">
              <ChevronRight className="h-5 w-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        )}

        {/* Keyboard Hints */}
        <div className="px-6 pb-4 flex justify-center gap-4 text-xs text-[var(--text-tertiary)]">
          <span>← Anterior</span>
          <span>→ Próximo</span>
          <span>Esc Fechar</span>
        </div>
      </div>
    </div>
  );
}
