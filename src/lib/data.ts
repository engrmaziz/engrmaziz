export const personalInfo = {
  name: 'Musharraf Aziz',
  title: 'AI Engineer & Full-Stack Developer',
  taglines: [
    'AI Engineer',
    'Full-Stack Developer',
    'LLM Systems Specialist',
    'Next.js Developer',
    'Multimodal AI Builder',
  ],
  subtitle: 'Building production-grade AI systems & modern web applications',
  email: 'musharrafaziz@outlook.com',
  phone: '+92 315 482 3517',
  whatsapp: 'https://wa.me/923154823517',
  location: 'Kasur, Pakistan',
  locationNote: 'Open to Remote / Relocation',
  github: 'https://github.com/engrmaziz',
  linkedin: 'https://www.linkedin.com/in/musharrafaziz',
  portfolio: 'https://engrmaziz.github.io/portfolio/',
  cvPath: '/Cv.docx',
  bio: `Results-driven AI Engineer and Full-Stack Web Developer with a B.S. in
Electrical Engineering from COMSATS University and 3+ years of technical
leadership across healthcare, telecom, and manufacturing. Specialized in
LLM-powered applications, multimodal AI systems, and predictive SaaS platforms
using Gemini 2.5 Flash, Groq LPU, PyTorch, Next.js 15, and FastAPI. Proven
ability to architect and ship complex AI products independently — from system
design to cloud deployment. Registered Engineer (PEC) and peer-reviewed
researcher published in MDPI Sustainability (Impact Factor 3.125).`,
  stats: [
    { value: '21+', label: 'GitHub Repositories' },
    { value: '3+', label: 'Years Technical Leadership' },
    { value: '1', label: 'Peer-Reviewed Publication' },
    { value: '99.9%', label: 'Uptime Delivered' },
  ],
}

export const skills = [
  {
    category: 'AI / Machine Learning',
    icon: 'Brain',
    color: '#8B5CF6',
    items: [
      'Gemini 2.5 Flash', 'Groq LPU', 'Llama 3.3 70B', 'PyTorch',
      'LSTM', 'GAN', 'RAG', 'Prompt Engineering',
      'Multimodal AI', 'AI Agents', 'LLM Integration',
    ],
  },
  {
    category: 'Frontend',
    icon: 'Monitor',
    color: '#06B6D4',
    items: [
      'Next.js 15', 'React', 'TypeScript', 'JavaScript',
      'Tailwind CSS', 'HTML5', 'CSS3', 'Framer Motion', 'Responsive UI',
    ],
  },
  {
    category: 'Backend',
    icon: 'Server',
    color: '#10B981',
    items: [
      'FastAPI', 'Node.js', 'Python', 'REST APIs',
      'Streaming APIs', 'Middleware Design', 'Server-Side Rendering',
    ],
  },
  {
    category: 'Database & Auth',
    icon: 'Database',
    color: '#F59E0B',
    items: [
      'PostgreSQL', 'Supabase', 'Redis', 'SQL',
      'Row-Level Security', 'Multi-tenancy', 'Data Modeling',
    ],
  },
  {
    category: 'DevOps & Cloud',
    icon: 'Cloud',
    color: '#3B82F6',
    items: [
      'Vercel', 'Railway.app', 'Git', 'GitHub',
      'CI/CD', 'Linux', 'Docker',
    ],
  },
  {
    category: 'Systems & IoT',
    icon: 'Cpu',
    color: '#EF4444',
    items: [
      'IT Infrastructure', 'GPON / Fiber Networks', 'LoRaWAN',
      'IoT Sensors', 'Huawei NMS', 'Electrical Systems', 'SCADA',
    ],
  },
]

