# MBA Quiz — Executive Assessment Platform

An interactive React-based examination and study platform designed for MBA candidates. Featuring an AC Milan (*Rossoneri & Gold*) executive theme, non-repeating Fisher-Yates shuffle logic, and **1,000 verified questions** evenly distributed across 6 core MBA disciplines.

---

## 📚 Core Courses (1,000 Questions)

| Course Code | Course Title | Question Count | Key Syllabus Modules |
| :--- | :--- | :---: | :--- |
| **MBA 8101** | **Business Environment** | **167** | PESTEL Analysis, Porter's Five Forces, Fiscal/Monetary Policies, WTO, CSR, ESG & Corporate Governance |
| **MBA 8103** | **Entrepreneurship** | **167** | Lean Startup, Business Model Canvas, Cap Tables, Venture Capital, Term Sheets & Growth Strategies |
| **MBA 8105** | **Management Information Systems** | **167** | ERP (SAP/Oracle), CRM, SCM, Relational DBMS (SQL), Cloud (IaaS/PaaS/SaaS), Cybersecurity & Agile |
| **MBA 8107** | **Organisational Behaviour** | **167** | Big Five / MBTI, Motivation Models (Maslow/Herzberg/Vroom), Team Dynamics (Tuckman), Leadership & Culture |
| **MBA 8109** | **General Management** | **166** | Classical & Modern Management (Taylor/Fayol/Weber), POLC Functions, Strategic Frameworks (BCG/VRIO) & TQM |
| **MBA 8111** | **Operations Management** | **166** | Little's Law, Capacity, EOQ, Lean / 7 Wastes (Muda), SPC Control Charts ($C_{pk}$), CPM/PERT & Forecasting |

**Total:** **1,000 Verified Academic Questions with Full Explanations**

---

## ✨ Features

- **Intuitive Landing Page**: Easily select 1, multiple, or all 6 courses to attempt in a single test session.
- **Fisher-Yates Shuffle Engine**: Uniform, non-biased random shuffling of both question order and option choices while tracking correct answers.
- **Zero-Repetition Tracking**: Sessions prioritize unseen questions using `localStorage` history.
- **Flexible Test Modes**:
  - **Timed Exam**: 60 seconds per question with countdown alerts and final grading (Distinction, Merit, Pass, Fail).
  - **Practice Mode**: Instant answer feedback and in-depth academic explanations on click.
- **Interactive Question Matrix**: Quick-jump grid showing answered, flagged, current, and unanswered questions.
- **Results & Performance Analytics**: Course-by-course breakdown and comprehensive review filter (All, Incorrect, Correct, Flagged).
- **1,000 Question Bank & Study Hub**: Dedicated browser to search by keyword/framework and review questions.
- **AC Milan (*Rossoneri*) Theme**: Refined aesthetic with Rossoneri Red, San Siro Carbon Black, and Championship Gold accents with Light/Dark mode support.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Dancolt22/mba-quiz.git
cd mba-quiz

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:3000/`.

### Production Build

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS with custom executive design tokens (Zero neon)
- **Icons**: Lucide React
- **Confetti**: Canvas Confetti
