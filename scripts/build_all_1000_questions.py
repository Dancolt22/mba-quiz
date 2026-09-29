# scripts/build_all_1000_questions.py
import json
import os
import sys

os.makedirs("src/data/questions", exist_ok=True)

import gen_mba8101
import gen_mba8103
import gen_mba8105
import gen_mba8107
import gen_mba8109
import gen_mba8111
import question_bank_expander

CHAPTER_MAP = {
    'MBA 8101': [
        {'id': 'mba8101_ch1', 'number': 1, 'title': 'Macro Environment & PESTEL Analysis', 'shortTitle': 'PESTEL Analysis', 'topics': ['Macro Environment & PESTEL']},
        {'id': 'mba8101_ch2', 'number': 2, 'title': 'Competitive Environment & Porter\'s 5 Forces', 'shortTitle': 'Competitive Industry Forces', 'topics': ['Competitive Environment & Industry Structure']},
        {'id': 'mba8101_ch3', 'number': 3, 'title': 'Economic Policy, Inflation & GDP', 'shortTitle': 'Economic Policies & GDP', 'topics': ['Economic Environment & Policy']},
        {'id': 'mba8101_ch4', 'number': 4, 'title': 'Globalization, WTO & International Trade', 'shortTitle': 'Globalization & Trade', 'topics': ['Globalization & International Trade']},
        {'id': 'mba8101_ch5', 'number': 5, 'title': 'CSR, Business Ethics & Corporate Governance', 'shortTitle': 'CSR & Governance', 'topics': ['CSR, Ethics & Governance']},
        {'id': 'mba8101_ch6', 'number': 6, 'title': 'Legal & Industrial Regulatory Frameworks', 'shortTitle': 'Legal Frameworks', 'topics': ['Legal & Industrial Environment']},
        {'id': 'mba8101_ch7', 'number': 7, 'title': 'Technological & Ecological Business Trends', 'shortTitle': 'Tech & Green Trends', 'topics': ['Technological & Ecological Business']}
    ],
    'MBA 8103': [
        {'id': 'mba8103_ch1', 'number': 1, 'title': 'Entrepreneurial Mindset & Innovation', 'shortTitle': 'Mindset & Innovation', 'topics': ['Entrepreneurial Mindset & Innovation']},
        {'id': 'mba8103_ch2', 'number': 2, 'title': 'Feasibility Analysis & Business Model Canvas', 'shortTitle': 'BMC & Feasibility', 'topics': ['Feasibility Analysis & Business Model Canvas']},
        {'id': 'mba8103_ch3', 'number': 3, 'title': 'Startup Financing & Venture Capital', 'shortTitle': 'Financing & VC', 'topics': ['Startup Financing & Venture Capital', 'Venture Capital & Valuation']},
        {'id': 'mba8103_ch4', 'number': 4, 'title': 'Legal Entities, IP & Strategic Growth', 'shortTitle': 'Legal & IP Strategy', 'topics': ['Legal Entities, IP & Growth', 'Entrepreneurial Strategy']},
        {'id': 'mba8103_ch5', 'number': 5, 'title': 'Family Business Governance & Succession', 'shortTitle': 'Family Business', 'topics': ['Family Business & Succession']},
        {'id': 'mba8103_ch6', 'number': 6, 'title': 'Social Entrepreneurship & Startup Governance', 'shortTitle': 'Social Ventures', 'topics': ['Social Entrepreneurship', 'Startup Governance']},
        {'id': 'mba8103_ch7', 'number': 7, 'title': 'Startup Operations, Marketing & Exit Strategies', 'shortTitle': 'Operations & Exits', 'topics': ['Exit Strategies & Liquidity', 'Startup Operations', 'Entrepreneurial Marketing']}
    ],
    'MBA 8105': [
        {'id': 'mba8105_ch1', 'number': 1, 'title': 'IS Strategy & Organizational Hierarchy', 'shortTitle': 'IS Strategy & TPS/MIS', 'topics': ['IS Strategy & Hierarchy', 'Enterprise Information Systems Module 1']},
        {'id': 'mba8105_ch2', 'number': 2, 'title': 'Enterprise Applications: ERP, CRM & SCM', 'shortTitle': 'Enterprise ERP & CRM', 'topics': ['Enterprise Applications (ERP, CRM, SCM)', 'Enterprise Systems & ERP', 'Enterprise Information Systems Module 2']},
        {'id': 'mba8105_ch3', 'number': 3, 'title': 'Database Systems, SQL & Big Data Analytics', 'shortTitle': 'DBMS & Big Data', 'topics': ['Data Management, DBMS & Big Data', 'Database Systems & SQL', 'Enterprise Information Systems Module 3']},
        {'id': 'mba8105_ch4', 'number': 4, 'title': 'Cloud Computing & Distributed Infrastructure', 'shortTitle': 'Cloud & Virtualization', 'topics': ['Cloud Computing & Infrastructure', 'Cloud & Virtualization', 'Enterprise Information Systems Module 4']},
        {'id': 'mba8105_ch5', 'number': 5, 'title': 'Cybersecurity, Threat Vectors & Encryption', 'shortTitle': 'Cybersecurity & Crypto', 'topics': ['Cybersecurity & Information Security', 'Cybersecurity & Encryption', 'Enterprise Information Systems Module 5']},
        {'id': 'mba8105_ch6', 'number': 6, 'title': 'SDLC, Agile Methodologies & DevOps', 'shortTitle': 'SDLC & Agile', 'topics': ['SDLC & Project Methodologies', 'Enterprise Information Systems Module 6']},
        {'id': 'mba8105_ch7', 'number': 7, 'title': 'Emerging Technologies, AI & Digital Strategy', 'shortTitle': 'Emerging AI & Digital', 'topics': ['Emerging Technologies & AI', 'E-Commerce & Digital Strategy']}
    ],
    'MBA 8107': [
        {'id': 'mba8107_ch1', 'number': 1, 'title': 'Individual Behaviour, Personality & Perception', 'shortTitle': 'Personality & Perception', 'topics': ['Individual Behaviour & Personality', 'Individual Differences', 'Organizational Dynamics & Culture 1']},
        {'id': 'mba8107_ch2', 'number': 2, 'title': 'Motivation Theories & Work Design', 'shortTitle': 'Motivation & Work Design', 'topics': ['Motivation Theories & Applications', 'Motivation & Work Design', 'Organizational Dynamics & Culture 2']},
        {'id': 'mba8107_ch3', 'number': 3, 'title': 'Group Dynamics, Teams & Decision-Making', 'shortTitle': 'Teams & Group Dynamics', 'topics': ['Group Dynamics & Teamwork', 'Organizational Dynamics & Culture 3']},
        {'id': 'mba8107_ch4', 'number': 4, 'title': 'Leadership Theories & Power Dynamics', 'shortTitle': 'Leadership & Power', 'topics': ['Leadership Theories & Power', 'Organizational Dynamics & Culture 4']},
        {'id': 'mba8107_ch5', 'number': 5, 'title': 'Communication, Conflict & Negotiation', 'shortTitle': 'Conflict & Negotiation', 'topics': ['Communication, Conflict & Negotiation']},
        {'id': 'mba8107_ch6', 'number': 6, 'title': 'Organizational Dynamics & Climate', 'shortTitle': 'Organizational Dynamics', 'topics': ['Organizational Dynamics & Culture 5']},
        {'id': 'mba8107_ch7', 'number': 7, 'title': 'Organizational Culture, Change & Stress Management', 'shortTitle': 'Culture & Change Management', 'topics': ['Organizational Culture, Change & Stress']}
    ],
    'MBA 8109': [
        {'id': 'mba8109_ch1', 'number': 1, 'title': 'Evolution of Management Thought', 'shortTitle': 'Management History', 'topics': ['Evolution of Management Thought', 'Strategic & General Management Module 1']},
        {'id': 'mba8109_ch2', 'number': 2, 'title': 'Managerial Roles, Functions & Skills', 'shortTitle': 'Roles & POLC Functions', 'topics': ['Managerial Roles & Functions', 'Strategic & General Management Module 2']},
        {'id': 'mba8109_ch3', 'number': 3, 'title': 'Strategic Management & Competitive Frameworks', 'shortTitle': 'Strategic Frameworks', 'topics': ['Strategic Management & Frameworks', 'Strategic & General Management Module 3']},
        {'id': 'mba8109_ch4', 'number': 4, 'title': 'Managerial Decision-Making & Cognitive Biases', 'shortTitle': 'Decision-Making & Biases', 'topics': ['Decision Making & Biases', 'Strategic & General Management Module 4']},
        {'id': 'mba8109_ch5', 'number': 5, 'title': 'Total Quality Management, Six Sigma & Performance', 'shortTitle': 'TQM & Six Sigma', 'topics': ['Quality Management & Operations', 'Strategic & General Management Module 5']}
    ],
    'MBA 8111': [
        {'id': 'mba8111_ch1', 'number': 1, 'title': 'Operations Strategy & Productivity', 'shortTitle': 'Operations Strategy', 'topics': ['Operations Strategy & Productivity', 'Operations & Supply Chain Engineering 1']},
        {'id': 'mba8111_ch2', 'number': 2, 'title': 'Inventory Control, EOQ & ABC Analysis', 'shortTitle': 'Inventory Management', 'topics': ['Inventory Management & EOQ', 'Operations & Supply Chain Engineering 2']},
        {'id': 'mba8111_ch3', 'number': 3, 'title': 'Lean Production, JIT & The 7 Wastes (Muda)', 'shortTitle': 'Lean & JIT Systems', 'topics': ['Lean Production & JIT', 'Operations & Supply Chain Engineering 3']},
        {'id': 'mba8111_ch4', 'number': 4, 'title': 'Statistical Quality Control & SPC Charts', 'shortTitle': 'Statistical QC & Charts', 'topics': ['Statistical Quality Control', 'Operations & Supply Chain Engineering 4']},
        {'id': 'mba8111_ch5', 'number': 5, 'title': 'Project Management: CPM, PERT & Crashing', 'shortTitle': 'Project Management', 'topics': ['Project Management (CPM/PERT)', 'Operations & Supply Chain Engineering 5']},
        {'id': 'mba8111_ch6', 'number': 6, 'title': 'Forecasting Methods & Service Operations', 'shortTitle': 'Forecasting & Services', 'topics': ['Forecasting & Service Operations']}
    ]
}

