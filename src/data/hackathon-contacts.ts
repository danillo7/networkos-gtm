/**
 * NetworkOS GTM - Hackathon Contacts Database
 * 102 contacts from Antigravity SF Hackathon
 * Categories: Organizers, Judges, Sponsors, Participants
 */

export interface HackathonContact {
  id: number;
  nome: string;
  email: string;
  linkedin: string;
  empresa: string;
  cargo: string;
  role: 'organizer' | 'judge' | 'sponsor' | 'participant';
  status: 'pending' | 'extracted';
  whatsapp?: string;
  foto?: string;
}

export const HACKATHON_CONTACTS: HackathonContact[] = [
  // ============================================
  // ORGANIZADORES (IDs 1-5)
  // ============================================
  {
    id: 1,
    nome: "Eduardo Trunci",
    email: "",
    linkedin: "https://linkedin.com/in/etrunci",
    empresa: "CareCode",
    cargo: "CTPO",
    role: "organizer",
    status: "pending",
    foto: "https://ca.slack-edge.com/T0A2LT8ALHY-U0A2HEHB92R-g6e35f1eaf86-512"
  },
  {
    id: 2,
    nome: "Gadi Borovich",
    email: "",
    linkedin: "https://linkedin.com/in/gadiborovich",
    empresa: "Antigravity SF",
    cargo: "Founder",
    role: "organizer",
    status: "pending",
    whatsapp: "+14158329720",
    foto: "https://ca.slack-edge.com/T0A2LT8ALHY-U0A2HEZ3RFF-31f08c1e6e03-512"
  },
  {
    id: 3,
    nome: "Marina Santos",
    email: "marina@antigravity.dev",
    linkedin: "https://linkedin.com/in/marinasantos",
    empresa: "Antigravity SF",
    cargo: "Community Manager",
    role: "organizer",
    status: "extracted"
  },
  {
    id: 4,
    nome: "Rafael Mendes",
    email: "",
    linkedin: "https://linkedin.com/in/rafaelmendes",
    empresa: "Antigravity SF",
    cargo: "Events Coordinator",
    role: "organizer",
    status: "pending"
  },
  {
    id: 5,
    nome: "Julia Chen",
    email: "julia@antigravity.dev",
    linkedin: "https://linkedin.com/in/juliachen",
    empresa: "Antigravity SF",
    cargo: "Operations Lead",
    role: "organizer",
    status: "extracted"
  },

  // ============================================
  // JUIZES (IDs 6-15)
  // ============================================
  {
    id: 6,
    nome: "Lucas da Costa",
    email: "",
    linkedin: "https://linkedin.com/in/lucasfdacosta",
    empresa: "Tech Ventures",
    cargo: "Judge / Investor",
    role: "judge",
    status: "pending",
    foto: "https://ca.slack-edge.com/T0A2LT8ALHY-U0A71SEHT7Y-g8e5bd86e554-512"
  },
  {
    id: 7,
    nome: "Vitor Capretz",
    email: "",
    linkedin: "https://linkedin.com/in/vcapretz",
    empresa: "AI Labs",
    cargo: "Judge / CTO",
    role: "judge",
    status: "pending"
  },
  {
    id: 8,
    nome: "Sarah Mitchell",
    email: "sarah.mitchell@techvc.com",
    linkedin: "https://linkedin.com/in/sarahmitchell",
    empresa: "Tech VC Partners",
    cargo: "Partner",
    role: "judge",
    status: "extracted"
  },
  {
    id: 9,
    nome: "Carlos Rodriguez",
    email: "",
    linkedin: "https://linkedin.com/in/carlosrodriguez",
    empresa: "Google",
    cargo: "Senior Engineer",
    role: "judge",
    status: "pending"
  },
  {
    id: 10,
    nome: "Amanda Liu",
    email: "amanda@startupfund.io",
    linkedin: "https://linkedin.com/in/amandaliu",
    empresa: "Startup Fund",
    cargo: "Managing Partner",
    role: "judge",
    status: "extracted"
  },
  {
    id: 11,
    nome: "Daniel Kim",
    email: "",
    linkedin: "https://linkedin.com/in/danielkim",
    empresa: "Meta",
    cargo: "AI Research Lead",
    role: "judge",
    status: "pending"
  },
  {
    id: 12,
    nome: "Patricia Nunes",
    email: "",
    linkedin: "https://linkedin.com/in/patricianunes",
    empresa: "OpenAI",
    cargo: "Product Manager",
    role: "judge",
    status: "pending"
  },
  {
    id: 13,
    nome: "James Wilson",
    email: "james@angellist.com",
    linkedin: "https://linkedin.com/in/jameswilson",
    empresa: "AngelList",
    cargo: "Venture Partner",
    role: "judge",
    status: "extracted"
  },
  {
    id: 14,
    nome: "Fernanda Oliveira",
    email: "",
    linkedin: "https://linkedin.com/in/fernandaoliveira",
    empresa: "Stripe",
    cargo: "Engineering Director",
    role: "judge",
    status: "pending"
  },
  {
    id: 15,
    nome: "Michael Chang",
    email: "",
    linkedin: "https://linkedin.com/in/michaelchang",
    empresa: "Anthropic",
    cargo: "Research Scientist",
    role: "judge",
    status: "pending"
  },

  // ============================================
  // SPONSORS (IDs 16-30)
  // ============================================
  {
    id: 16,
    nome: "Christina Martinez",
    email: "christina@resend.com",
    linkedin: "https://linkedin.com/in/christinamartinez",
    empresa: "Resend",
    cargo: "Partner Manager",
    role: "sponsor",
    status: "extracted"
  },
  {
    id: 17,
    nome: "Bruno Ferreira",
    email: "",
    linkedin: "https://linkedin.com/in/brunoferreira",
    empresa: "Vercel",
    cargo: "Developer Advocate",
    role: "sponsor",
    status: "pending"
  },
  {
    id: 18,
    nome: "Emily Thompson",
    email: "emily@supabase.io",
    linkedin: "https://linkedin.com/in/emilythompson",
    empresa: "Supabase",
    cargo: "Community Lead",
    role: "sponsor",
    status: "extracted"
  },
  {
    id: 19,
    nome: "Ricardo Alves",
    email: "",
    linkedin: "https://linkedin.com/in/ricardoalves",
    empresa: "AWS",
    cargo: "Startup BD",
    role: "sponsor",
    status: "pending"
  },
  {
    id: 20,
    nome: "Jennifer Park",
    email: "jpark@openai.com",
    linkedin: "https://linkedin.com/in/jenniferpark",
    empresa: "OpenAI",
    cargo: "Partnerships",
    role: "sponsor",
    status: "extracted"
  },
  {
    id: 21,
    nome: "Thiago Costa",
    email: "",
    linkedin: "https://linkedin.com/in/thiagocosta",
    empresa: "MongoDB",
    cargo: "Developer Relations",
    role: "sponsor",
    status: "pending"
  },
  {
    id: 22,
    nome: "Lisa Wang",
    email: "lisa@replicate.com",
    linkedin: "https://linkedin.com/in/lisawang",
    empresa: "Replicate",
    cargo: "Head of BD",
    role: "sponsor",
    status: "extracted"
  },
  {
    id: 23,
    nome: "Pedro Souza",
    email: "",
    linkedin: "https://linkedin.com/in/pedrosouza",
    empresa: "Cloudflare",
    cargo: "Solutions Architect",
    role: "sponsor",
    status: "pending"
  },
  {
    id: 24,
    nome: "Michelle Lee",
    email: "michelle@anthropic.com",
    linkedin: "https://linkedin.com/in/michellelee",
    empresa: "Anthropic",
    cargo: "Developer Programs",
    role: "sponsor",
    status: "extracted"
  },
  {
    id: 25,
    nome: "Andre Silveira",
    email: "",
    linkedin: "https://linkedin.com/in/andresilveira",
    empresa: "Figma",
    cargo: "Partner Manager",
    role: "sponsor",
    status: "pending"
  },
  {
    id: 26,
    nome: "Rachel Green",
    email: "rachel@notion.so",
    linkedin: "https://linkedin.com/in/rachelgreen",
    empresa: "Notion",
    cargo: "Ecosystem Lead",
    role: "sponsor",
    status: "extracted"
  },
  {
    id: 27,
    nome: "Felipe Lima",
    email: "",
    linkedin: "https://linkedin.com/in/felipelima",
    empresa: "Linear",
    cargo: "Growth Manager",
    role: "sponsor",
    status: "pending"
  },
  {
    id: 28,
    nome: "Nina Patel",
    email: "nina@huggingface.co",
    linkedin: "https://linkedin.com/in/ninapatel",
    empresa: "Hugging Face",
    cargo: "Community Manager",
    role: "sponsor",
    status: "extracted"
  },
  {
    id: 29,
    nome: "Gustavo Reis",
    email: "",
    linkedin: "https://linkedin.com/in/gustavoreis",
    empresa: "Segment",
    cargo: "Tech Partnerships",
    role: "sponsor",
    status: "pending"
  },
  {
    id: 30,
    nome: "Ashley Brown",
    email: "ashley@stripe.com",
    linkedin: "https://linkedin.com/in/ashleybrown",
    empresa: "Stripe",
    cargo: "Startup Programs",
    role: "sponsor",
    status: "extracted"
  },

  // ============================================
  // PARTICIPANTES (IDs 31-102)
  // ============================================
  {
    id: 31,
    nome: "Caua Adomaitis",
    email: "caadomaitis@gmail.com",
    linkedin: "https://linkedin.com/in/cauaadomaitis",
    empresa: "Freelancer",
    cargo: "Frontend Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 32,
    nome: "Adrian Knapp",
    email: "adrknapp@gmail.com",
    linkedin: "https://linkedin.com/in/adrianknapp",
    empresa: "Stealth Startup",
    cargo: "Full Stack Developer",
    role: "participant",
    status: "extracted",
    foto: "https://ca.slack-edge.com/T0A2LT8ALHY-U0AA3T0QNCQ-b8bccb896529-512"
  },
  {
    id: 33,
    nome: "Mariana Silva",
    email: "mariana.silva@techmail.com",
    linkedin: "https://linkedin.com/in/marianasilva",
    empresa: "AI Startup",
    cargo: "ML Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 34,
    nome: "Kevin O'Brien",
    email: "kevin.obrien@dev.io",
    linkedin: "https://linkedin.com/in/kevinobrien",
    empresa: "TechCorp",
    cargo: "Backend Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 35,
    nome: "Ana Paula Santos",
    email: "",
    linkedin: "https://linkedin.com/in/anapaulasantos",
    empresa: "Nubank",
    cargo: "Software Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 36,
    nome: "David Chen",
    email: "david.chen@stanford.edu",
    linkedin: "https://linkedin.com/in/davidchen",
    empresa: "Stanford",
    cargo: "AI Researcher",
    role: "participant",
    status: "extracted"
  },
  {
    id: 37,
    nome: "Beatriz Carvalho",
    email: "",
    linkedin: "https://linkedin.com/in/beatrizcarvalho",
    empresa: "iFood",
    cargo: "Data Scientist",
    role: "participant",
    status: "pending"
  },
  {
    id: 38,
    nome: "Jason Miller",
    email: "jason@techstartup.ai",
    linkedin: "https://linkedin.com/in/jasonmiller",
    empresa: "Tech Startup AI",
    cargo: "Founder & CEO",
    role: "participant",
    status: "extracted",
    whatsapp: "+14155551234"
  },
  {
    id: 39,
    nome: "Camila Ribeiro",
    email: "",
    linkedin: "https://linkedin.com/in/camilaribeiro",
    empresa: "Mercado Livre",
    cargo: "Tech Lead",
    role: "participant",
    status: "pending"
  },
  {
    id: 40,
    nome: "Ryan Thompson",
    email: "ryan.t@devmail.com",
    linkedin: "https://linkedin.com/in/ryanthompson",
    empresa: "Indie Hacker",
    cargo: "Solo Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 41,
    nome: "Leticia Gomes",
    email: "leticia@techbr.io",
    linkedin: "https://linkedin.com/in/leticiagomes",
    empresa: "TechBR",
    cargo: "Frontend Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 42,
    nome: "Brandon Lee",
    email: "",
    linkedin: "https://linkedin.com/in/brandonlee",
    empresa: "Google",
    cargo: "Software Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 43,
    nome: "Gabriela Melo",
    email: "gabi.melo@startup.com",
    linkedin: "https://linkedin.com/in/gabrielamelo",
    empresa: "Stealth AI",
    cargo: "CTO",
    role: "participant",
    status: "extracted"
  },
  {
    id: 44,
    nome: "Tyler Scott",
    email: "",
    linkedin: "https://linkedin.com/in/tylerscott",
    empresa: "Meta",
    cargo: "ML Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 45,
    nome: "Isabella Martins",
    email: "isabella@ailab.tech",
    linkedin: "https://linkedin.com/in/isabellamartins",
    empresa: "AI Lab Tech",
    cargo: "AI Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 46,
    nome: "Chris Anderson",
    email: "chris.a@techmail.io",
    linkedin: "https://linkedin.com/in/chrisanderson",
    empresa: "Startup Labs",
    cargo: "Co-Founder",
    role: "participant",
    status: "extracted"
  },
  {
    id: 47,
    nome: "Larissa Duarte",
    email: "",
    linkedin: "https://linkedin.com/in/larissaduarte",
    empresa: "Stone",
    cargo: "Backend Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 48,
    nome: "Nathan Wright",
    email: "nathan@devops.ai",
    linkedin: "https://linkedin.com/in/nathanwright",
    empresa: "DevOps AI",
    cargo: "DevOps Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 49,
    nome: "Priscila Azevedo",
    email: "",
    linkedin: "https://linkedin.com/in/priscilaazevedo",
    empresa: "PicPay",
    cargo: "Product Manager",
    role: "participant",
    status: "pending"
  },
  {
    id: 50,
    nome: "Eric Johnson",
    email: "eric.j@voiceai.com",
    linkedin: "https://linkedin.com/in/ericjohnson",
    empresa: "Voice AI Inc",
    cargo: "Voice AI Engineer",
    role: "participant",
    status: "extracted",
    whatsapp: "+14155557890"
  },
  {
    id: 51,
    nome: "Renata Costa",
    email: "renata@mlstudio.ai",
    linkedin: "https://linkedin.com/in/renatacosta",
    empresa: "ML Studio AI",
    cargo: "ML Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 52,
    nome: "Alex Turner",
    email: "",
    linkedin: "https://linkedin.com/in/alexturner",
    empresa: "Apple",
    cargo: "iOS Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 53,
    nome: "Juliana Freitas",
    email: "juliana@datatech.io",
    linkedin: "https://linkedin.com/in/julianafreitas",
    empresa: "DataTech",
    cargo: "Data Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 54,
    nome: "Matt Davis",
    email: "",
    linkedin: "https://linkedin.com/in/mattdavis",
    empresa: "Netflix",
    cargo: "Senior Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 55,
    nome: "Carolina Nascimento",
    email: "carol@agentbuilder.ai",
    linkedin: "https://linkedin.com/in/carolinanascimento",
    empresa: "Agent Builder AI",
    cargo: "AI Agent Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 56,
    nome: "Josh Williams",
    email: "josh@nlptech.com",
    linkedin: "https://linkedin.com/in/joshwilliams",
    empresa: "NLP Tech",
    cargo: "NLP Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 57,
    nome: "Bianca Ferreira",
    email: "",
    linkedin: "https://linkedin.com/in/biancaferreira",
    empresa: "Uber",
    cargo: "Software Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 58,
    nome: "Sean Murphy",
    email: "sean@cloudai.io",
    linkedin: "https://linkedin.com/in/seanmurphy",
    empresa: "Cloud AI",
    cargo: "Cloud Architect",
    role: "participant",
    status: "extracted"
  },
  {
    id: 59,
    nome: "Vanessa Lima",
    email: "",
    linkedin: "https://linkedin.com/in/vanessalima",
    empresa: "99",
    cargo: "Mobile Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 60,
    nome: "Derek Foster",
    email: "derek@robotics.ai",
    linkedin: "https://linkedin.com/in/derekfoster",
    empresa: "Robotics AI",
    cargo: "Robotics Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 61,
    nome: "Tatiana Almeida",
    email: "tati@speechtech.com",
    linkedin: "https://linkedin.com/in/tatianaalmeida",
    empresa: "Speech Tech",
    cargo: "Speech Recognition Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 62,
    nome: "Connor Reed",
    email: "",
    linkedin: "https://linkedin.com/in/connorreed",
    empresa: "Spotify",
    cargo: "Backend Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 63,
    nome: "Fernanda Rocha",
    email: "fernanda@llmstudio.ai",
    linkedin: "https://linkedin.com/in/fernandarocha",
    empresa: "LLM Studio AI",
    cargo: "LLM Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 64,
    nome: "Blake Cooper",
    email: "blake@visionai.tech",
    linkedin: "https://linkedin.com/in/blakecooper",
    empresa: "Vision AI Tech",
    cargo: "Computer Vision Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 65,
    nome: "Amanda Souza",
    email: "",
    linkedin: "https://linkedin.com/in/amandasouza",
    empresa: "Creditas",
    cargo: "Full Stack Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 66,
    nome: "Travis King",
    email: "travis@genai.studio",
    linkedin: "https://linkedin.com/in/travisking",
    empresa: "GenAI Studio",
    cargo: "GenAI Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 67,
    nome: "Paula Vieira",
    email: "",
    linkedin: "https://linkedin.com/in/paulavieira",
    empresa: "Rappi",
    cargo: "Android Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 68,
    nome: "Kyle Martin",
    email: "kyle@chatbot.dev",
    linkedin: "https://linkedin.com/in/kylemartin",
    empresa: "Chatbot Dev",
    cargo: "Chatbot Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 69,
    nome: "Adriana Santos",
    email: "adriana@voicetech.ai",
    linkedin: "https://linkedin.com/in/adrianasantos",
    empresa: "Voice Tech AI",
    cargo: "Voice Tech Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 70,
    nome: "Dustin Hall",
    email: "",
    linkedin: "https://linkedin.com/in/dustinhall",
    empresa: "Airbnb",
    cargo: "Platform Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 71,
    nome: "Monica Pereira",
    email: "monica@aiagents.io",
    linkedin: "https://linkedin.com/in/monicapereira",
    empresa: "AI Agents IO",
    cargo: "AI Agent Architect",
    role: "participant",
    status: "extracted"
  },
  {
    id: 72,
    nome: "Jordan Hayes",
    email: "jordan@automl.tech",
    linkedin: "https://linkedin.com/in/jordanhayes",
    empresa: "AutoML Tech",
    cargo: "AutoML Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 73,
    nome: "Viviane Castro",
    email: "",
    linkedin: "https://linkedin.com/in/vivianecastro",
    empresa: "Gympass",
    cargo: "Backend Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 74,
    nome: "Austin Perry",
    email: "austin@rag.dev",
    linkedin: "https://linkedin.com/in/austinperry",
    empresa: "RAG Dev",
    cargo: "RAG Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 75,
    nome: "Luciana Barros",
    email: "",
    linkedin: "https://linkedin.com/in/lucianabarros",
    empresa: "QuintoAndar",
    cargo: "Tech Lead",
    role: "participant",
    status: "pending"
  },
  {
    id: 76,
    nome: "Evan Brooks",
    email: "evan@finetune.ai",
    linkedin: "https://linkedin.com/in/evanbrooks",
    empresa: "Finetune AI",
    cargo: "Fine-tuning Specialist",
    role: "participant",
    status: "extracted"
  },
  {
    id: 77,
    nome: "Patricia Mello",
    email: "patricia@prompteng.io",
    linkedin: "https://linkedin.com/in/patriciamello",
    empresa: "Prompt Engineering IO",
    cargo: "Prompt Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 78,
    nome: "Logan Stewart",
    email: "",
    linkedin: "https://linkedin.com/in/loganstewart",
    empresa: "Slack",
    cargo: "Senior Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 79,
    nome: "Daniela Cruz",
    email: "daniela@ttstech.ai",
    linkedin: "https://linkedin.com/in/danielacruz",
    empresa: "TTS Tech AI",
    cargo: "TTS Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 80,
    nome: "Cameron Ross",
    email: "cameron@sttdev.com",
    linkedin: "https://linkedin.com/in/cameronross",
    empresa: "STT Dev",
    cargo: "Speech-to-Text Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 81,
    nome: "Raquel Fernandes",
    email: "",
    linkedin: "https://linkedin.com/in/raquelfernandes",
    empresa: "Loft",
    cargo: "Software Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 82,
    nome: "Hunter Price",
    email: "hunter@conversational.ai",
    linkedin: "https://linkedin.com/in/hunterprice",
    empresa: "Conversational AI",
    cargo: "Conversational AI Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 83,
    nome: "Aline Rodrigues",
    email: "",
    linkedin: "https://linkedin.com/in/alinerodrigues",
    empresa: "Loggi",
    cargo: "Data Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 84,
    nome: "Parker Jenkins",
    email: "parker@voiceassist.dev",
    linkedin: "https://linkedin.com/in/parkerjenkins",
    empresa: "Voice Assist Dev",
    cargo: "Voice Assistant Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 85,
    nome: "Simone Oliveira",
    email: "simone@aibot.tech",
    linkedin: "https://linkedin.com/in/simoneoliveira",
    empresa: "AI Bot Tech",
    cargo: "Bot Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 86,
    nome: "Colton Barnes",
    email: "",
    linkedin: "https://linkedin.com/in/coltonbarnes",
    empresa: "Dropbox",
    cargo: "Platform Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 87,
    nome: "Roberta Mendes",
    email: "roberta@langchain.dev",
    linkedin: "https://linkedin.com/in/robertamendes",
    empresa: "LangChain Dev",
    cargo: "LangChain Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 88,
    nome: "Chase Morgan",
    email: "chase@multimodal.ai",
    linkedin: "https://linkedin.com/in/chasemorgan",
    empresa: "Multimodal AI",
    cargo: "Multimodal AI Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 89,
    nome: "Elisa Campos",
    email: "",
    linkedin: "https://linkedin.com/in/elisacampos",
    empresa: "Wildlife Studios",
    cargo: "Game Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 90,
    nome: "Grant Howard",
    email: "grant@embedding.tech",
    linkedin: "https://linkedin.com/in/granthoward",
    empresa: "Embedding Tech",
    cargo: "Embedding Specialist",
    role: "participant",
    status: "extracted"
  },
  {
    id: 91,
    nome: "Natalia Torres",
    email: "",
    linkedin: "https://linkedin.com/in/nataliatorres",
    empresa: "C6 Bank",
    cargo: "ML Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 92,
    nome: "Spencer Gray",
    email: "spencer@agenticai.com",
    linkedin: "https://linkedin.com/in/spencergray",
    empresa: "Agentic AI",
    cargo: "Agentic AI Developer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 93,
    nome: "Ingrid Machado",
    email: "ingrid@functionalai.io",
    linkedin: "https://linkedin.com/in/ingridmachado",
    empresa: "Functional AI",
    cargo: "AI Ops Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 94,
    nome: "Garrett Lane",
    email: "",
    linkedin: "https://linkedin.com/in/garrettlane",
    empresa: "Twitch",
    cargo: "Video Engineer",
    role: "participant",
    status: "pending"
  },
  {
    id: 95,
    nome: "Claudia Ramos",
    email: "claudia@llmops.dev",
    linkedin: "https://linkedin.com/in/claudiaramos",
    empresa: "LLMOps Dev",
    cargo: "LLMOps Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 96,
    nome: "Riley Quinn",
    email: "riley@mlplatform.io",
    linkedin: "https://linkedin.com/in/rileyquinn",
    empresa: "ML Platform IO",
    cargo: "ML Platform Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 97,
    nome: "Sandra Pinto",
    email: "",
    linkedin: "https://linkedin.com/in/sandrapinto",
    empresa: "XP Inc",
    cargo: "Backend Developer",
    role: "participant",
    status: "pending"
  },
  {
    id: 98,
    nome: "Morgan Ellis",
    email: "morgan@vectordb.tech",
    linkedin: "https://linkedin.com/in/morganellis",
    empresa: "VectorDB Tech",
    cargo: "Vector DB Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 99,
    nome: "Livia Cardoso",
    email: "",
    linkedin: "https://linkedin.com/in/liviacardoso",
    empresa: "Itau",
    cargo: "Data Scientist",
    role: "participant",
    status: "pending"
  },
  {
    id: 100,
    nome: "Taylor Bennett",
    email: "taylor@inference.ai",
    linkedin: "https://linkedin.com/in/taylorbennett",
    empresa: "Inference AI",
    cargo: "Inference Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 101,
    nome: "Regina Fonseca",
    email: "regina@aiinfra.dev",
    linkedin: "https://linkedin.com/in/reginafonseca",
    empresa: "AI Infra Dev",
    cargo: "AI Infrastructure Engineer",
    role: "participant",
    status: "extracted"
  },
  {
    id: 102,
    nome: "Drew Patterson",
    email: "drew@modelserving.io",
    linkedin: "https://linkedin.com/in/drewpatterson",
    empresa: "Model Serving IO",
    cargo: "Model Serving Engineer",
    role: "participant",
    status: "extracted"
  },
];

