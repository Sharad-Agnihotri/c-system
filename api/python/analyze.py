from flask import Flask, request, jsonify
import fitz  # PyMuPDF
import spacy
import os
import re

app = Flask(__name__)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import subprocess
    import sys
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

SKILL_DB = {
    "Frontend": {
        "react": 85, "next.js": 80, "typescript": 85, "javascript": 90,
        "html": 90, "css": 85, "tailwind": 75, "vue": 75, "angular": 75,
        "redux": 70, "sass": 65, "webpack": 65, "vite": 60, "jquery": 50,
        "bootstrap": 55, "svelte": 60, "graphql": 65, "storybook": 55,
    },
    "Backend": {
        "node.js": 80, "python": 80, "java": 85, "go": 75, "ruby": 70,
        "php": 65, "express": 75, "django": 75, "flask": 70, "spring boot": 80,
        "fastapi": 70, "rest api": 80, "microservices": 75, "c++": 75,
        "c#": 75, "rust": 70, ".net": 75, "kafka": 65, "rabbitmq": 60,
    },
    "Database": {
        "postgresql": 75, "mongodb": 70, "mysql": 75, "redis": 65,
        "sqlite": 55, "oracle": 70, "dynamodb": 65, "elasticsearch": 65,
        "firebase": 55, "cassandra": 60, "neo4j": 55, "sql": 80,
    },
    "Cloud & DevOps": {
        "aws": 80, "azure": 75, "gcp": 75, "docker": 75, "kubernetes": 70,
        "jenkins": 65, "terraform": 70, "ci/cd": 75, "github actions": 65,
        "linux": 75, "nginx": 60, "ansible": 60, "prometheus": 55,
        "grafana": 55, "helm": 55, "cloudflare": 50,
    },
    "AI & ML": {
        "pytorch": 75, "tensorflow": 75, "scikit-learn": 70, "nlp": 70,
        "pandas": 75, "numpy": 70, "opencv": 65, "llm": 70, "genai": 65,
        "deep learning": 75, "machine learning": 80, "data science": 75,
        "hugging face": 60, "langchain": 60, "openai": 55, "computer vision": 65,
    },
    "Testing & QA": {
        "jest": 70, "cypress": 65, "selenium": 65, "mocha": 60,
        "pytest": 65, "unit testing": 75, "tdd": 70, "playwright": 60,
        "postman": 55,
    },
    "Architecture": {
        "system design": 80, "design patterns": 75, "solid principles": 70,
        "clean architecture": 70, "event driven": 65, "domain driven": 65,
        "scalability": 70,
    },
    "Soft Skills": {
        "agile": 70, "scrum": 65, "leadership": 70, "communication": 75,
        "problem solving": 80, "team management": 70, "project management": 70,
        "mentoring": 60,
    },
}

COMMON_GAP_SKILLS = {
    "Testing & QA": [
        {"name": "Unit Testing", "requiredLevel": 75, "category": "Testing & QA"},
        {"name": "Jest", "requiredLevel": 70, "category": "Testing & QA"},
        {"name": "TDD", "requiredLevel": 65, "category": "Testing & QA"},
    ],
    "Cloud & DevOps": [
        {"name": "Docker", "requiredLevel": 75, "category": "Cloud & DevOps"},
        {"name": "CI/CD", "requiredLevel": 70, "category": "Cloud & DevOps"},
        {"name": "Kubernetes", "requiredLevel": 65, "category": "Cloud & DevOps"},
    ],
    "Architecture": [
        {"name": "System Design", "requiredLevel": 80, "category": "Architecture"},
        {"name": "Design Patterns", "requiredLevel": 70, "category": "Architecture"},
    ],
}

def extract_text(pdf_bytes):
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        return f"Error: {str(e)}"

def analyze_skill_depth(skill_name, text_lower):
    count = text_lower.count(skill_name.lower())
    proficiency_markers = [
        f"proficient in {skill_name.lower()}", f"expert in {skill_name.lower()}",
        f"advanced {skill_name.lower()}", f"strong {skill_name.lower()}",
        f"extensive {skill_name.lower()}", f"years of {skill_name.lower()}",
        f"led {skill_name.lower()}", f"architect", f"built {skill_name.lower()}",
    ]
    depth_boost = sum([10 for marker in proficiency_markers if marker in text_lower])
    return min(35 + (count * 12) + depth_boost, 95)

