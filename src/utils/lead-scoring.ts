/**
 * NetworkOS GTM - Lead Scoring System
 * Calculates lead scores based on role, job title, company, and contact completeness
 */

import { HackathonContact } from '@/data/hackathon-contacts';

// Score weights configuration
const SCORE_WEIGHTS = {
  // Role-based scoring
  role: {
    participant: 30,
    judge: 25,
    organizer: 20,
    sponsor: 15,
  },

  // Job title keywords
  jobTitle: {
    // Technical leadership
    cto: 30,
    'tech lead': 28,
    'engineering director': 28,
    'vp engineering': 28,

    // AI/ML specialists (highest value for voice AI product)
    'ai': 35,
    'ml': 35,
    'machine learning': 35,
    'voice': 35,
    'speech': 35,
    'nlp': 35,
    'llm': 35,

    // Developers (core users)
    developer: 35,
    engineer: 35,
    programmer: 30,

    // Founders & executives
    founder: 25,
    'co-founder': 25,
    ceo: 25,
    coo: 20,

    // Product roles
    'product manager': 20,
    'product owner': 20,

    // Other technical roles
    architect: 25,
    devops: 20,
    'data scientist': 25,
    researcher: 25,
  },

  // Company type keywords
  company: {
    // AI-focused companies (highest priority)
    ai: 25,
    ml: 25,
    voice: 25,
    speech: 20,

    // Startup indicators
    startup: 15,
    stealth: 20,
    labs: 15,

    // Tech companies
    tech: 15,
    software: 10,
  },

  // Contact completeness
  completeness: {
    email: 15,
    linkedin: 10,
    whatsapp: 10,
    foto: 5,
  },
};

/**
 * Calculate the lead score for a hackathon contact
 * Returns a score between 0 and 100
 */
export function calculateLeadScore(contact: HackathonContact): number {
  let score = 0;

  // 1. Role-based scoring
  score += SCORE_WEIGHTS.role[contact.role] || 0;

  // 2. Job title scoring
  const cargo = (contact.cargo || '').toLowerCase();

  // Check for each job title keyword
  for (const [keyword, points] of Object.entries(SCORE_WEIGHTS.jobTitle)) {
    if (cargo.includes(keyword.toLowerCase())) {
      score += points;
      break; // Only add points for the first matching keyword to avoid double-counting
    }
  }

  // 3. Company scoring
  const empresa = (contact.empresa || '').toLowerCase();

  for (const [keyword, points] of Object.entries(SCORE_WEIGHTS.company)) {
    if (empresa.includes(keyword.toLowerCase())) {
      score += points;
      break; // Only add points for the first matching keyword
    }
  }

  // 4. Contact completeness scoring
  if (contact.email && contact.email.length > 0) {
    score += SCORE_WEIGHTS.completeness.email;
  }
  if (contact.linkedin && contact.linkedin.length > 0) {
    score += SCORE_WEIGHTS.completeness.linkedin;
  }
  if (contact.whatsapp && contact.whatsapp.length > 0) {
    score += SCORE_WEIGHTS.completeness.whatsapp;
  }
  if (contact.foto && contact.foto.length > 0) {
    score += SCORE_WEIGHTS.completeness.foto;
  }

  // Cap the score at 100
  return Math.min(score, 100);
}

/**
 * Get the lead category based on score
 */
export function getLeadCategory(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 60) return 'hot';
  if (score >= 35) return 'warm';
  return 'cold';
}

/**
 * Get lead category details with color and description
 */
export function getLeadCategoryDetails(score: number): {
  category: 'hot' | 'warm' | 'cold';
  color: string;
  bgColor: string;
  description: string;
} {
  const category = getLeadCategory(score);

  const details = {
    hot: {
      category: 'hot' as const,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'High priority - Contact immediately',
    },
    warm: {
      category: 'warm' as const,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Medium priority - Follow up this week',
    },
    cold: {
      category: 'cold' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Low priority - Add to nurture sequence',
    },
  };

  return details[category];
}

/**
 * Generate personalized talking points based on contact profile
 */
export function getLeadTalkingPoints(contact: HackathonContact): string[] {
  const points: string[] = [];
  const cargo = (contact.cargo || '').toLowerCase();
  const empresa = (contact.empresa || '').toLowerCase();

  // Developer/Engineer talking points
  if (cargo.includes('developer') || cargo.includes('engineer') || cargo.includes('programmer')) {
    points.push('API facil de integrar - poucas linhas de codigo');
    points.push('SDK para Python, Node.js, React');
    points.push('Documentacao completa com exemplos praticos');
    points.push('Playground para testar antes de implementar');
  }

  // AI/ML specialist talking points
  if (cargo.includes('ai') || cargo.includes('ml') || cargo.includes('machine learning') || cargo.includes('data scientist')) {
    points.push('Modelos de voz customizaveis com fine-tuning');
    points.push('Latencia ultra-baixa para aplicacoes real-time');
    points.push('Suporte a multiplos idiomas incluindo PT-BR');
    points.push('API de embeddings para voice cloning');
  }

  // Voice/Speech specialist talking points
  if (cargo.includes('voice') || cargo.includes('speech') || cargo.includes('tts') || cargo.includes('stt')) {
    points.push('Qualidade de audio superior - vozes naturais');
    points.push('Controle granular de prosody e emocao');
    points.push('Streaming de audio em tempo real');
    points.push('Voice cloning com poucos segundos de amostra');
  }

  // Founder/CEO talking points
  if (cargo.includes('founder') || cargo.includes('ceo') || cargo.includes('co-founder')) {
    points.push('Reducao de custos com atendimento automatizado');
    points.push('Escalabilidade sem aumentar headcount');
    points.push('ROI comprovado em casos de uso similares');
    points.push('Time-to-market acelerado para features de voz');
  }

  // CTO/Tech Lead talking points
  if (cargo.includes('cto') || cargo.includes('tech lead') || cargo.includes('architect')) {
    points.push('Arquitetura enterprise-ready e escalavel');
    points.push('SLA de 99.9% uptime');
    points.push('Compliance com LGPD e GDPR');
    points.push('Integracao com stack moderna (k8s, serverless)');
  }

  // Product Manager talking points
  if (cargo.includes('product') || cargo.includes('pm')) {
    points.push('Features de voz como diferencial competitivo');
    points.push('Analytics detalhado de uso');
    points.push('A/B testing de vozes e scripts');
    points.push('Roadmap publico e feature requests');
  }

  // Company-specific talking points
  if (empresa.includes('startup') || empresa.includes('stealth')) {
    points.push('Programa de startup com creditos gratuitos');
    points.push('Suporte tecnico prioritario');
  }

  if (empresa.includes('fintech') || empresa.includes('bank') || empresa.includes('finance')) {
    points.push('Certificacoes de seguranca financeira');
    points.push('Criptografia end-to-end');
  }

  // Default talking points if no specific match
  if (points.length === 0) {
    points.push('Crie agentes de voz realistas em minutos');
    points.push('Text-to-speech de alta qualidade');
    points.push('Precos competitivos e escalaveis');
    points.push('Suporte tecnico dedicado');
  }

  return points;
}

