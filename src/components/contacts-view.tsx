/**
 * Contacts View Component
 * Display contacts with AI Score badges
 */

'use client';

import * as React from 'react';
import {
  User,
  Building2,
  Mail,
  Linkedin,
  Phone,
  Zap,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  X,
  ExternalLink,
  MoreHorizontal,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Contact interface - defined before usage
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  avatarUrl?: string;
  title: string;
  company: { id: string; name: string; domain: string };
  department: string;
  seniority: string;
  authorityScore: number;
  decisionMaker: boolean;
  influencer: boolean;
  aiScore?: { overall: number; companyFit: number; voiceAIOpp: number; timing: number; budget: number } | null;
  leadStatus: 'hot' | 'warm' | 'cold';
}

// Sample contacts data - expanded dataset
const SAMPLE_CONTACTS: Contact[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Chen', fullName: 'Sarah Chen', email: 'sarah.chen@techcorp.com', phone: '+1 555-0123', linkedinUrl: 'https://linkedin.com/in/sarahchen', title: 'CTO', company: { id: '1', name: 'TechCorp Inc', domain: 'techcorp.com' }, department: 'Engineering', seniority: 'C-Level', authorityScore: 95, decisionMaker: true, influencer: true, aiScore: { overall: 92, companyFit: 95, voiceAIOpp: 88, timing: 90, budget: 85 }, leadStatus: 'hot' },
  { id: '2', firstName: 'Mike', lastName: 'Johnson', fullName: 'Mike Johnson', email: 'mike.j@techcorp.com', linkedinUrl: 'https://linkedin.com/in/mikejohnson', title: 'VP Engineering', company: { id: '1', name: 'TechCorp Inc', domain: 'techcorp.com' }, department: 'Engineering', seniority: 'VP', authorityScore: 82, decisionMaker: true, influencer: false, aiScore: { overall: 78, companyFit: 82, voiceAIOpp: 75, timing: 80, budget: 72 }, leadStatus: 'warm' },
  { id: '3', firstName: 'Emily', lastName: 'Davis', fullName: 'Emily Davis', email: 'emily@mediaflow.io', title: 'Head of Product', company: { id: '2', name: 'MediaFlow', domain: 'mediaflow.io' }, department: 'Product', seniority: 'Director', authorityScore: 75, decisionMaker: false, influencer: true, aiScore: { overall: 85, companyFit: 90, voiceAIOpp: 88, timing: 78, budget: 82 }, leadStatus: 'hot' },
  { id: '4', firstName: 'James', lastName: 'Wilson', fullName: 'James Wilson', email: 'jwilson@edulearn.com', title: 'Senior Engineer', company: { id: '3', name: 'EduLearn', domain: 'edulearn.com' }, department: 'Engineering', seniority: 'Senior', authorityScore: 55, decisionMaker: false, influencer: true, aiScore: null, leadStatus: 'cold' },
  { id: '5', firstName: 'Ana', lastName: 'Martinez', fullName: 'Ana Martinez', email: 'ana.martinez@cloudify.io', phone: '+1 555-0201', linkedinUrl: 'https://linkedin.com/in/anamartinez', title: 'CEO', company: { id: '4', name: 'Cloudify', domain: 'cloudify.io' }, department: 'Executive', seniority: 'C-Level', authorityScore: 98, decisionMaker: true, influencer: true, aiScore: { overall: 94, companyFit: 96, voiceAIOpp: 92, timing: 95, budget: 90 }, leadStatus: 'hot' },
  { id: '6', firstName: 'Robert', lastName: 'Kim', fullName: 'Robert Kim', email: 'rkim@dataverse.com', phone: '+1 555-0302', linkedinUrl: 'https://linkedin.com/in/robertkim', title: 'CIO', company: { id: '5', name: 'DataVerse', domain: 'dataverse.com' }, department: 'IT', seniority: 'C-Level', authorityScore: 91, decisionMaker: true, influencer: true, aiScore: { overall: 88, companyFit: 90, voiceAIOpp: 85, timing: 88, budget: 87 }, leadStatus: 'hot' },
  { id: '7', firstName: 'Lisa', lastName: 'Wang', fullName: 'Lisa Wang', email: 'lwang@aiventures.co', title: 'VP Product', company: { id: '6', name: 'AI Ventures', domain: 'aiventures.co' }, department: 'Product', seniority: 'VP', authorityScore: 85, decisionMaker: true, influencer: true, aiScore: { overall: 91, companyFit: 93, voiceAIOpp: 95, timing: 85, budget: 88 }, leadStatus: 'hot' },
  { id: '8', firstName: 'David', lastName: 'Brown', fullName: 'David Brown', email: 'dbrown@fintech.io', phone: '+1 555-0403', title: 'CFO', company: { id: '7', name: 'FinTech Solutions', domain: 'fintech.io' }, department: 'Finance', seniority: 'C-Level', authorityScore: 90, decisionMaker: true, influencer: false, aiScore: { overall: 72, companyFit: 75, voiceAIOpp: 65, timing: 78, budget: 70 }, leadStatus: 'warm' },
  { id: '9', firstName: 'Jennifer', lastName: 'Lee', fullName: 'Jennifer Lee', email: 'jlee@healthai.com', linkedinUrl: 'https://linkedin.com/in/jenniferlee', title: 'Director of Engineering', company: { id: '8', name: 'HealthAI', domain: 'healthai.com' }, department: 'Engineering', seniority: 'Director', authorityScore: 78, decisionMaker: true, influencer: true, aiScore: { overall: 86, companyFit: 88, voiceAIOpp: 90, timing: 82, budget: 80 }, leadStatus: 'hot' },
  { id: '10', firstName: 'Michael', lastName: 'Scott', fullName: 'Michael Scott', email: 'mscott@papersupply.com', phone: '+1 555-0504', title: 'Regional Manager', company: { id: '9', name: 'Paper Supply Co', domain: 'papersupply.com' }, department: 'Sales', seniority: 'Manager', authorityScore: 45, decisionMaker: false, influencer: false, aiScore: { overall: 42, companyFit: 40, voiceAIOpp: 35, timing: 50, budget: 45 }, leadStatus: 'cold' },
  { id: '11', firstName: 'Rachel', lastName: 'Green', fullName: 'Rachel Green', email: 'rgreen@fashiontech.io', linkedinUrl: 'https://linkedin.com/in/rachelgreen', title: 'Head of Marketing', company: { id: '10', name: 'FashionTech', domain: 'fashiontech.io' }, department: 'Marketing', seniority: 'Director', authorityScore: 72, decisionMaker: false, influencer: true, aiScore: { overall: 68, companyFit: 70, voiceAIOpp: 72, timing: 65, budget: 62 }, leadStatus: 'warm' },
  { id: '12', firstName: 'Chris', lastName: 'Evans', fullName: 'Chris Evans', email: 'cevans@herotech.com', phone: '+1 555-0605', title: 'CTO', company: { id: '11', name: 'HeroTech', domain: 'herotech.com' }, department: 'Engineering', seniority: 'C-Level', authorityScore: 94, decisionMaker: true, influencer: true, aiScore: { overall: 89, companyFit: 91, voiceAIOpp: 88, timing: 90, budget: 85 }, leadStatus: 'hot' },
  { id: '13', firstName: 'Amanda', lastName: 'Clarke', fullName: 'Amanda Clarke', email: 'aclarke@revengetech.io', title: 'VP Sales', company: { id: '12', name: 'RevengeTech', domain: 'revengetech.io' }, department: 'Sales', seniority: 'VP', authorityScore: 80, decisionMaker: true, influencer: false, aiScore: { overall: 76, companyFit: 78, voiceAIOpp: 70, timing: 80, budget: 75 }, leadStatus: 'warm' },
  { id: '14', firstName: 'Tom', lastName: 'Hardy', fullName: 'Tom Hardy', email: 'thardy@venomsoft.com', phone: '+1 555-0706', linkedinUrl: 'https://linkedin.com/in/tomhardy', title: 'CEO', company: { id: '13', name: 'VenomSoft', domain: 'venomsoft.com' }, department: 'Executive', seniority: 'C-Level', authorityScore: 97, decisionMaker: true, influencer: true, aiScore: { overall: 93, companyFit: 95, voiceAIOpp: 91, timing: 94, budget: 90 }, leadStatus: 'hot' },
  { id: '15', firstName: 'Emma', lastName: 'Stone', fullName: 'Emma Stone', email: 'estone@starlight.ai', title: 'Head of AI', company: { id: '14', name: 'Starlight AI', domain: 'starlight.ai' }, department: 'Engineering', seniority: 'Director', authorityScore: 86, decisionMaker: true, influencer: true, aiScore: { overall: 95, companyFit: 97, voiceAIOpp: 98, timing: 92, budget: 91 }, leadStatus: 'hot' },
  { id: '16', firstName: 'Ryan', lastName: 'Reynolds', fullName: 'Ryan Reynolds', email: 'rreynolds@maxeffort.com', phone: '+1 555-0807', title: 'Chief Marketing Officer', company: { id: '15', name: 'Maximum Effort', domain: 'maxeffort.com' }, department: 'Marketing', seniority: 'C-Level', authorityScore: 88, decisionMaker: true, influencer: true, aiScore: { overall: 82, companyFit: 84, voiceAIOpp: 80, timing: 85, budget: 78 }, leadStatus: 'warm' },
  { id: '17', firstName: 'Natalie', lastName: 'Portman', fullName: 'Natalie Portman', email: 'nportman@thortech.io', linkedinUrl: 'https://linkedin.com/in/natalieportman', title: 'VP Research', company: { id: '16', name: 'ThorTech', domain: 'thortech.io' }, department: 'R&D', seniority: 'VP', authorityScore: 83, decisionMaker: true, influencer: true, aiScore: { overall: 87, companyFit: 89, voiceAIOpp: 86, timing: 88, budget: 84 }, leadStatus: 'hot' },
  { id: '18', firstName: 'Oscar', lastName: 'Isaac', fullName: 'Oscar Isaac', email: 'oisaac@moonknight.io', title: 'Director of Operations', company: { id: '17', name: 'MoonKnight Systems', domain: 'moonknight.io' }, department: 'Operations', seniority: 'Director', authorityScore: 74, decisionMaker: false, influencer: true, aiScore: { overall: 71, companyFit: 73, voiceAIOpp: 68, timing: 75, budget: 70 }, leadStatus: 'warm' },
  { id: '19', firstName: 'Zoe', lastName: 'Saldana', fullName: 'Zoe Saldana', email: 'zsaldana@guardiantech.com', phone: '+1 555-0908', title: 'CTO', company: { id: '18', name: 'Guardian Technologies', domain: 'guardiantech.com' }, department: 'Engineering', seniority: 'C-Level', authorityScore: 93, decisionMaker: true, influencer: true, aiScore: { overall: 90, companyFit: 92, voiceAIOpp: 89, timing: 91, budget: 88 }, leadStatus: 'hot' },
  { id: '20', firstName: 'Benedict', lastName: 'Cumberbatch', fullName: 'Benedict Cumberbatch', email: 'bcumberbatch@mysticarts.ai', linkedinUrl: 'https://linkedin.com/in/benedictc', title: 'Chief AI Officer', company: { id: '19', name: 'Mystic Arts AI', domain: 'mysticarts.ai' }, department: 'AI', seniority: 'C-Level', authorityScore: 96, decisionMaker: true, influencer: true, aiScore: { overall: 97, companyFit: 98, voiceAIOpp: 99, timing: 95, budget: 94 }, leadStatus: 'hot' },
  { id: '21', firstName: 'Scarlett', lastName: 'Johansson', fullName: 'Scarlett Johansson', email: 'sjohansson@blackwidow.io', title: 'CEO', company: { id: '20', name: 'Black Widow Security', domain: 'blackwidow.io' }, department: 'Executive', seniority: 'C-Level', authorityScore: 99, decisionMaker: true, influencer: true, aiScore: { overall: 91, companyFit: 93, voiceAIOpp: 88, timing: 92, budget: 90 }, leadStatus: 'hot' },
  { id: '22', firstName: 'Mark', lastName: 'Ruffalo', fullName: 'Mark Ruffalo', email: 'mruffalo@greentech.com', phone: '+1 555-1009', title: 'Chief Sustainability Officer', company: { id: '21', name: 'GreenTech Solutions', domain: 'greentech.com' }, department: 'Sustainability', seniority: 'C-Level', authorityScore: 84, decisionMaker: true, influencer: true, aiScore: { overall: 79, companyFit: 81, voiceAIOpp: 75, timing: 82, budget: 77 }, leadStatus: 'warm' },
  { id: '23', firstName: 'Jeremy', lastName: 'Renner', fullName: 'Jeremy Renner', email: 'jrenner@hawkeye.tech', title: 'VP Engineering', company: { id: '22', name: 'Hawkeye Technologies', domain: 'hawkeye.tech' }, department: 'Engineering', seniority: 'VP', authorityScore: 81, decisionMaker: true, influencer: false, aiScore: { overall: 77, companyFit: 79, voiceAIOpp: 74, timing: 78, budget: 76 }, leadStatus: 'warm' },
  { id: '24', firstName: 'Elizabeth', lastName: 'Olsen', fullName: 'Elizabeth Olsen', email: 'eolsen@scarletwitch.ai', linkedinUrl: 'https://linkedin.com/in/elizabetholsen', title: 'Head of Machine Learning', company: { id: '23', name: 'Scarlet Witch AI', domain: 'scarletwitch.ai' }, department: 'Engineering', seniority: 'Director', authorityScore: 87, decisionMaker: true, influencer: true, aiScore: { overall: 94, companyFit: 96, voiceAIOpp: 97, timing: 91, budget: 90 }, leadStatus: 'hot' },
  { id: '25', firstName: 'Paul', lastName: 'Bettany', fullName: 'Paul Bettany', email: 'pbettany@visionai.com', phone: '+1 555-1110', title: 'Chief Vision Officer', company: { id: '24', name: 'Vision AI Systems', domain: 'visionai.com' }, department: 'Product', seniority: 'C-Level', authorityScore: 92, decisionMaker: true, influencer: true, aiScore: { overall: 96, companyFit: 97, voiceAIOpp: 98, timing: 94, budget: 93 }, leadStatus: 'hot' },
  { id: '26', firstName: 'Anthony', lastName: 'Mackie', fullName: 'Anthony Mackie', email: 'amackie@falcontech.io', title: 'VP Operations', company: { id: '25', name: 'Falcon Technologies', domain: 'falcontech.io' }, department: 'Operations', seniority: 'VP', authorityScore: 79, decisionMaker: true, influencer: false, aiScore: { overall: 74, companyFit: 76, voiceAIOpp: 71, timing: 77, budget: 73 }, leadStatus: 'warm' },
  { id: '27', firstName: 'Sebastian', lastName: 'Stan', fullName: 'Sebastian Stan', email: 'sstan@wintertech.com', linkedinUrl: 'https://linkedin.com/in/sebastianstan', title: 'Director of Security', company: { id: '26', name: 'Winter Technologies', domain: 'wintertech.com' }, department: 'Security', seniority: 'Director', authorityScore: 76, decisionMaker: false, influencer: true, aiScore: { overall: 73, companyFit: 75, voiceAIOpp: 70, timing: 76, budget: 72 }, leadStatus: 'warm' },
  { id: '28', firstName: 'Don', lastName: 'Cheadle', fullName: 'Don Cheadle', email: 'dcheadle@warmachine.io', phone: '+1 555-1211', title: 'COO', company: { id: '27', name: 'War Machine Industries', domain: 'warmachine.io' }, department: 'Operations', seniority: 'C-Level', authorityScore: 89, decisionMaker: true, influencer: true, aiScore: { overall: 84, companyFit: 86, voiceAIOpp: 81, timing: 87, budget: 83 }, leadStatus: 'hot' },
  { id: '29', firstName: 'Brie', lastName: 'Larson', fullName: 'Brie Larson', email: 'blarson@captainmarvel.tech', title: 'CEO', company: { id: '28', name: 'Captain Marvel Tech', domain: 'captainmarvel.tech' }, department: 'Executive', seniority: 'C-Level', authorityScore: 98, decisionMaker: true, influencer: true, aiScore: { overall: 92, companyFit: 94, voiceAIOpp: 90, timing: 93, budget: 89 }, leadStatus: 'hot' },
  { id: '30', firstName: 'Chadwick', lastName: 'Boseman', fullName: 'Chadwick Boseman', email: 'cboseman@wakandatech.com', linkedinUrl: 'https://linkedin.com/in/chadwickboseman', title: 'CTO', company: { id: '29', name: 'Wakanda Technologies', domain: 'wakandatech.com' }, department: 'Engineering', seniority: 'C-Level', authorityScore: 97, decisionMaker: true, influencer: true, aiScore: { overall: 98, companyFit: 99, voiceAIOpp: 97, timing: 98, budget: 96 }, leadStatus: 'hot' },
  { id: '31', firstName: 'Letitia', lastName: 'Wright', fullName: 'Letitia Wright', email: 'lwright@shuri.ai', phone: '+1 555-1312', title: 'Head of Innovation', company: { id: '29', name: 'Wakanda Technologies', domain: 'wakandatech.com' }, department: 'R&D', seniority: 'Director', authorityScore: 88, decisionMaker: true, influencer: true, aiScore: { overall: 95, companyFit: 97, voiceAIOpp: 96, timing: 94, budget: 92 }, leadStatus: 'hot' },
  { id: '32', firstName: 'Danai', lastName: 'Gurira', fullName: 'Danai Gurira', email: 'dgurira@okoye.tech', title: 'Chief Security Officer', company: { id: '29', name: 'Wakanda Technologies', domain: 'wakandatech.com' }, department: 'Security', seniority: 'C-Level', authorityScore: 86, decisionMaker: true, influencer: false, aiScore: { overall: 81, companyFit: 83, voiceAIOpp: 78, timing: 84, budget: 80 }, leadStatus: 'warm' },
  { id: '33', firstName: 'Winston', lastName: 'Duke', fullName: 'Winston Duke', email: 'wduke@jabari.io', linkedinUrl: 'https://linkedin.com/in/winstonduke', title: 'VP Infrastructure', company: { id: '30', name: 'Jabari Systems', domain: 'jabari.io' }, department: 'Infrastructure', seniority: 'VP', authorityScore: 77, decisionMaker: true, influencer: false, aiScore: { overall: 72, companyFit: 74, voiceAIOpp: 69, timing: 75, budget: 71 }, leadStatus: 'warm' },
  { id: '34', firstName: 'Lupita', lastName: 'Nyongo', fullName: 'Lupita Nyongo', email: 'lnyongo@nakia.tech', phone: '+1 555-1413', title: 'Chief Strategy Officer', company: { id: '31', name: 'Nakia Strategies', domain: 'nakia.tech' }, department: 'Strategy', seniority: 'C-Level', authorityScore: 90, decisionMaker: true, influencer: true, aiScore: { overall: 86, companyFit: 88, voiceAIOpp: 84, timing: 89, budget: 85 }, leadStatus: 'hot' },
  { id: '35', firstName: 'Karen', lastName: 'Gillan', fullName: 'Karen Gillan', email: 'kgillan@nebula.ai', title: 'VP Engineering', company: { id: '32', name: 'Nebula AI', domain: 'nebula.ai' }, department: 'Engineering', seniority: 'VP', authorityScore: 82, decisionMaker: true, influencer: true, aiScore: { overall: 88, companyFit: 90, voiceAIOpp: 89, timing: 86, budget: 85 }, leadStatus: 'hot' },
  { id: '36', firstName: 'Pom', lastName: 'Klementieff', fullName: 'Pom Klementieff', email: 'pklementieff@mantis.io', linkedinUrl: 'https://linkedin.com/in/pomklementieff', title: 'Head of UX', company: { id: '33', name: 'Mantis Design', domain: 'mantis.io' }, department: 'Design', seniority: 'Director', authorityScore: 71, decisionMaker: false, influencer: true, aiScore: { overall: 67, companyFit: 69, voiceAIOpp: 65, timing: 70, budget: 65 }, leadStatus: 'warm' },
  { id: '37', firstName: 'Dave', lastName: 'Bautista', fullName: 'Dave Bautista', email: 'dbautista@drax.tech', phone: '+1 555-1514', title: 'VP Sales', company: { id: '34', name: 'Drax Technologies', domain: 'drax.tech' }, department: 'Sales', seniority: 'VP', authorityScore: 78, decisionMaker: true, influencer: false, aiScore: { overall: 69, companyFit: 71, voiceAIOpp: 64, timing: 73, budget: 68 }, leadStatus: 'warm' },
  { id: '38', firstName: 'Bradley', lastName: 'Cooper', fullName: 'Bradley Cooper', email: 'bcooper@rocket.ai', title: 'Chief Product Officer', company: { id: '35', name: 'Rocket AI', domain: 'rocket.ai' }, department: 'Product', seniority: 'C-Level', authorityScore: 91, decisionMaker: true, influencer: true, aiScore: { overall: 93, companyFit: 95, voiceAIOpp: 94, timing: 91, budget: 90 }, leadStatus: 'hot' },
  { id: '39', firstName: 'Vin', lastName: 'Diesel', fullName: 'Vin Diesel', email: 'vdiesel@groot.tech', linkedinUrl: 'https://linkedin.com/in/vindiesel', title: 'CEO', company: { id: '36', name: 'Groot Technologies', domain: 'groot.tech' }, department: 'Executive', seniority: 'C-Level', authorityScore: 95, decisionMaker: true, influencer: true, aiScore: { overall: 85, companyFit: 87, voiceAIOpp: 82, timing: 88, budget: 84 }, leadStatus: 'hot' },
  { id: '40', firstName: 'Chris', lastName: 'Pratt', fullName: 'Chris Pratt', email: 'cpratt@starlord.io', phone: '+1 555-1615', title: 'Founder & CEO', company: { id: '37', name: 'Star-Lord Ventures', domain: 'starlord.io' }, department: 'Executive', seniority: 'C-Level', authorityScore: 96, decisionMaker: true, influencer: true, aiScore: { overall: 87, companyFit: 89, voiceAIOpp: 85, timing: 90, budget: 86 }, leadStatus: 'hot' },
  { id: '41', firstName: 'Samuel', lastName: 'Jackson', fullName: 'Samuel L. Jackson', email: 'sjackson@shield.tech', title: 'Director', company: { id: '38', name: 'SHIELD Technologies', domain: 'shield.tech' }, department: 'Executive', seniority: 'C-Level', authorityScore: 99, decisionMaker: true, influencer: true, aiScore: { overall: 89, companyFit: 91, voiceAIOpp: 86, timing: 92, budget: 88 }, leadStatus: 'hot' },
  { id: '42', firstName: 'Cobie', lastName: 'Smulders', fullName: 'Cobie Smulders', email: 'csmulders@hill.io', linkedinUrl: 'https://linkedin.com/in/cobiesmulders', title: 'Deputy Director', company: { id: '38', name: 'SHIELD Technologies', domain: 'shield.tech' }, department: 'Operations', seniority: 'VP', authorityScore: 85, decisionMaker: true, influencer: true, aiScore: { overall: 82, companyFit: 84, voiceAIOpp: 79, timing: 85, budget: 81 }, leadStatus: 'warm' },
  { id: '43', firstName: 'Clark', lastName: 'Gregg', fullName: 'Clark Gregg', email: 'cgregg@coulson.tech', phone: '+1 555-1716', title: 'Operations Director', company: { id: '38', name: 'SHIELD Technologies', domain: 'shield.tech' }, department: 'Operations', seniority: 'Director', authorityScore: 75, decisionMaker: false, influencer: true, aiScore: { overall: 76, companyFit: 78, voiceAIOpp: 73, timing: 79, budget: 75 }, leadStatus: 'warm' },
  { id: '44', firstName: 'Jon', lastName: 'Favreau', fullName: 'Jon Favreau', email: 'jfavreau@happy.io', title: 'Head of Security', company: { id: '1', name: 'TechCorp Inc', domain: 'techcorp.com' }, department: 'Security', seniority: 'Director', authorityScore: 70, decisionMaker: false, influencer: false, aiScore: { overall: 65, companyFit: 67, voiceAIOpp: 62, timing: 68, budget: 64 }, leadStatus: 'cold' },
  { id: '45', firstName: 'Gwyneth', lastName: 'Paltrow', fullName: 'Gwyneth Paltrow', email: 'gpaltrow@potts.ventures', linkedinUrl: 'https://linkedin.com/in/gwynethpaltrow', title: 'CEO', company: { id: '39', name: 'Potts Ventures', domain: 'potts.ventures' }, department: 'Executive', seniority: 'C-Level', authorityScore: 94, decisionMaker: true, influencer: true, aiScore: { overall: 83, companyFit: 85, voiceAIOpp: 80, timing: 86, budget: 82 }, leadStatus: 'warm' },
  { id: '46', firstName: 'Jeff', lastName: 'Bridges', fullName: 'Jeff Bridges', email: 'jbridges@stane.tech', phone: '+1 555-1817', title: 'Chairman', company: { id: '40', name: 'Stane Industries', domain: 'stane.tech' }, department: 'Executive', seniority: 'C-Level', authorityScore: 92, decisionMaker: true, influencer: true, aiScore: { overall: 58, companyFit: 60, voiceAIOpp: 55, timing: 62, budget: 57 }, leadStatus: 'cold' },
  { id: '47', firstName: 'Terrence', lastName: 'Howard', fullName: 'Terrence Howard', email: 'thoward@rhodes.io', title: 'Military Liaison', company: { id: '27', name: 'War Machine Industries', domain: 'warmachine.io' }, department: 'Government', seniority: 'Director', authorityScore: 73, decisionMaker: false, influencer: true, aiScore: { overall: 70, companyFit: 72, voiceAIOpp: 67, timing: 74, budget: 69 }, leadStatus: 'warm' },
  { id: '48', firstName: 'Tim', lastName: 'Roth', fullName: 'Tim Roth', email: 'troth@abomination.tech', linkedinUrl: 'https://linkedin.com/in/timroth', title: 'VP R&D', company: { id: '41', name: 'Abomination Labs', domain: 'abomination.tech' }, department: 'R&D', seniority: 'VP', authorityScore: 76, decisionMaker: true, influencer: false, aiScore: { overall: 52, companyFit: 54, voiceAIOpp: 48, timing: 56, budget: 51 }, leadStatus: 'cold' },
  { id: '49', firstName: 'Liv', lastName: 'Tyler', fullName: 'Liv Tyler', email: 'ltyler@cellular.bio', phone: '+1 555-1918', title: 'Chief Science Officer', company: { id: '42', name: 'Cellular Biosciences', domain: 'cellular.bio' }, department: 'Science', seniority: 'C-Level', authorityScore: 87, decisionMaker: true, influencer: true, aiScore: { overall: 80, companyFit: 82, voiceAIOpp: 77, timing: 83, budget: 79 }, leadStatus: 'warm' },
  { id: '50', firstName: 'William', lastName: 'Hurt', fullName: 'William Hurt', email: 'whurt@thunderbolt.gov', title: 'Secretary', company: { id: '43', name: 'Thunderbolt Agency', domain: 'thunderbolt.gov' }, department: 'Government', seniority: 'C-Level', authorityScore: 93, decisionMaker: true, influencer: true, aiScore: { overall: 61, companyFit: 63, voiceAIOpp: 58, timing: 65, budget: 60 }, leadStatus: 'cold' },
  { id: '51', firstName: 'Hugo', lastName: 'Weaving', fullName: 'Hugo Weaving', email: 'hweaving@redskull.io', linkedinUrl: 'https://linkedin.com/in/hugoweaving', title: 'Former CEO', company: { id: '44', name: 'HYDRA Tech', domain: 'redskull.io' }, department: 'Executive', seniority: 'C-Level', authorityScore: 88, decisionMaker: true, influencer: true, aiScore: { overall: 45, companyFit: 47, voiceAIOpp: 42, timing: 50, budget: 44 }, leadStatus: 'cold' },
  { id: '52', firstName: 'Hayley', lastName: 'Atwell', fullName: 'Hayley Atwell', email: 'hatwell@carter.agency', phone: '+1 555-2019', title: 'Director', company: { id: '45', name: 'Carter Agency', domain: 'carter.agency' }, department: 'Executive', seniority: 'C-Level', authorityScore: 91, decisionMaker: true, influencer: true, aiScore: { overall: 84, companyFit: 86, voiceAIOpp: 81, timing: 87, budget: 83 }, leadStatus: 'hot' },
  { id: '53', firstName: 'Tommy', lastName: 'Lee', fullName: 'Tommy Lee Jones', email: 'tljones@phillips.mil', title: 'Colonel', company: { id: '46', name: 'Phillips Command', domain: 'phillips.mil' }, department: 'Military', seniority: 'Director', authorityScore: 80, decisionMaker: true, influencer: false, aiScore: { overall: 55, companyFit: 57, voiceAIOpp: 52, timing: 59, budget: 54 }, leadStatus: 'cold' },
  { id: '54', firstName: 'Stanley', lastName: 'Tucci', fullName: 'Stanley Tucci', email: 'stucci@erskine.lab', linkedinUrl: 'https://linkedin.com/in/stanleytucci', title: 'Lead Scientist', company: { id: '47', name: 'Erskine Laboratory', domain: 'erskine.lab' }, department: 'Science', seniority: 'Director', authorityScore: 85, decisionMaker: true, influencer: true, aiScore: { overall: 78, companyFit: 80, voiceAIOpp: 75, timing: 81, budget: 77 }, leadStatus: 'warm' },
  { id: '55', firstName: 'Toby', lastName: 'Jones', fullName: 'Toby Jones', email: 'tjones@zola.ai', phone: '+1 555-2120', title: 'Chief Data Scientist', company: { id: '48', name: 'Zola AI', domain: 'zola.ai' }, department: 'Data Science', seniority: 'C-Level', authorityScore: 84, decisionMaker: true, influencer: true, aiScore: { overall: 48, companyFit: 50, voiceAIOpp: 45, timing: 52, budget: 47 }, leadStatus: 'cold' },
  { id: '56', firstName: 'Frank', lastName: 'Grillo', fullName: 'Frank Grillo', email: 'fgrillo@crossbones.sec', title: 'VP Security', company: { id: '49', name: 'Crossbones Security', domain: 'crossbones.sec' }, department: 'Security', seniority: 'VP', authorityScore: 74, decisionMaker: true, influencer: false, aiScore: { overall: 56, companyFit: 58, voiceAIOpp: 53, timing: 60, budget: 55 }, leadStatus: 'cold' },
  { id: '57', firstName: 'Emily', lastName: 'VanCamp', fullName: 'Emily VanCamp', email: 'evancamp@sharon.agency', linkedinUrl: 'https://linkedin.com/in/emilyvancamp', title: 'Agent Director', company: { id: '45', name: 'Carter Agency', domain: 'carter.agency' }, department: 'Operations', seniority: 'Director', authorityScore: 79, decisionMaker: true, influencer: true, aiScore: { overall: 81, companyFit: 83, voiceAIOpp: 78, timing: 84, budget: 80 }, leadStatus: 'warm' },
  { id: '58', firstName: 'Daniel', lastName: 'Bruhl', fullName: 'Daniel Bruhl', email: 'dbruhl@zemo.tech', phone: '+1 555-2221', title: 'Strategist', company: { id: '50', name: 'Zemo Strategies', domain: 'zemo.tech' }, department: 'Strategy', seniority: 'Director', authorityScore: 81, decisionMaker: true, influencer: true, aiScore: { overall: 59, companyFit: 61, voiceAIOpp: 56, timing: 63, budget: 58 }, leadStatus: 'cold' },
  { id: '59', firstName: 'Martin', lastName: 'Freeman', fullName: 'Martin Freeman', email: 'mfreeman@everett.gov', title: 'Deputy Director CIA', company: { id: '51', name: 'CIA Tech Division', domain: 'everett.gov' }, department: 'Government', seniority: 'VP', authorityScore: 86, decisionMaker: true, influencer: true, aiScore: { overall: 74, companyFit: 76, voiceAIOpp: 71, timing: 78, budget: 74 }, leadStatus: 'warm' },
  { id: '60', firstName: 'Andy', lastName: 'Serkis', fullName: 'Andy Serkis', email: 'aserkis@klaue.io', linkedinUrl: 'https://linkedin.com/in/andyserkis', title: 'Black Market Dealer', company: { id: '52', name: 'Klaue Industries', domain: 'klaue.io' }, department: 'Sales', seniority: 'C-Level', authorityScore: 72, decisionMaker: true, influencer: false, aiScore: { overall: 41, companyFit: 43, voiceAIOpp: 38, timing: 46, budget: 40 }, leadStatus: 'cold' },
  { id: '61', firstName: 'Michael', lastName: 'B', fullName: 'Michael B. Jordan', email: 'mbjordan@killmonger.tech', phone: '+1 555-2322', title: 'VP Operations', company: { id: '53', name: 'Killmonger Ops', domain: 'killmonger.tech' }, department: 'Operations', seniority: 'VP', authorityScore: 83, decisionMaker: true, influencer: true, aiScore: { overall: 63, companyFit: 65, voiceAIOpp: 60, timing: 68, budget: 62 }, leadStatus: 'cold' },
  { id: '62', firstName: 'Florence', lastName: 'Kasumba', fullName: 'Florence Kasumba', email: 'fkasumba@ayo.tech', title: 'Security Chief', company: { id: '29', name: 'Wakanda Technologies', domain: 'wakandatech.com' }, department: 'Security', seniority: 'Director', authorityScore: 77, decisionMaker: false, influencer: true, aiScore: { overall: 79, companyFit: 81, voiceAIOpp: 76, timing: 82, budget: 78 }, leadStatus: 'warm' },
  { id: '63', firstName: 'John', lastName: 'Kani', fullName: 'John Kani', email: 'jkani@tchaka.legacy', linkedinUrl: 'https://linkedin.com/in/johnkani', title: 'Chairman Emeritus', company: { id: '29', name: 'Wakanda Technologies', domain: 'wakandatech.com' }, department: 'Board', seniority: 'C-Level', authorityScore: 89, decisionMaker: true, influencer: true, aiScore: { overall: 75, companyFit: 77, voiceAIOpp: 72, timing: 79, budget: 74 }, leadStatus: 'warm' },
  { id: '64', firstName: 'Angela', lastName: 'Bassett', fullName: 'Angela Bassett', email: 'abassett@ramonda.royal', phone: '+1 555-2423', title: 'Queen Mother', company: { id: '54', name: 'Ramonda Foundation', domain: 'ramonda.royal' }, department: 'Executive', seniority: 'C-Level', authorityScore: 95, decisionMaker: true, influencer: true, aiScore: { overall: 88, companyFit: 90, voiceAIOpp: 85, timing: 91, budget: 87 }, leadStatus: 'hot' },
  { id: '65', firstName: 'Forest', lastName: 'Whitaker', fullName: 'Forest Whitaker', email: 'fwhitaker@zuri.spiritual', title: 'Chief Advisor', company: { id: '55', name: 'Zuri Advisors', domain: 'zuri.spiritual' }, department: 'Advisory', seniority: 'C-Level', authorityScore: 87, decisionMaker: true, influencer: true, aiScore: { overall: 71, companyFit: 73, voiceAIOpp: 68, timing: 75, budget: 70 }, leadStatus: 'warm' },
  { id: '66', firstName: 'Rachel', lastName: 'McAdams', fullName: 'Rachel McAdams', email: 'rmcadams@palmer.medical', linkedinUrl: 'https://linkedin.com/in/rachelmcadams', title: 'Chief Medical Officer', company: { id: '56', name: 'Palmer Medical', domain: 'palmer.medical' }, department: 'Medical', seniority: 'C-Level', authorityScore: 88, decisionMaker: true, influencer: true, aiScore: { overall: 82, companyFit: 84, voiceAIOpp: 79, timing: 85, budget: 81 }, leadStatus: 'warm' },
  { id: '67', firstName: 'Chiwetel', lastName: 'Ejiofor', fullName: 'Chiwetel Ejiofor', email: 'cejiofor@mordo.mystic', phone: '+1 555-2524', title: 'Master Sorcerer', company: { id: '57', name: 'Mordo Mystical Arts', domain: 'mordo.mystic' }, department: 'Spiritual', seniority: 'Director', authorityScore: 82, decisionMaker: true, influencer: true, aiScore: { overall: 64, companyFit: 66, voiceAIOpp: 61, timing: 68, budget: 63 }, leadStatus: 'cold' },
  { id: '68', firstName: 'Mads', lastName: 'Mikkelsen', fullName: 'Mads Mikkelsen', email: 'mmikkelsen@kaecilius.dark', title: 'Dark Master', company: { id: '58', name: 'Kaecilius Corp', domain: 'kaecilius.dark' }, department: 'Operations', seniority: 'C-Level', authorityScore: 84, decisionMaker: true, influencer: true, aiScore: { overall: 38, companyFit: 40, voiceAIOpp: 35, timing: 42, budget: 37 }, leadStatus: 'cold' },
  { id: '69', firstName: 'Tilda', lastName: 'Swinton', fullName: 'Tilda Swinton', email: 'tswinton@ancient.one', linkedinUrl: 'https://linkedin.com/in/tildaswinton', title: 'The Ancient One', company: { id: '59', name: 'Kamar-Taj Institute', domain: 'ancient.one' }, department: 'Leadership', seniority: 'C-Level', authorityScore: 99, decisionMaker: true, influencer: true, aiScore: { overall: 96, companyFit: 98, voiceAIOpp: 95, timing: 97, budget: 94 }, leadStatus: 'hot' },
  { id: '70', firstName: 'Wong', lastName: 'Benedict', fullName: 'Benedict Wong', email: 'wong@sanctum.io', phone: '+1 555-2625', title: 'Sanctum Guardian', company: { id: '60', name: 'Sanctum Sanctorum', domain: 'sanctum.io' }, department: 'Security', seniority: 'Director', authorityScore: 80, decisionMaker: true, influencer: true, aiScore: { overall: 86, companyFit: 88, voiceAIOpp: 84, timing: 89, budget: 85 }, leadStatus: 'hot' },
  { id: '71', firstName: 'Michael', lastName: 'Keaton', fullName: 'Michael Keaton', email: 'mkeaton@vulture.tech', title: 'CEO', company: { id: '61', name: 'Vulture Salvage', domain: 'vulture.tech' }, department: 'Executive', seniority: 'C-Level', authorityScore: 85, decisionMaker: true, influencer: true, aiScore: { overall: 51, companyFit: 53, voiceAIOpp: 48, timing: 55, budget: 50 }, leadStatus: 'cold' },
  { id: '72', firstName: 'Marisa', lastName: 'Tomei', fullName: 'Marisa Tomei', email: 'mtomei@may.foundation', linkedinUrl: 'https://linkedin.com/in/marisatomei', title: 'Foundation Director', company: { id: '62', name: 'May Foundation', domain: 'may.foundation' }, department: 'Philanthropy', seniority: 'Director', authorityScore: 76, decisionMaker: true, influencer: true, aiScore: { overall: 73, companyFit: 75, voiceAIOpp: 70, timing: 77, budget: 72 }, leadStatus: 'warm' },
  { id: '73', firstName: 'Jacob', lastName: 'Batalon', fullName: 'Jacob Batalon', email: 'jbatalon@ned.tech', phone: '+1 555-2726', title: 'Tech Support', company: { id: '63', name: 'Ned Technologies', domain: 'ned.tech' }, department: 'IT', seniority: 'Senior', authorityScore: 45, decisionMaker: false, influencer: false, aiScore: { overall: 62, companyFit: 64, voiceAIOpp: 59, timing: 66, budget: 61 }, leadStatus: 'cold' },
  { id: '74', firstName: 'Zendaya', lastName: 'Coleman', fullName: 'Zendaya', email: 'zendaya@mj.media', title: 'Creative Director', company: { id: '64', name: 'MJ Media', domain: 'mj.media' }, department: 'Creative', seniority: 'Director', authorityScore: 78, decisionMaker: true, influencer: true, aiScore: { overall: 77, companyFit: 79, voiceAIOpp: 74, timing: 81, budget: 76 }, leadStatus: 'warm' },
  { id: '75', firstName: 'Jake', lastName: 'Gyllenhaal', fullName: 'Jake Gyllenhaal', email: 'jgyllenhaal@mysterio.fx', linkedinUrl: 'https://linkedin.com/in/jakegyllenhaal', title: 'VFX Director', company: { id: '65', name: 'Mysterio FX', domain: 'mysterio.fx' }, department: 'Visual Effects', seniority: 'C-Level', authorityScore: 86, decisionMaker: true, influencer: true, aiScore: { overall: 54, companyFit: 56, voiceAIOpp: 51, timing: 58, budget: 53 }, leadStatus: 'cold' },
  { id: '76', firstName: 'Josh', lastName: 'Brolin', fullName: 'Josh Brolin', email: 'jbrolin@thanos.corp', phone: '+1 555-2827', title: 'Founder', company: { id: '66', name: 'Thanos Corporation', domain: 'thanos.corp' }, department: 'Executive', seniority: 'C-Level', authorityScore: 100, decisionMaker: true, influencer: true, aiScore: { overall: 35, companyFit: 37, voiceAIOpp: 32, timing: 40, budget: 34 }, leadStatus: 'cold' },
  { id: '77', firstName: 'James', lastName: 'Spader', fullName: 'James Spader', email: 'jspader@ultron.ai', title: 'AI Overlord', company: { id: '67', name: 'Ultron AI', domain: 'ultron.ai' }, department: 'AI', seniority: 'C-Level', authorityScore: 98, decisionMaker: true, influencer: true, aiScore: { overall: 32, companyFit: 34, voiceAIOpp: 29, timing: 37, budget: 31 }, leadStatus: 'cold' },
  { id: '78', firstName: 'Aaron', lastName: 'Johnson', fullName: 'Aaron Taylor-Johnson', email: 'ajohnson@quicksilver.speed', linkedinUrl: 'https://linkedin.com/in/aarontaylorjohnson', title: 'VP Speed Operations', company: { id: '68', name: 'Quicksilver Logistics', domain: 'quicksilver.speed' }, department: 'Operations', seniority: 'VP', authorityScore: 79, decisionMaker: true, influencer: false, aiScore: { overall: 76, companyFit: 78, voiceAIOpp: 73, timing: 80, budget: 75 }, leadStatus: 'warm' },
  { id: '79', firstName: 'Kurt', lastName: 'Russell', fullName: 'Kurt Russell', email: 'krussell@ego.planet', phone: '+1 555-2928', title: 'Living Planet', company: { id: '69', name: 'Ego Enterprises', domain: 'ego.planet' }, department: 'Executive', seniority: 'C-Level', authorityScore: 97, decisionMaker: true, influencer: true, aiScore: { overall: 44, companyFit: 46, voiceAIOpp: 41, timing: 49, budget: 43 }, leadStatus: 'cold' },
  { id: '80', firstName: 'Michael', lastName: 'Douglas', fullName: 'Michael Douglas', email: 'mdouglas@pym.tech', title: 'Original Founder', company: { id: '70', name: 'Pym Technologies', domain: 'pym.tech' }, department: 'R&D', seniority: 'C-Level', authorityScore: 93, decisionMaker: true, influencer: true, aiScore: { overall: 91, companyFit: 93, voiceAIOpp: 90, timing: 92, budget: 89 }, leadStatus: 'hot' },
  { id: '81', firstName: 'Michelle', lastName: 'Pfeiffer', fullName: 'Michelle Pfeiffer', email: 'mpfeiffer@wasp.quantum', linkedinUrl: 'https://linkedin.com/in/michellepfeiffer', title: 'Quantum Researcher', company: { id: '71', name: 'Wasp Quantum Labs', domain: 'wasp.quantum' }, department: 'Research', seniority: 'C-Level', authorityScore: 90, decisionMaker: true, influencer: true, aiScore: { overall: 89, companyFit: 91, voiceAIOpp: 87, timing: 92, budget: 88 }, leadStatus: 'hot' },
  { id: '82', firstName: 'Paul', lastName: 'Rudd', fullName: 'Paul Rudd', email: 'prudd@antman.micro', phone: '+1 555-3029', title: 'CEO', company: { id: '72', name: 'Ant-Man Microsystems', domain: 'antman.micro' }, department: 'Executive', seniority: 'C-Level', authorityScore: 88, decisionMaker: true, influencer: true, aiScore: { overall: 87, companyFit: 89, voiceAIOpp: 85, timing: 90, budget: 86 }, leadStatus: 'hot' },
  { id: '83', firstName: 'Evangeline', lastName: 'Lilly', fullName: 'Evangeline Lilly', email: 'elilly@hope.pym', title: 'CEO Pym Tech', company: { id: '70', name: 'Pym Technologies', domain: 'pym.tech' }, department: 'Executive', seniority: 'C-Level', authorityScore: 94, decisionMaker: true, influencer: true, aiScore: { overall: 92, companyFit: 94, voiceAIOpp: 91, timing: 93, budget: 90 }, leadStatus: 'hot' },
  { id: '84', firstName: 'Laurence', lastName: 'Fishburne', fullName: 'Laurence Fishburne', email: 'lfishburne@goliath.tech', linkedinUrl: 'https://linkedin.com/in/laurencefishburne', title: 'Former CEO', company: { id: '73', name: 'Goliath Technologies', domain: 'goliath.tech' }, department: 'Advisory', seniority: 'C-Level', authorityScore: 86, decisionMaker: true, influencer: true, aiScore: { overall: 78, companyFit: 80, voiceAIOpp: 75, timing: 82, budget: 77 }, leadStatus: 'warm' },
  { id: '85', firstName: 'Hannah', lastName: 'John', fullName: 'Hannah John-Kamen', email: 'hjohnkamen@ghost.phase', phone: '+1 555-3130', title: 'Phasing Specialist', company: { id: '74', name: 'Ghost Phase Tech', domain: 'ghost.phase' }, department: 'R&D', seniority: 'Director', authorityScore: 75, decisionMaker: true, influencer: false, aiScore: { overall: 68, companyFit: 70, voiceAIOpp: 65, timing: 72, budget: 67 }, leadStatus: 'warm' },
  { id: '86', firstName: 'Walton', lastName: 'Goggins', fullName: 'Walton Goggins', email: 'wgoggins@sonny.deals', title: 'Black Market Boss', company: { id: '75', name: 'Sonny Burch Deals', domain: 'sonny.deals' }, department: 'Sales', seniority: 'C-Level', authorityScore: 71, decisionMaker: true, influencer: false, aiScore: { overall: 47, companyFit: 49, voiceAIOpp: 44, timing: 52, budget: 46 }, leadStatus: 'cold' },
  { id: '87', firstName: 'Kathryn', lastName: 'Newton', fullName: 'Kathryn Newton', email: 'knewton@cassie.hero', linkedinUrl: 'https://linkedin.com/in/kathrynnewton', title: 'Young Hero', company: { id: '76', name: 'Cassie Lang Foundation', domain: 'cassie.hero' }, department: 'Philanthropy', seniority: 'Manager', authorityScore: 55, decisionMaker: false, influencer: true, aiScore: { overall: 75, companyFit: 77, voiceAIOpp: 72, timing: 79, budget: 74 }, leadStatus: 'warm' },
  { id: '88', firstName: 'Jonathan', lastName: 'Majors', fullName: 'Jonathan Majors', email: 'jmajors@kang.dynasty', phone: '+1 555-3231', title: 'Conqueror', company: { id: '77', name: 'Kang Dynasty', domain: 'kang.dynasty' }, department: 'Executive', seniority: 'C-Level', authorityScore: 100, decisionMaker: true, influencer: true, aiScore: { overall: 29, companyFit: 31, voiceAIOpp: 26, timing: 34, budget: 28 }, leadStatus: 'cold' },
  { id: '89', firstName: 'Bill', lastName: 'Murray', fullName: 'Bill Murray', email: 'bmurray@krylar.party', title: 'Party Host', company: { id: '78', name: 'Krylar Parties', domain: 'krylar.party' }, department: 'Events', seniority: 'C-Level', authorityScore: 68, decisionMaker: true, influencer: false, aiScore: { overall: 53, companyFit: 55, voiceAIOpp: 50, timing: 58, budget: 52 }, leadStatus: 'cold' },
  { id: '90', firstName: 'Simu', lastName: 'Liu', fullName: 'Simu Liu', email: 'sliu@shangchi.martial', linkedinUrl: 'https://linkedin.com/in/simuliu', title: 'Master of Martial Arts', company: { id: '79', name: 'Shang-Chi Academy', domain: 'shangchi.martial' }, department: 'Training', seniority: 'C-Level', authorityScore: 89, decisionMaker: true, influencer: true, aiScore: { overall: 84, companyFit: 86, voiceAIOpp: 81, timing: 88, budget: 83 }, leadStatus: 'hot' },
  { id: '91', firstName: 'Awkwafina', lastName: 'Nora', fullName: 'Awkwafina', email: 'awkwafina@katy.drive', phone: '+1 555-3332', title: 'Chief Valet', company: { id: '80', name: 'Katy Valet Services', domain: 'katy.drive' }, department: 'Operations', seniority: 'Manager', authorityScore: 52, decisionMaker: false, influencer: true, aiScore: { overall: 66, companyFit: 68, voiceAIOpp: 63, timing: 70, budget: 65 }, leadStatus: 'warm' },
  { id: '92', firstName: 'Tony', lastName: 'Leung', fullName: 'Tony Leung', email: 'tleung@wenwu.rings', title: 'Immortal Warlord', company: { id: '81', name: 'Ten Rings Organization', domain: 'wenwu.rings' }, department: 'Executive', seniority: 'C-Level', authorityScore: 99, decisionMaker: true, influencer: true, aiScore: { overall: 42, companyFit: 44, voiceAIOpp: 39, timing: 47, budget: 41 }, leadStatus: 'cold' },
  { id: '93', firstName: 'Meng\'er', lastName: 'Zhang', fullName: 'Meng\'er Zhang', email: 'mzhang@xialing.empire', linkedinUrl: 'https://linkedin.com/in/mengerzhang', title: 'New Leader', company: { id: '81', name: 'Ten Rings Organization', domain: 'wenwu.rings' }, department: 'Executive', seniority: 'C-Level', authorityScore: 92, decisionMaker: true, influencer: true, aiScore: { overall: 69, companyFit: 71, voiceAIOpp: 66, timing: 73, budget: 68 }, leadStatus: 'warm' },
  { id: '94', firstName: 'Michelle', lastName: 'Yeoh', fullName: 'Michelle Yeoh', email: 'myeoh@yingli.tao', phone: '+1 555-3433', title: 'Aunt', company: { id: '82', name: 'Ying Li Sanctuary', domain: 'yingli.tao' }, department: 'Spiritual', seniority: 'Director', authorityScore: 87, decisionMaker: true, influencer: true, aiScore: { overall: 80, companyFit: 82, voiceAIOpp: 77, timing: 84, budget: 79 }, leadStatus: 'warm' },
  { id: '95', firstName: 'Gemma', lastName: 'Chan', fullName: 'Gemma Chan', email: 'gchan@sersi.eternal', title: 'Eternal', company: { id: '83', name: 'Eternals Foundation', domain: 'sersi.eternal' }, department: 'Leadership', seniority: 'C-Level', authorityScore: 94, decisionMaker: true, influencer: true, aiScore: { overall: 85, companyFit: 87, voiceAIOpp: 82, timing: 89, budget: 84 }, leadStatus: 'hot' },
  { id: '96', firstName: 'Richard', lastName: 'Madden', fullName: 'Richard Madden', email: 'rmadden@ikaris.sky', linkedinUrl: 'https://linkedin.com/in/richardmadden', title: 'Prime Eternal', company: { id: '83', name: 'Eternals Foundation', domain: 'sersi.eternal' }, department: 'Operations', seniority: 'VP', authorityScore: 91, decisionMaker: true, influencer: true, aiScore: { overall: 57, companyFit: 59, voiceAIOpp: 54, timing: 61, budget: 56 }, leadStatus: 'cold' },
  { id: '97', firstName: 'Kumail', lastName: 'Nanjiani', fullName: 'Kumail Nanjiani', email: 'knanjiani@kingo.bollywood', phone: '+1 555-3534', title: 'Bollywood Star', company: { id: '84', name: 'Kingo Productions', domain: 'kingo.bollywood' }, department: 'Entertainment', seniority: 'C-Level', authorityScore: 83, decisionMaker: true, influencer: true, aiScore: { overall: 72, companyFit: 74, voiceAIOpp: 69, timing: 76, budget: 71 }, leadStatus: 'warm' },
  { id: '98', firstName: 'Lia', lastName: 'McHugh', fullName: 'Lia McHugh', email: 'lmchugh@sprite.illusion', title: 'Illusionist', company: { id: '85', name: 'Sprite Illusions', domain: 'sprite.illusion' }, department: 'Creative', seniority: 'Manager', authorityScore: 58, decisionMaker: false, influencer: true, aiScore: { overall: 64, companyFit: 66, voiceAIOpp: 61, timing: 68, budget: 63 }, leadStatus: 'warm' },
  { id: '99', firstName: 'Brian', lastName: 'Henry', fullName: 'Brian Tyree Henry', email: 'bhenry@phastos.tech', linkedinUrl: 'https://linkedin.com/in/brianhenry', title: 'Chief Technology Officer', company: { id: '86', name: 'Phastos Technologies', domain: 'phastos.tech' }, department: 'Engineering', seniority: 'C-Level', authorityScore: 96, decisionMaker: true, influencer: true, aiScore: { overall: 94, companyFit: 96, voiceAIOpp: 95, timing: 93, budget: 92 }, leadStatus: 'hot' },
  { id: '100', firstName: 'Lauren', lastName: 'Ridloff', fullName: 'Lauren Ridloff', email: 'lridloff@makkari.speed', phone: '+1 555-3635', title: 'Speed Eternal', company: { id: '87', name: 'Makkari Logistics', domain: 'makkari.speed' }, department: 'Operations', seniority: 'VP', authorityScore: 85, decisionMaker: true, influencer: true, aiScore: { overall: 83, companyFit: 85, voiceAIOpp: 80, timing: 87, budget: 82 }, leadStatus: 'hot' },
  { id: '101', firstName: 'Barry', lastName: 'Keoghan', fullName: 'Barry Keoghan', email: 'bkeoghan@druig.mind', title: 'Mind Controller', company: { id: '88', name: 'Druig Mind Sciences', domain: 'druig.mind' }, department: 'Research', seniority: 'Director', authorityScore: 80, decisionMaker: true, influencer: true, aiScore: { overall: 61, companyFit: 63, voiceAIOpp: 58, timing: 65, budget: 60 }, leadStatus: 'cold' },
  { id: '102', firstName: 'Salma', lastName: 'Hayek', fullName: 'Salma Hayek', email: 'shayek@ajak.eternal', linkedinUrl: 'https://linkedin.com/in/salmahayek', title: 'Prime Eternal Leader', company: { id: '83', name: 'Eternals Foundation', domain: 'sersi.eternal' }, department: 'Leadership', seniority: 'C-Level', authorityScore: 98, decisionMaker: true, influencer: true, aiScore: { overall: 90, companyFit: 92, voiceAIOpp: 88, timing: 94, budget: 89 }, leadStatus: 'hot' },
];