def parse_resume(text):
    text_lower = text.lower()
    found_skills = []
    found_skill_names = set()

    for category, skills in SKILL_DB.items():
        for skill_name, required_level in skills.items():
            if re.search(r'\b' + re.escape(skill_name) + r'\b', text_lower):
                current_level = analyze_skill_depth(skill_name, text_lower)
                display_name = skill_name.title() if len(skill_name) > 3 else skill_name.upper()
                if skill_name == "next.js": display_name = "Next.js"
                elif skill_name == "node.js": display_name = "Node.js"
                elif skill_name == "ci/cd": display_name = "CI/CD"

                found_skills.append({
                    "name": display_name, "currentLevel": current_level,
                    "requiredLevel": required_level, "category": category,
                })
                found_skill_names.add(skill_name)

    advantages = [s for s in found_skills if s["currentLevel"] >= s["requiredLevel"] * 0.8]
    detected_gaps = [s for s in found_skills if s["currentLevel"] < s["requiredLevel"] * 0.8]
    missing_gaps = []

    for gap_category, gap_skills in COMMON_GAP_SKILLS.items():
        for gap_skill in gap_skills:
            if gap_skill["name"].lower() not in found_skill_names:
                missing_gaps.append({
                    "name": gap_skill["name"], "currentLevel": 0,
                    "requiredLevel": gap_skill["requiredLevel"], "category": gap_skill["category"],
                })

    all_gaps = detected_gaps + missing_gaps
    strengths, weaknesses, suggestions = [], [], []

    if len(advantages) >= 5:
        top_categories = list(set(s["category"] for s in advantages[:5]))
        strengths.append(f"Strong proficiency across {len(advantages)} technologies including {', '.join(top_categories)}.")
    elif len(advantages) > 0:
        names = [s["name"] for s in advantages[:4]]
        strengths.append(f"Good command of: {', '.join(names)}.")

    if len(all_gaps) > 0:
        gap_names = [g["name"] for g in all_gaps[:4]]
        weaknesses.append(f"Skill gaps identified in: {', '.join(gap_names)}.")

    if not any(s["category"] == "Testing & QA" for s in found_skills): weaknesses.append("No testing frameworks or methodologies mentioned.")
    if not any(s["category"] == "Cloud & DevOps" for s in found_skills): weaknesses.append("Cloud/DevOps skills not highlighted.")

    metric_patterns = [r'\d+%', r'\d+x', r'\$\d+', r'\d+ users', r'\d+ customers']
    has_metrics = any(re.search(p, text) for p in metric_patterns)
    if not has_metrics: weaknesses.append("Missing quantifiable achievements.")
    if len(all_gaps) > 0: suggestions.append(f"Focus on building skills in: {', '.join([g['name'] for g in all_gaps[:3]])}.")

    total_skills = len(advantages) + len(all_gaps)
    advantage_ratio = len(advantages) / total_skills if total_skills > 0 else 0.3
    score = min(int(35 + (advantage_ratio * 55) + (len(advantages) * 1.5)), 98)
    ats_score = min(int(30 + (len(found_skills) * 4) + (10 if has_metrics else 0)), 95)

    career_intent = "Software Engineer"
    return {
        "score": score, "atsScore": ats_score, "careerIntent": career_intent,
        "strengths": strengths[:6], "weaknesses": weaknesses[:6],
        "skills": advantages[:10], "skillGaps": all_gaps[:10],
        "suggestions": suggestions[:6], "experience": [], "education": [],
        "keywords": [s["name"] for s in found_skills],
    }

@app.route('/api/python/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file mapped to 'file' key"}), 400
    
    file = request.files['file']
    pdf_bytes = file.read()
    raw_text = extract_text(pdf_bytes)
    
    if raw_text.startswith("Error:"):
        return jsonify({"success": False, "error": raw_text}), 500

    analysis = parse_resume(raw_text)

    return jsonify({
        "success": True,
        "raw_text": raw_text[:3000],
        "analysis": analysis
    })