/**
 * Generate outreach message based on contact profile
 */
export function generateOutreachMessage(contact: HackathonContact, template: 'linkedin' | 'email' | 'whatsapp' = 'linkedin'): string {
  const firstName = contact.nome.split(' ')[0];
  const cargo = (contact.cargo || '').toLowerCase();
  const talkingPoints = getLeadTalkingPoints(contact);

  // Determine persona type for personalization
  let personaType = 'profissional de tecnologia';
  if (cargo.includes('founder') || cargo.includes('ceo')) {
    personaType = 'fundador';
  } else if (cargo.includes('developer') || cargo.includes('engineer')) {
    personaType = 'desenvolvedor';
  } else if (cargo.includes('ai') || cargo.includes('ml')) {
    personaType = 'especialista em AI';
  }

  const templates = {
    linkedin: `Oi ${firstName}! Foi muito bom conhecer voce no hackathon da Antigravity SF!

Como ${personaType}, acredito que voce vai gostar do que estamos construindo - uma plataforma de voice AI que permite ${talkingPoints[0].toLowerCase()}.

Seria legal trocar uma ideia sobre como isso pode ajudar ${contact.empresa || 'seu projeto'}. Topa um cafe virtual de 15min?`,

    email: `Oi ${firstName},

Espero que esteja bem! Nos conhecemos no hackathon da Antigravity SF e fiquei impressionado com seu trabalho.

Estou trabalhando em uma plataforma de voice AI e, considerando sua experiencia como ${personaType}, acho que pode ser interessante para voce.

Alguns destaques:
${talkingPoints.slice(0, 3).map(p => `- ${p}`).join('\n')}

Podemos agendar uma call de 15 minutos para eu mostrar a plataforma?

Abracos,
[Seu nome]`,

    whatsapp: `Oi ${firstName}! Aqui e [seu nome] do hackathon da Antigravity!

Lembra que conversamos sobre voice AI? Queria te mostrar a plataforma que estamos construindo - ${talkingPoints[0].toLowerCase()}.

Podemos marcar uma call rapida? 🎙️`,
  };

  return templates[template];
}

/**
 * Sort contacts by lead score (descending)
 */
export function sortContactsByScore(contacts: HackathonContact[]): Array<HackathonContact & { score: number; category: 'hot' | 'warm' | 'cold' }> {
  return contacts
    .map(contact => ({
      ...contact,
      score: calculateLeadScore(contact),
      category: getLeadCategory(calculateLeadScore(contact)),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Get contacts filtered by lead category
 */
export function getContactsByCategory(
  contacts: HackathonContact[],
  category: 'hot' | 'warm' | 'cold'
): HackathonContact[] {
  return contacts.filter(contact => getLeadCategory(calculateLeadScore(contact)) === category);
}

/**
 * Get lead scoring statistics
 */
export function getLeadScoringStats(contacts: HackathonContact[]): {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  averageScore: number;
  topContacts: Array<{ nome: string; score: number; empresa: string }>;
} {
  const scored = sortContactsByScore(contacts);

  const hot = scored.filter(c => c.category === 'hot').length;
  const warm = scored.filter(c => c.category === 'warm').length;
  const cold = scored.filter(c => c.category === 'cold').length;

  const totalScore = scored.reduce((sum, c) => sum + c.score, 0);
  const averageScore = Math.round(totalScore / scored.length);

  const topContacts = scored.slice(0, 10).map(c => ({
    nome: c.nome,
    score: c.score,
    empresa: c.empresa,
  }));

  return {
    total: contacts.length,
    hot,
    warm,
    cold,
    averageScore,
    topContacts,
  };
}

/**
 * Priority matrix for outreach
 */
export function getPriorityMatrix(contacts: HackathonContact[]): {
  immediate: HackathonContact[];  // Hot leads with email
  highPriority: HackathonContact[]; // Hot leads without email (need LinkedIn outreach)
  scheduled: HackathonContact[]; // Warm leads
  nurture: HackathonContact[]; // Cold leads
} {
  const scored = sortContactsByScore(contacts);

  return {
    immediate: scored.filter(c => c.category === 'hot' && c.email),
    highPriority: scored.filter(c => c.category === 'hot' && !c.email),
    scheduled: scored.filter(c => c.category === 'warm'),
    nurture: scored.filter(c => c.category === 'cold'),
  };
}
