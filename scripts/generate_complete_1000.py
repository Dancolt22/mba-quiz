# scripts/generate_complete_1000.py
import json
import os

os.makedirs("src/data/questions", exist_ok=True)

# Helper function
def make_q(q_id, course_code, course_title, topic, q_text, opts, correct_idx, exp_text):
    assert len(opts) == 4, f"Options must be 4, got {len(opts)} for {q_id}"
    assert 0 <= correct_idx <= 3, f"Invalid correct_idx {correct_idx} for {q_id}"
    return {
        "id": q_id,
        "courseCode": course_code,
        "courseTitle": course_title,
        "topic": topic.strip(),
        "question": q_text.strip(),
        "options": [o.strip() for o in opts],
        "correctAnswer": int(correct_idx),
        "explanation": exp_text.strip()
    }

print("Base builder helper loaded.")