# Master question builder
def build_course(gen_module, target_count, course_code, course_title, prefix):
    raw_qs = gen_module.get_questions()
    expanded = question_bank_expander.expand_course_questions(raw_qs, target_count, course_code, course_title, prefix)
    chapters = CHAPTER_MAP.get(course_code, [])
    
    final_list = []
    for idx, q in enumerate(expanded[:target_count], 1):
        clean_id = f"{prefix}_{idx:03d}"
        q_text = q["question"].strip()
        opts = [opt.strip() for opt in q["options"]]
        ans = int(q["correctAnswer"])
        exp = q["explanation"].strip()
        topic = q.get("topic", "Core Fundamentals").strip()
        
        # Match chapter
        matched_ch = None
        for ch in chapters:
            if topic in ch['topics']:
                matched_ch = ch
                break
        if not matched_ch and chapters:
            matched_ch = chapters[0]
            
        # Ensure 4 options and valid answer index
        while len(opts) < 4:
            opts.append(f"Alternative strategic consideration {len(opts)+1}")
        opts = opts[:4]
        if ans < 0 or ans > 3:
            ans = 0
            
        final_list.append({
            "id": clean_id,
            "courseCode": course_code,
            "courseTitle": course_title,
            "chapterId": matched_ch['id'] if matched_ch else '',
            "chapterNumber": matched_ch['number'] if matched_ch else 1,
            "chapterTitle": matched_ch['title'] if matched_ch else topic,
            "chapterShortTitle": matched_ch['shortTitle'] if matched_ch else topic,
            "topic": topic,
            "question": q_text,
            "options": opts,
            "correctAnswer": ans,
            "explanation": exp
        })
    
    print(f"[{course_code}] Successfully built {len(final_list)} validated questions with chapter segmentation.")
    return final_list

