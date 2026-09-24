// src/data/courses.js
// Metadata and configuration for the 6 MBA courses styled in AC Milan (Rossoneri) aesthetic

import mba8101 from './questions/mba8101.json';
import mba8103 from './questions/mba8103.json';
import mba8105 from './questions/mba8105.json';
import mba8107 from './questions/mba8107.json';
import mba8109 from './questions/mba8109.json';
import mba8111 from './questions/mba8111.json';

export const COURSES = [
  {
    id: 'mba8101',
    code: 'MBA 8101',
    title: 'Business Environment',
    shortTitle: 'Business Environment',
    description: 'Macro & micro environmental forces, PESTEL analysis, Porter\'s five forces, monetary & fiscal policies, globalization, WTO, ESG, and corporate governance.',
    questionCount: 167,
    questions: mba8101,
    color: '#C8102E', // Iconic AC Milan Rossoneri Red
    accentColor: '#99001A',
    bgGradient: 'from-red-950 to-neutral-950',
    iconName: 'Globe2',
    modules: [
      'Macro & Micro Environment (PESTEL)',
      'Competitive Environment & Porter\'s 5 Forces',
      'Economic Policy, Inflation & GDP',
      'Globalization, WTO & International Trade',
      'CSR, Business Ethics & Corporate Governance',
      'Legal & Regulatory Frameworks',
      'Technological & Ecological Business Trends'
    ]
  },
  {
    id: 'mba8103',
    code: 'MBA 8103',
    title: 'Entrepreneurship',
    shortTitle: 'Entrepreneurship',
    description: 'Venture creation, lean startup methodology, opportunity discovery, business model canvas, venture capital, cap tables, angel financing, IP, and growth scaling.',
    questionCount: 167,
    questions: mba8103,
    color: '#C5A059', // AC Milan Trophy Champagne Gold
    accentColor: '#8C6D2D',
    bgGradient: 'from-amber-950 to-neutral-950',
    iconName: 'Rocket',
    modules: [
      'Entrepreneurial Mindset & Innovation',
      'Opportunity Recognition & Design Thinking',
      'Feasibility Analysis & Business Model Canvas',
      'Startup Financing, Angel Investors & VC',
      'Cap Tables, Valuation & Term Sheets',
      'Legal Entities & Intellectual Property',
      'Franchising, M&A, and Exit Strategies'
    ]
  },
  {
    id: 'mba8105',
    code: 'MBA 8105',
    title: 'Management Information Systems',
    shortTitle: 'MIS',
    description: 'Strategic role of IT, ERP (SAP/Oracle), CRM, SCM, relational databases (SQL), cloud computing (IaaS/PaaS/SaaS), cybersecurity (CIA triad), and Agile/DevOps SDLC.',
    questionCount: 167,
    questions: mba8105,
    color: '#64748B', // San Siro Steel / Silver Grey
    accentColor: '#475569',
    bgGradient: 'from-slate-800 to-neutral-950',
    iconName: 'Database',
    modules: [
      'IS Strategy & Organizational Hierarchy',
      'Enterprise Systems: ERP, CRM, SCM',
      'DBMS, SQL, Data Warehousing & Big Data',
      'Cloud Computing & Distributed Infrastructure',
      'Cybersecurity, Threat Vectors & Encryption',
      'SDLC, Agile, Scrum & DevOps',
      'Emerging Technologies: AI, IoT & RPA'
    ]
  },
  {
    id: 'mba8107',
    code: 'MBA 8107',
    title: 'Organisational Behaviour',
    shortTitle: 'Organisational Behaviour',
    description: 'Individual psychology (Big Five, MBTI), motivation models (Maslow, Herzberg, Vroom, Equity), team dynamics (Tuckman, Groupthink), leadership, conflict, and organizational culture.',
    questionCount: 167,
    questions: mba8107,
    color: '#991B1B', // Deep Crimson Red
    accentColor: '#7F1D1D',
    bgGradient: 'from-red-950 to-neutral-950',
    iconName: 'Users2',
    modules: [
      'Individual Behaviour, Personality & Perception',
      'Attitudes, Job Satisfaction & Emotional Intelligence',
      'Motivation Theories (Maslow, Herzberg, Vroom, Equity)',
      'Group Dynamics, Teams & Decision-Making',
      'Leadership Theories & Power Dynamics',
      'Communication, Conflict & Negotiation',
      'Organizational Culture, Change & Stress Management'
    ]
  },
  {
    id: 'mba8109',
    code: 'MBA 8109',
    title: 'General Management',
    shortTitle: 'General Management',
    description: 'Evolution of management thought (Taylor, Fayol, Weber), POLC functions, Mintzberg roles, strategic management (BCG, Ansoff, VRIO), bounded rationality, and TQM/Six Sigma.',
    questionCount: 166,
    questions: mba8109,
    color: '#71717A', // Carbon Onyx / Titanium Grey
    accentColor: '#52525B',
    bgGradient: 'from-zinc-800 to-neutral-950',
    iconName: 'Briefcase',
    modules: [
      'Evolution of Management Thought (Taylor, Fayol, Weber)',
      'Human Relations & Systems Approach',
      'Managerial Roles (Mintzberg) & Katz Skills',
      'Planning, Organizing, Leading, Controlling (POLC)',
      'Strategic Frameworks (BCG, Ansoff, VRIO, Value Chain)',
      'Managerial Decision-Making & Cognitive Biases',
      'Total Quality Management (TQM), Six Sigma & Benchmarking'
    ]
  },
  {
    id: 'mba8111',
    code: 'MBA 8111',
    title: 'Operations Management',
    shortTitle: 'Operations Management',
    description: 'Process analysis & Little\'s law, capacity & location, EOQ inventory modeling, Lean / TPS 7 wastes, SPC control charts ($C_{pk}$), CPM/PERT project management, and forecasting.',
    questionCount: 166,
    questions: mba8111,
    color: '#A16207', // Classic Milan Star Gold / Bronze
    accentColor: '#713F12',
    bgGradient: 'from-yellow-950 to-neutral-950',
    iconName: 'Cpu',
    modules: [
      'Operations Strategy & Multi-Factor Productivity',
      'Process Flow Analysis, Little\'s Law & Bottlenecks',
      'Capacity Planning, Facility Location & Layout',
      'Inventory Control, EOQ, ROP & ABC Classification',
      'Lean Production, JIT & 7 Wastes (Muda)',
      'Statistical Quality Control & Control Charts (SPC)',
      'Project Management: CPM, PERT & Crashing',
      'Forecasting Methods & Service Operations'
    ]
  }
];

export const TOTAL_QUESTIONS_COUNT = COURSES.reduce((acc, c) => acc + c.questionCount, 0);

export function getCourseById(id) {
  return COURSES.find(c => c.id === id);
}

export function getAllQuestions() {
  return COURSES.flatMap(c => c.questions);
}
