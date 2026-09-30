// src/data/courses.js
// Metadata, chapter segmentation, and configurations for the 6 MBA courses styled in Modern Executive Academic palette

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
    color: '#3B82F6', // Royal Sapphire Blue
    accentColor: '#1D4ED8',
    bgGradient: 'from-blue-950 to-neutral-950',
    iconName: 'Globe2',
    modules: [
      'Macro & Micro Environment (PESTEL)',
      'Competitive Environment & Porter\'s 5 Forces',
      'Economic Policy, Inflation & GDP',
      'Globalization, WTO & International Trade',
      'CSR, Business Ethics & Corporate Governance',
      'Legal & Regulatory Frameworks',
      'Technological & Ecological Business Trends'
    ],
    chapters: [
      {
        id: 'mba8101_ch1',
        number: 1,
        title: 'Macro Environment & PESTEL Analysis',
        shortTitle: 'PESTEL Analysis',
        description: 'Macroeconomic forces, demographic shifts, environmental scanning, and PESTEL frameworks.',
        topics: ['Macro Environment & PESTEL'],
        questionCount: 20
      },
      {
        id: 'mba8101_ch2',
        number: 2,
        title: 'Competitive Environment & Porter\'s 5 Forces',
        shortTitle: 'Competitive Industry Forces',
        description: 'Industry rivalry, barriers to entry, buyer/supplier power, substitutes, and competitive dynamics.',
        topics: ['Competitive Environment & Industry Structure'],
        questionCount: 20
      },
      {
        id: 'mba8101_ch3',
        number: 3,
        title: 'Economic Policy, Inflation & GDP',
        shortTitle: 'Economic Policies & GDP',
        description: 'Fiscal and monetary policies, inflation, interest rates, exchange rates, and business cycles.',
        topics: ['Economic Environment & Policy'],
        questionCount: 25
      },
      {
        id: 'mba8101_ch4',
        number: 4,
        title: 'Globalization, WTO & International Trade',
        shortTitle: 'Globalization & Trade',
        description: 'Trade barriers, tariffs, WTO regulations, regional trade agreements, and FDI.',
        topics: ['Globalization & International Trade'],
        questionCount: 25
      },
      {
        id: 'mba8101_ch5',
        number: 5,
        title: 'CSR, Business Ethics & Corporate Governance',
        shortTitle: 'CSR & Governance',
        description: 'Corporate social responsibility, stakeholder theory, ESG compliance, and board governance.',
        topics: ['CSR, Ethics & Governance'],
        questionCount: 25
      },
      {
        id: 'mba8101_ch6',
        number: 6,
        title: 'Legal & Industrial Regulatory Frameworks',
        shortTitle: 'Legal Frameworks',
        description: 'Contract law, employment law, consumer protection, competition regulations, and compliance.',
        topics: ['Legal & Industrial Environment'],
        questionCount: 25
      },
      {
        id: 'mba8101_ch7',
        number: 7,
        title: 'Technological & Ecological Business Trends',
        shortTitle: 'Tech & Green Trends',
        description: 'Digital disruption, circular economy, sustainability, and technological adaptation.',
        topics: ['Technological & Ecological Business'],
        questionCount: 27
      }
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
    color: '#F59E0B', // Vibrant Amber Gold
    accentColor: '#D97706',
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
    ],
    chapters: [
      {
        id: 'mba8103_ch1',
        number: 1,
        title: 'Entrepreneurial Mindset & Innovation',
        shortTitle: 'Mindset & Innovation',
        description: 'Founder psychology, creative problem solving, disruptive innovation, and opportunity recognition.',
        topics: ['Entrepreneurial Mindset & Innovation'],
        questionCount: 25
      },
      {
        id: 'mba8103_ch2',
        number: 2,
        title: 'Feasibility Analysis & Business Model Canvas',
        shortTitle: 'BMC & Feasibility',
        description: 'Lean startup methodologies, value proposition design, customer segments, and business models.',
        topics: ['Feasibility Analysis & Business Model Canvas'],
        questionCount: 25
      },
      {
        id: 'mba8103_ch3',
        number: 3,
        title: 'Startup Financing & Venture Capital',
        shortTitle: 'Financing & VC',
        description: 'Bootstrapping, angel investors, venture capital rounds, convertible notes, and cap table math.',
        topics: ['Startup Financing & Venture Capital', 'Venture Capital & Valuation'],
        questionCount: 39
      },
      {
        id: 'mba8103_ch4',
        number: 4,
        title: 'Legal Entities, IP & Strategic Growth',
        shortTitle: 'Legal & IP Strategy',
        description: 'Corporate structures (LLC/C-Corp), patents, trademarks, copyright, and competitive moats.',
        topics: ['Legal Entities, IP & Growth', 'Entrepreneurial Strategy'],
        questionCount: 39
      },
      {
        id: 'mba8103_ch5',
        number: 5,
        title: 'Family Business Governance & Succession',
        shortTitle: 'Family Business',
        description: 'Multi-generational ownership, family constitutions, succession planning, and conflict governance.',
        topics: ['Family Business & Succession'],
        questionCount: 5
      },
      {
        id: 'mba8103_ch6',
        number: 6,
        title: 'Social Entrepreneurship & Startup Governance',
        shortTitle: 'Social Ventures',
        description: 'Triple bottom line ventures, B-Corp certifications, investor rights, and board fiduciary duties.',
        topics: ['Social Entrepreneurship', 'Startup Governance'],
        questionCount: 10
      },
      {
        id: 'mba8103_ch7',
        number: 7,
        title: 'Startup Operations, Marketing & Exit Strategies',
        shortTitle: 'Operations & Exits',
        description: 'Guerrilla/inbound marketing, ARR/CAC/LTV metrics, IPOs, acquisitions, and strategic liquidity.',
        topics: ['Exit Strategies & Liquidity', 'Startup Operations', 'Entrepreneurial Marketing'],
        questionCount: 24
      }
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
    color: '#6366F1', // Electric Indigo Blue
    accentColor: '#4F46E5',
    bgGradient: 'from-indigo-950 to-neutral-950',
    iconName: 'Database',
    modules: [
      'IS Strategy & Organizational Hierarchy',
      'Enterprise Systems: ERP, CRM, SCM',
      'DBMS, SQL, Data Warehousing & Big Data',
      'Cloud Computing & Distributed Infrastructure',
      'Cybersecurity, Threat Vectors & Encryption',
      'SDLC, Agile, Scrum & DevOps',
      'Emerging Technologies: AI, IoT & RPA'
    ],
    chapters: [
      {
        id: 'mba8105_ch1',
        number: 1,
        title: 'IS Strategy & Organizational Hierarchy',
        shortTitle: 'IS Strategy & TPS/MIS',
        description: 'TPS, MIS, DSS, ESS systems, CIO strategic alignment, and Business Process Reengineering (BPR).',
        topics: ['IS Strategy & Hierarchy', 'Enterprise Information Systems Module 1'],
        questionCount: 34
      },
      {
        id: 'mba8105_ch2',
        number: 2,
        title: 'Enterprise Applications: ERP, CRM & SCM',
        shortTitle: 'Enterprise ERP & CRM',
        description: 'SAP/Oracle ERP modules, supply chain integration, customer relationship management, and workflows.',
        topics: ['Enterprise Applications (ERP, CRM, SCM)', 'Enterprise Systems & ERP', 'Enterprise Information Systems Module 2'],
        questionCount: 26
      },
      {
        id: 'mba8105_ch3',
        number: 3,
        title: 'Database Systems, SQL & Big Data Analytics',
        shortTitle: 'DBMS & Big Data',
        description: 'Relational databases, SQL queries, normalization (3NF), data warehousing, and big data architecture.',
        topics: ['Data Management, DBMS & Big Data', 'Database Systems & SQL', 'Enterprise Information Systems Module 3'],
        questionCount: 28
      },
      {
        id: 'mba8105_ch4',
        number: 4,
        title: 'Cloud Computing & Distributed Infrastructure',
        shortTitle: 'Cloud & Virtualization',
        description: 'IaaS/PaaS/SaaS models, hypervisors, containers (Docker), and Kubernetes orchestration.',
        topics: ['Cloud Computing & Infrastructure', 'Cloud & Virtualization', 'Enterprise Information Systems Module 4'],
        questionCount: 22
      },
      {
        id: 'mba8105_ch5',
        number: 5,
        title: 'Cybersecurity, Threat Vectors & Encryption',
        shortTitle: 'Cybersecurity & Crypto',
        description: 'CIA triad, symmetric/asymmetric encryption, SQL injection, XSS, DDoS, and security governance.',
        topics: ['Cybersecurity & Information Security', 'Cybersecurity & Encryption', 'Enterprise Information Systems Module 5'],
        questionCount: 26
      },
      {
        id: 'mba8105_ch6',
        number: 6,
        title: 'SDLC, Agile Methodologies & DevOps',
        shortTitle: 'SDLC & Agile',
        description: 'Waterfall, Agile/Scrum sprints, CI/CD pipelines, DevOps culture, and software quality assurance.',
        topics: ['SDLC & Project Methodologies', 'Enterprise Information Systems Module 6'],
        questionCount: 24
      },
      {
        id: 'mba8105_ch7',
        number: 7,
        title: 'Emerging Technologies, AI & Digital Strategy',
        shortTitle: 'Emerging AI & Digital',
        description: 'Machine learning, IoT, RPA, digital disruption, and omnichannel e-commerce strategies.',
        topics: ['Emerging Technologies & AI', 'E-Commerce & Digital Strategy'],
        questionCount: 7
      }
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
    color: '#10B981', // Emerald Mint
    accentColor: '#059669',
    bgGradient: 'from-emerald-950 to-neutral-950',
    iconName: 'Users2',
    modules: [
      'Individual Behaviour, Personality & Perception',
      'Attitudes, Job Satisfaction & Emotional Intelligence',
      'Motivation Theories (Maslow, Herzberg, Vroom, Equity)',
      'Group Dynamics, Teams & Decision-Making',
      'Leadership Theories & Power Dynamics',
      'Communication, Conflict & Negotiation',
      'Organizational Culture, Change & Stress Management'
    ],
    chapters: [
      {
        id: 'mba8107_ch1',
        number: 1,
        title: 'Individual Behaviour, Personality & Perception',
        shortTitle: 'Personality & Perception',
        description: 'Big Five traits, MBTI, locus of control, emotional intelligence, cognitive biases, and perception.',
        topics: ['Individual Behaviour & Personality', 'Individual Differences', 'Organizational Dynamics & Culture 1'],
        questionCount: 35
      },
      {
        id: 'mba8107_ch2',
        number: 2,
        title: 'Motivation Theories & Work Design',
        shortTitle: 'Motivation & Work Design',
        description: 'Maslow, Herzberg two-factor, Vroom expectancy, Equity theory, and Hackman-Oldham Job Characteristics.',
        topics: ['Motivation Theories & Applications', 'Motivation & Work Design', 'Organizational Dynamics & Culture 2'],
        questionCount: 35
      },
      {
        id: 'mba8107_ch3',
        number: 3,
        title: 'Group Dynamics, Teams & Decision-Making',
        shortTitle: 'Teams & Group Dynamics',
        description: 'Tuckman 5 stages of team development, Groupthink, psychological safety, and team synergy.',
        topics: ['Group Dynamics & Teamwork', 'Organizational Dynamics & Culture 3'],
        questionCount: 29
      },
      {
        id: 'mba8107_ch4',
        number: 4,
        title: 'Leadership Theories & Power Dynamics',
        shortTitle: 'Leadership & Power',
        description: 'Transformational, transactional, situational leadership, Blake-Mouton grid, and French & Raven bases of power.',
        topics: ['Leadership Theories & Power', 'Organizational Dynamics & Culture 4'],
        questionCount: 31
      },
      {
        id: 'mba8107_ch5',
        number: 5,
        title: 'Communication, Conflict & Negotiation',
        shortTitle: 'Conflict & Negotiation',
        description: 'Shannon-Weaver communication, active listening, Thomas-Kilmann conflict modes, and principled negotiation.',
        topics: ['Communication, Conflict & Negotiation'],
        questionCount: 7
      },
      {
        id: 'mba8107_ch6',
        number: 6,
        title: 'Organizational Dynamics & Climate',
        shortTitle: 'Organizational Dynamics',
        description: 'Organizational justice (distributive/procedural), employee engagement, and positive work climate.',
        topics: ['Organizational Dynamics & Culture 5'],
        questionCount: 19
      },
      {
        id: 'mba8107_ch7',
        number: 7,
        title: 'Organizational Culture, Change & Stress Management',
        shortTitle: 'Culture & Change Management',
        description: 'Edgar Schein 3 levels of culture, Kotter 8-step change model, resistance to change, and workplace stress.',
        topics: ['Organizational Culture, Change & Stress'],
        questionCount: 11
      }
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
    color: '#8B5CF6', // Royal Purple / Violet
    accentColor: '#7C3AED',
    bgGradient: 'from-purple-950 to-neutral-950',
    iconName: 'Briefcase',
    modules: [
      'Evolution of Management Thought (Taylor, Fayol, Weber)',
      'Human Relations & Systems Approach',
      'Managerial Roles (Mintzberg) & Katz Skills',
      'Planning, Organizing, Leading, Controlling (POLC)',
      'Strategic Frameworks (BCG, Ansoff, VRIO, Value Chain)',
      'Managerial Decision-Making & Cognitive Biases',
      'Total Quality Management (TQM), Six Sigma & Benchmarking'
    ],
    chapters: [
      {
        id: 'mba8109_ch1',
        number: 1,
        title: 'Evolution of Management Thought',
        shortTitle: 'Management History',
        description: 'Scientific Management (Taylor), Administrative Theory (Fayol), Bureaucracy (Weber), and Human Relations (Hawthorne).',
        topics: ['Evolution of Management Thought', 'Strategic & General Management Module 1'],
        questionCount: 33
      },
      {
        id: 'mba8109_ch2',
        number: 2,
        title: 'Managerial Roles, Functions & Skills',
        shortTitle: 'Roles & POLC Functions',
        description: 'Planning, Organizing, Leading, Controlling (POLC), Mintzberg 10 roles, and Katz technical/human/conceptual skills.',
        topics: ['Managerial Roles & Functions', 'Strategic & General Management Module 2'],
        questionCount: 38
      },
      {
        id: 'mba8109_ch3',
        number: 3,
        title: 'Strategic Management & Competitive Frameworks',
        shortTitle: 'Strategic Frameworks',
        description: 'Mission/vision alignment, BCG Growth-Share Matrix, Ansoff Matrix, Porter Value Chain, and VRIO analysis.',
        topics: ['Strategic Management & Frameworks', 'Strategic & General Management Module 3'],
        questionCount: 34
      },
      {
        id: 'mba8109_ch4',
        number: 4,
        title: 'Managerial Decision-Making & Cognitive Biases',
        shortTitle: 'Decision-Making & Biases',
        description: 'Herbert Simon Bounded Rationality, satisficing, heuristics, framing bias, and sunk cost fallacy.',
        topics: ['Decision Making & Biases', 'Strategic & General Management Module 4'],
        questionCount: 29
      },
      {
        id: 'mba8109_ch5',
        number: 5,
        title: 'Total Quality Management, Six Sigma & Performance',
        shortTitle: 'TQM & Six Sigma',
        description: 'Deming PDCA cycle, Six Sigma DMAIC, Kaizen continuous improvement, benchmarking, and quality metrics.',
        topics: ['Quality Management & Operations', 'Strategic & General Management Module 5'],
        questionCount: 32
      }
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
    color: '#0EA5E9', // Sky Cyan / Azure
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950 to-neutral-950',
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
    ],
    chapters: [
      {
        id: 'mba8111_ch1',
        number: 1,
        title: 'Operations Strategy & Productivity',
        shortTitle: 'Operations Strategy',
        description: 'Multi-factor productivity metrics, competitive priorities, order qualifiers vs. order winners, and capacity.',
        topics: ['Operations Strategy & Productivity', 'Operations & Supply Chain Engineering 1'],
        questionCount: 34
      },
      {
        id: 'mba8111_ch2',
        number: 2,
        title: 'Inventory Control, EOQ & ABC Analysis',
        shortTitle: 'Inventory Management',
        description: 'Economic Order Quantity (EOQ), Reorder Point (ROP), Safety Stock calculations, and ABC inventory classification.',
        topics: ['Inventory Management & EOQ', 'Operations & Supply Chain Engineering 2'],
        questionCount: 32
      },
      {
        id: 'mba8111_ch3',
        number: 3,
        title: 'Lean Production, JIT & The 7 Wastes (Muda)',
        shortTitle: 'Lean & JIT Systems',
        description: 'Toyota Production System (TPS), 7 Wastes (Muda), 5S methodology, Kanban pull signals, and Poka-Yoke.',
        topics: ['Lean Production & JIT', 'Operations & Supply Chain Engineering 3'],
        questionCount: 34
      },
      {
        id: 'mba8111_ch4',
        number: 4,
        title: 'Statistical Quality Control & SPC Charts',
        shortTitle: 'Statistical QC & Charts',
        description: 'X-bar and R control charts, p-charts, process capability index (Cpk), and Six Sigma tolerance limits.',
        topics: ['Statistical Quality Control', 'Operations & Supply Chain Engineering 4'],
        questionCount: 30
      },
      {
        id: 'mba8111_ch5',
        number: 5,
        title: 'Project Management: CPM, PERT & Crashing',
        shortTitle: 'Project Management',
        description: 'Critical Path Method (CPM), PERT 3-point estimates, float/slack calculations, and project crashing.',
        topics: ['Project Management (CPM/PERT)', 'Operations & Supply Chain Engineering 5'],
        questionCount: 30
      },
      {
        id: 'mba8111_ch6',
        number: 6,
        title: 'Forecasting Methods & Service Operations',
        shortTitle: 'Forecasting & Services',
        description: 'Time-series forecasting, simple exponential smoothing, weighted moving averages, and service blueprints.',
        topics: ['Forecasting & Service Operations'],
        questionCount: 6
      }
    ]
  }
];

export const TOTAL_QUESTIONS_COUNT = COURSES.reduce((acc, c) => acc + c.questionCount, 0);
export const TOTAL_CHAPTERS_COUNT = COURSES.reduce((acc, c) => acc + (c.chapters ? c.chapters.length : 0), 0);

export function getCourseById(id) {
  if (!id) return null;
  const clean = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  return COURSES.find(c => c.id.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
}

export function getCourseByCode(code) {
  if (!code) return null;
  const clean = code.toLowerCase().replace(/[^a-z0-9]/g, '');
  return COURSES.find(c => c.code.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
}

export function getAllQuestions() {
  return COURSES.flatMap(c => c.questions);
}

export function getChaptersByCourseId(courseId) {
  const course = getCourseById(courseId);
  return course ? course.chapters || [] : [];
}

export function getAllChapters() {
  return COURSES.flatMap(c => (c.chapters || []).map(ch => ({ ...ch, courseId: c.id, courseCode: c.code, courseTitle: c.title, courseColor: c.color })));
}

export function getChapterById(chapterId) {
  for (const course of COURSES) {
    const found = (course.chapters || []).find(ch => ch.id === chapterId);
    if (found) {
      return { ...found, courseId: course.id, courseCode: course.code, courseTitle: course.title, courseColor: course.color };
    }
  }
  return null;
}