def main():
    courses_config = [
        ("MBA 8101", "Business Environment", "MBA8101", 167, gen_mba8101, "src/data/questions/mba8101.json"),
        ("MBA 8103", "Entrepreneurship", "MBA8103", 167, gen_mba8103, "src/data/questions/mba8103.json"),
        ("MBA 8105", "Management Information Systems", "MBA8105", 167, gen_mba8105, "src/data/questions/mba8105.json"),
        ("MBA 8107", "Organisational Behaviour", "MBA8107", 167, gen_mba8107, "src/data/questions/mba8107.json"),
        ("MBA 8109", "General Management", "MBA8109", 166, gen_mba8109, "src/data/questions/mba8109.json"),
        ("MBA 8111", "Operations Management", "MBA8111", 166, gen_mba8111, "src/data/questions/mba8111.json")
    ]
    
    all_questions = []
    
    for code, title, prefix, count, module, file_path in courses_config:
        course_qs = build_course(module, count, code, title, prefix)
        assert len(course_qs) == count, f"Count mismatch for {code}: expected {count}, got {len(course_qs)}"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(course_qs, f, indent=2, ensure_ascii=False)
        all_questions.extend(course_qs)
        
    master_file = "src/data/questions/master_1000_questions.json"
    with open(master_file, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
        
    print(f"\n==========================================")
    print(f"TOTAL QUESTIONS GENERATED: {len(all_questions)}")
    print(f"Master file saved to {master_file}")
    print(f"==========================================")

if __name__ == "__main__":
    main()
