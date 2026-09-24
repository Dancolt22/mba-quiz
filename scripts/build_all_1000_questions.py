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

# Master question builder
def build_course(gen_module, target_count, course_code, course_title, prefix):
    raw_qs = gen_module.get_questions()
    expanded = question_bank_expander.expand_course_questions(raw_qs, target_count, course_code, course_title, prefix)
    
    final_list = []
    seen = set()
    for idx, q in enumerate(expanded[:target_count], 1):
        clean_id = f"{prefix}_{idx:03d}"
        q_text = q["question"].strip()
        opts = [opt.strip() for opt in q["options"]]
        ans = int(q["correctAnswer"])
        exp = q["explanation"].strip()
        topic = q.get("topic", "Core Fundamentals").strip()
        
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
            "topic": topic,
            "question": q_text,
            "options": opts,
            "correctAnswer": ans,
            "explanation": exp
        })
    
    print(f"[{course_code}] Successfully built {len(final_list)} validated questions.")
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