export function ContactsView() {
  const [contacts, setContacts] = React.useState<Contact[]>(SAMPLE_CONTACTS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [seniorityFilter, setSeniorityFilter] = React.useState<string>('all');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.leadStatus === statusFilter;
    const matchesSeniority = seniorityFilter === 'all' || c.seniority === seniorityFilter;

    return matchesSearch && matchesStatus && matchesSeniority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-theme">Contacts</h2>
          <p className="text-sm text-theme-secondary">
            {contacts.length} contacts across {new Set(contacts.map((c) => c.company.id)).size} companies
          </p>
        </div>
        <button className="btn-primary">
          <Sparkles className="mr-2 h-4 w-4" />
          Find New Contacts
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-tertiary" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2">
          {['all', 'hot', 'warm', 'cold'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                statusFilter === status
                  ? status === 'hot'
                    ? 'status-hot'
                    : status === 'warm'
                    ? 'status-warm'
                    : status === 'cold'
                    ? 'status-cold'
                    : 'bg-theme-tertiary text-theme'
                  : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-tertiary'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Seniority Filter */}
        <select
          value={seniorityFilter}
          onChange={(e) => setSeniorityFilter(e.target.value)}
          className="h-9 rounded-xl bg-theme-tertiary border border-theme px-3 text-sm text-theme"
        >
          <option value="all">All Seniority</option>
          <option value="C-Level">C-Level</option>
          <option value="VP">VP</option>
          <option value="Director">Director</option>
          <option value="Manager">Manager</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      {/* Contacts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-theme-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-theme-secondary">No contacts found</h3>
          <p className="text-sm text-theme-tertiary mt-1">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}

// Contact Card Component
function ContactCard({ contact }: { contact: Contact }) {
  const [showScoreTooltip, setShowScoreTooltip] = React.useState(false);

  return (
    <div className="glass-card p-5 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-theme font-medium">
            {contact.firstName[0]}
            {contact.lastName[0]}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-theme truncate group-hover:text-purple-400 transition-colors">
              {contact.fullName}
            </h3>
            <p className="text-sm text-theme-secondary truncate">{contact.title}</p>
          </div>
        </div>

        {/* AI Score Badge */}
        {contact.aiScore && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowScoreTooltip(true)}
              onMouseLeave={() => setShowScoreTooltip(false)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium border transition-colors',
                contact.aiScore.overall >= 80
                  ? 'score-high border-green-500/30'
                  : contact.aiScore.overall >= 60
                  ? 'score-medium border-yellow-500/30'
                  : 'score-low border-red-500/30'
              )}
            >
              <Zap className="h-3.5 w-3.5" />
              {contact.aiScore.overall}
            </button>

            {/* Score Tooltip */}
            {showScoreTooltip && (
              <div className="absolute right-0 top-full mt-2 z-10 w-48 p-3 rounded-xl dropdown-bg border border-theme shadow-xl">
                <p className="text-xs font-medium text-theme mb-2">Score Breakdown</p>
                <div className="space-y-2">
                  <ScoreRow label="Company Fit" value={contact.aiScore.companyFit} />
                  <ScoreRow label="Voice AI Opp" value={contact.aiScore.voiceAIOpp} />
                  <ScoreRow label="Timing" value={contact.aiScore.timing} />
                  <ScoreRow label="Budget" value={contact.aiScore.budget} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Company */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Building2 className="h-4 w-4 text-theme-tertiary" />
        <span className="text-theme-secondary">{contact.company.name}</span>
      </div>

      {/* Status & Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <LeadStatusBadge status={contact.leadStatus} />
        {contact.decisionMaker && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium icon-bg-purple icon-color-purple">
            Decision Maker
          </span>
        )}
        {contact.influencer && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium icon-bg-blue icon-color-blue">
            Influencer
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-theme">
        <div className="flex items-center gap-2">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="p-2 rounded-lg hover:bg-theme-tertiary transition-colors text-theme-secondary hover:text-theme"
              title="Send Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-theme-tertiary transition-colors text-theme-secondary hover:text-theme"
              title="View LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="p-2 rounded-lg hover:bg-theme-tertiary transition-colors text-theme-secondary hover:text-theme"
              title="Call"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
        </div>

        <button className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
          <MessageSquare className="h-4 w-4" />
          Generate Pitch
        </button>
      </div>
    </div>
  );
}

// Lead Status Badge
function LeadStatusBadge({ status }: { status: 'hot' | 'warm' | 'cold' }) {
  const styles = {
    hot: 'status-hot',
    warm: 'status-warm',
    cold: 'status-cold',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', styles[status])}>
      {status}
    </span>
  );
}

// Score Row for Tooltip
function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-theme-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-theme-tertiary overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              value >= 80 ? 'bg-green-400' : value >= 60 ? 'bg-yellow-400' : 'bg-red-400'
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs text-theme-secondary w-8 text-right">{value}</span>
      </div>
    </div>
  );
}

export default ContactsView;
