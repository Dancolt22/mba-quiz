# scripts/build_full_database.py
import json
import os
import sys

import gen_mba8101
import gen_mba8103
import gen_mba8105
import gen_mba8107
import gen_mba8109
import gen_mba8111

os.makedirs("src/data/questions", exist_ok=True)

# Target counts:
# MBA 8101: 167
# MBA 8103: 167
# MBA 8105: 167
# MBA 8107: 167
# MBA 8109: 166
# MBA 8111: 166
# Total = 1000

def complete_questions(q_list, target_count, course_code, course_title):
    current = list(q_list)
    prefix = course_code.replace(" ", "")
    existing_len = len(current)
    print(f"[{course_code}] Loaded {existing_len} curated questions. Target: {target_count}")
    
    # If we need more questions, systematically create rich, high-yield thematic questions
    # to guarantee exact count with complete conceptual depth
    if len(current) < target_count:
        # Load comprehensive topic templates
        from question_bank_expander import expand_course_questions
        current = expand_course_questions(current, target_count, course_code, course_title, prefix)

    # Re-index cleanly from 1 to target_count
    final_qs = []
    seen_questions = set()
    for idx, q in enumerate(current[:target_count], 1):
        q_id = f"{prefix}_{idx:03d}"
        clean_q = {
            "id": q_id,
            "courseCode": course_code,
            "courseTitle": course_title,
            "topic": q.get("topic", "Core Fundamentals"),
            "question": q["question"].strip(),
            "options": [opt.strip() for opt in q["options"]],
            "correctAnswer": int(q["correctAnswer"]),
            "explanation": q["explanation"].strip()
        }
        # Check validation
        assert len(clean_q["options"]) == 4, f"Question {q_id} does not have 4 options!"
        assert 0 <= clean_q["correctAnswer"] <= 3, f"Question {q_id} has invalid correct answer index!"
        final_qs.append(clean_q)
    
    return final_qs

print("Database builder script ready.")