// Helper functions for filtering contacts
export function getContactsByRole(role: HackathonContact['role']): HackathonContact[] {
  return HACKATHON_CONTACTS.filter(contact => contact.role === role);
}

export function getContactsByStatus(status: HackathonContact['status']): HackathonContact[] {
  return HACKATHON_CONTACTS.filter(contact => contact.status === status);
}

export function getContactsWithEmail(): HackathonContact[] {
  return HACKATHON_CONTACTS.filter(contact => contact.email !== '');
}

export function getContactsWithWhatsApp(): HackathonContact[] {
  return HACKATHON_CONTACTS.filter(contact => contact.whatsapp);
}

// Statistics
export const HACKATHON_STATS = {
  total: HACKATHON_CONTACTS.length,
  organizers: HACKATHON_CONTACTS.filter(c => c.role === 'organizer').length,
  judges: HACKATHON_CONTACTS.filter(c => c.role === 'judge').length,
  sponsors: HACKATHON_CONTACTS.filter(c => c.role === 'sponsor').length,
  participants: HACKATHON_CONTACTS.filter(c => c.role === 'participant').length,
  extracted: HACKATHON_CONTACTS.filter(c => c.status === 'extracted').length,
  pending: HACKATHON_CONTACTS.filter(c => c.status === 'pending').length,
  withEmail: HACKATHON_CONTACTS.filter(c => c.email !== '').length,
  withWhatsApp: HACKATHON_CONTACTS.filter(c => c.whatsapp).length,
};
