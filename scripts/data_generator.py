import json
import os

# Helper to build questions cleanly
def make_q(id_prefix, num, course_code, course_title, topic, question, options, correct_idx, explanation):
    return {
        "id": f"{id_prefix}_{num:03d}",
        "courseCode": course_code,
        "courseTitle": course_title,
        "topic": topic,
        "question": question.strip(),
        "options": [opt.strip() for opt in options],
        "correctAnswer": correct_idx,
        "explanation": explanation.strip()
    }

print("Question helper loaded.")