export const projects = [
  {
    id: 1,
    title: 'Overwatch AI',
    subtitle: 'Multimodal Scam Detection Engine',
    description:
      'Real-time threat intelligence platform using Gemini 2.5 Flash to ' +
      'simultaneously analyze audio, image, and text inputs for AI-generated ' +
      'scam detection with a cinematic command-center UI.',
    tags: ['AI/ML'],
    stack: ['Gemini 2.5 Flash', 'TypeScript', 'Next.js 15', 'FastAPI', 'Python'],
    github: 'https://github.com/engrmaziz/overwatch-ai',
    featured: true,
    color: '#8B5CF6',
  },
  {
    id: 2,
    title: 'AegisFlow',
    subtitle: 'Enterprise Financial SaaS (InvoiceIQ)',
    description:
      'Predictive liquidity forecasting engine using LSTM neural networks ' +
      'and GAN-augmented synthetic data for client cash flow risk scoring. ' +
      'Full-stack SaaS with multi-tenancy and real-time dashboards.',
    tags: ['AI/ML', 'Full-Stack'],
    stack: ['PyTorch', 'LSTM', 'GAN', 'Next.js 15', 'FastAPI', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/engrmaziz/AegisFlow',
    featured: true,
    color: '#F59E0B',
  },
  {
    id: 3,
    title: 'Green Navigator',
    subtitle: 'B2B Carbon Accounting SaaS',
    description:
      'OCR-powered document intelligence pipeline using Gemini to extract ' +
      'Scope 1/2 emission data from unstructured utility bills and automate ' +
      'GHG accounting workflows for corporate sustainability reporting.',
    tags: ['AI/ML', 'Full-Stack'],
    stack: ['Gemini 3.1 Flash', 'TypeScript', 'Next.js 15', 'Supabase'],
    github: 'https://github.com/engrmaziz/green-navigator',
    featured: true,
    color: '#10B981',
  },
  {
    id: 4,
    title: 'AI Chatbot (Groq)',
    subtitle: 'High-Performance LLM Inference',
    description:
      'Llama 3.3 70B deployed on Groq LPU achieving sub-100ms token latency. ' +
      'Streaming chat interface with context-window management and ' +
      'session persistence.',
    tags: ['AI/ML'],
    stack: ['Groq LPU', 'Llama 3.3 70B', 'Next.js 15', 'TypeScript', 'Supabase'],
    github: 'https://github.com/engrmaziz/7aichatbot',
    featured: false,
    color: '#06B6D4',
  },
  {
    id: 5,
    title: 'Organic Harvest',
    subtitle: 'Boutique E-Commerce Engine',
    description:
      'High-performance Next.js 15 e-commerce platform with zero-hydration ' +
      'PDF invoice generation, localized WhatsApp CRM order flow, and custom ' +
      'admin order vault.',
    tags: ['Full-Stack'],
    stack: ['Next.js 15', 'TypeScript', 'WhatsApp API', 'PDF Generation'],
    github: 'https://github.com/engrmaziz/organic-harvest',
    featured: false,
    color: '#3B82F6',
  },
  {
    id: 6,
    title: 'Asset-Thief',
    subtitle: 'Chrome Extension (Manifest V3)',
    description:
      'High-performance Chrome extension for scanning, previewing, and ' +
      'bulk-downloading SVG and image assets from any webpage with a ' +
      'streamlined developer interface.',
    tags: ['Tools'],
    stack: ['JavaScript', 'Chrome Extension API', 'Manifest V3'],
    github: 'https://github.com/engrmaziz/Asset-Thief',
    featured: false,
    color: '#EF4444',
  },
]

export const experience = [
  {
    id: 1,
    title: 'Operations & IT Manager',
    subtitle: 'AI Integration Lead',
    company: 'Allama Iqbal Hospital Kasur',
    location: 'Kasur, Pakistan',
    period: 'Aug 2024 – Present',
    current: true,
    bullets: [
      '99.9% uptime across 10+ departments serving 1,000+ daily patients',
      'Led end-to-end 100 kW Solar PV installation — site assessment through commissioning',
      'Designing Python/ML pipelines to automate patient flow analytics and predictive maintenance',
      'Increased operational efficiency by 18%, reduced critical downtime by 25%',
      'Awarded High-Performance Excellence Award (June 2025)',
    ],
  },
  {
    id: 2,
    title: 'IT Manager',
    subtitle: 'E-Commerce Technology Lead',
    company: 'NovaSole Pakistan',
    location: 'Kasur, Pakistan',
    period: 'Dec 2023 – Aug 2024',
    current: false,
    bullets: [
      'Architected complete IT infrastructure: ERP, e-commerce, network, CCTV, biometrics',
      'Managed 500K+ monthly visitor website; improved order processing speed by 30%',
      'Digitalized 5 departments — data accuracy above 98%, manual processing cut by 25%',
    ],
  },
  {
    id: 3,
    title: 'Team Lead',
    subtitle: 'Quality Assurance & NOC Development',
    company: 'Ihsan Solar Energy Pvt. Ltd.',
    location: 'Raiwind, Pakistan',
    period: 'Dec 2022 – Dec 2023',
    current: false,
    bullets: [
      'Built Network Operations Center from scratch; reduced system downtime by 20%',
      'Led QA team of 4 engineers overseeing 400+ kW installed capacity',
      'Developed 10+ inspection protocols; reduced operational faults by 25%',
      'Awarded Productivity Leader Award (July 2023)',
    ],
  },
  {
    id: 4,
    title: 'Team Lead',
    subtitle: 'Technical Assistance Center',
    company: 'Transworld Home (ISP)',
    location: 'Lahore, Pakistan',
    period: 'Mar 2022 – Nov 2022',
    current: false,
    bullets: [
      'Led 14-engineer TAC team for GPON/fiber networks; 98% SLA resolution rate',
      '99.95% uptime maintained for 50K+ active connections via Huawei iMaster NCE',
      'Reduced average fault resolution time by 18% through training programs',
    ],
  },
  {
    id: 5,
    title: 'Technical Support Engineer',
    subtitle: '',
    company: 'Sybrid',
    location: 'Lahore, Pakistan',
    period: 'Sep 2021 – Mar 2022',
    current: false,
    bullets: [
      'Resolved 50+ daily GPON/fiber issues for 250K+ users — 90% first-call resolution',
      'Awarded Top Performer (Nov 2021), Call of Fame (Dec 2021), Top Quality Champ (Jan 2022)',
    ],
  },
]

export const education = {
  degree: 'B.S. (Hons.) Electrical Engineering',
  institution: 'COMSATS University Islamabad, Lahore Campus',
  period: 'Sep 2017 – Aug 2021',
  level: 'EQF Level 6',
  highlights: [
    'Final Year Project: LoRaWAN-based Smart Agriculture Decision Support System',
    'Awarded Top Innovative FYP of the Year by IGNITE & Higher Education Commission (2021)',
    'Research published in MDPI Sustainability — co-authored peer-reviewed paper on IoT/ML',
  ],
}

export const certifications = [
  { name: 'McKinsey Forward Program', issuer: 'McKinsey.org', year: '2025',
    link: 'https://www.credly.com/badges/e51a4355-9e5f-402d-9eb7-75e7aeebe43e/public_url' },
  { name: 'Fundamentals of Predictive Project Management', issuer: 'PMI',
    link: 'https://www.credly.com/badges/1ab2594a-a7fd-449e-8787-afb5e9fdfa06/public_url' },
  { name: 'AI for Business Professionals', issuer: 'HP LIFE',
    link: 'https://www.life-global.org/certificate/e2f08aab-a03c-47e2-a762-5dd9ea7e4335' },
  { name: 'Registered Electrical Engineer', issuer: 'Pakistan Engineering Council (PEC)', year: '2021',
    link: 'https://verification.pec.org.pk/v/eV/sED/i.aspx?eid=322F303931363630' },
  { name: 'Entrepreneurship – From Ideas to Reality', issuer: 'OpenLearn' },
  { name: 'Project Governance & PMO', issuer: 'OpenLearn' },
]

export const publication = {
  authors: 'Arshad J., Aziz M., et al.',
  year: '2022',
  title:
    'Implementation of a LoRaWAN Based Smart Agriculture Decision Support System for Optimum Crop Yield',
  journal: 'Sustainability',
  publisher: 'MDPI',
  volume: '14(2)',
  pages: '827',
  doi: '10.3390/su14020827',
  impactFactor: '3.125',
  link: 'https://www.mdpi.com/2071-1050/14/2/827',
}

export const sectionContent = {
  about: {
    label: 'WHO I AM',
    title: 'About Me',
  },
  skills: {
    label: 'WHAT I USE',
    title: 'Technical Skills',
  },
  projects: {
    label: 'SELECTED WORK',
    title: 'Featured Projects',
    subtitle: 'Production-grade systems built across AI, SaaS, and developer tools.',
    filters: ['All', 'AI/ML', 'Full-Stack', 'Tools'],
    viewCode: 'View Code',
  },
  experience: {
    label: 'CAREER PATH',
    title: 'Professional Experience',
    currentBadge: 'CURRENT',
  },
  education: {
    label: 'ACADEMIC BACKGROUND',
    title: 'Education & Credentials',
    certTitle: 'Certifications & Licenses',
    igniteBadge: 'IGNITE Award Winner 2021',
  },
  publication: {
    label: 'RESEARCH',
    title: 'Publication',
    badge: 'PEER-REVIEWED RESEARCH',
    readPaper: 'Read Paper',
    impactPrefix: 'IF:',
  },
  contact: {
    label: 'GET IN TOUCH',
    title: "Let's Work Together",
    intro:
      "I'm currently open to AI Engineering roles and high-impact technical collaborations. Whether you have a project in mind or just want to connect, I'd love to hear from you.",
    whatsappLabel: 'WhatsApp',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    successMessage: "Message sent! I'll get back to you soon.",
    fields: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
    },
  },
}