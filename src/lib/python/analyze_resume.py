import sys
import json
import fitz  # PyMuPDF
import spacy
import os
import re

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import subprocess
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# ── Comprehensive Skill Database with required levels per role ──
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

# ── Skills that are commonly expected but often missing (gap indicators) ──
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


def extract_text(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        return f"Error: {str(e)}"
    return text


def analyze_skill_depth(skill_name, text_lower):
    """Determine how strongly a skill appears in the resume."""
    count = text_lower.count(skill_name.lower())

    # Check for context clues that indicate proficiency
    proficiency_markers = [
        f"proficient in {skill_name.lower()}",
        f"expert in {skill_name.lower()}",
        f"advanced {skill_name.lower()}",
        f"strong {skill_name.lower()}",
        f"extensive {skill_name.lower()}",
        f"years of {skill_name.lower()}",
        f"led {skill_name.lower()}",
        f"architect",
        f"built {skill_name.lower()}",
    ]

    depth_boost = 0
    for marker in proficiency_markers:
        if marker in text_lower:
            depth_boost += 10

    # Base level from mention count
    base_level = min(35 + (count * 12) + depth_boost, 95)
    return base_level


def parse_resume(text):
    doc = nlp(text)
    text_lower = text.lower()

    # ─── 1. Detect ALL skills ───────────────────────────
    found_skills = []
    found_skill_names = set()

    for category, skills in SKILL_DB.items():
        for skill_name, required_level in skills.items():
            if re.search(r'\b' + re.escape(skill_name) + r'\b', text_lower):
                current_level = analyze_skill_depth(skill_name, text_lower)
                display_name = skill_name.title() if len(skill_name) > 3 else skill_name.upper()
                # Special formatting
                if skill_name == "next.js":
                    display_name = "Next.js"
                elif skill_name == "node.js":
                    display_name = "Node.js"
                elif skill_name == "ci/cd":
                    display_name = "CI/CD"

                found_skills.append({
                    "name": display_name,
                    "currentLevel": current_level,
                    "requiredLevel": required_level,
                    "category": category,
                })
                found_skill_names.add(skill_name)

    # ─── 2. Separate into Advantages vs Gaps ────────────
    # Advantage: currentLevel >= requiredLevel * 0.8  (strong or close enough)
    # Gap: currentLevel < requiredLevel * 0.8  (clearly behind)
    advantages = []
    detected_gaps = []

    for skill in found_skills:
        if skill["currentLevel"] >= skill["requiredLevel"] * 0.8:
            advantages.append(skill)
        else:
            detected_gaps.append(skill)

    # ─── 3. Find MISSING skills (not mentioned at all) ──
    # These are true skill gaps - important skills NOT found in resume
    missing_gaps = []
    for gap_category, gap_skills in COMMON_GAP_SKILLS.items():
        for gap_skill in gap_skills:
            # Check if this skill was NOT found in resume
            skill_lower = gap_skill["name"].lower()
            if skill_lower not in found_skill_names:
                missing_gaps.append({
                    "name": gap_skill["name"],
                    "currentLevel": 0,  # Not mentioned at all
                    "requiredLevel": gap_skill["requiredLevel"],
                    "category": gap_skill["category"],
                })

    # Combine detected_gaps + missing_gaps for the skill gaps section
    all_gaps = detected_gaps + missing_gaps

    # ─── 4. Build Strengths list ────────────────────────
    strengths = []
    if len(advantages) >= 5:
        top_categories = list(set(s["category"] for s in advantages[:5]))
        strengths.append(f"Strong proficiency across {len(advantages)} technologies including {', '.join(top_categories)}.")
    elif len(advantages) > 0:
        names = [s["name"] for s in advantages[:4]]
        strengths.append(f"Good command of: {', '.join(names)}.")

    if any(s["category"] == "Frontend" for s in advantages):
        fe_skills = [s["name"] for s in advantages if s["category"] == "Frontend"]
        strengths.append(f"Solid frontend expertise: {', '.join(fe_skills[:3])}.")

    if any(s["category"] == "Backend" for s in advantages):
        be_skills = [s["name"] for s in advantages if s["category"] == "Backend"]
        strengths.append(f"Backend development capabilities: {', '.join(be_skills[:3])}.")

    if any(s["category"] == "AI & ML" for s in advantages):
        strengths.append("Machine Learning / AI skills detected — high-demand area.")

    if "experience" in text_lower or "work history" in text_lower:
        strengths.append("Professional experience section is present and structured.")

    if "education" in text_lower or "degree" in text_lower or "bachelor" in text_lower:
        strengths.append("Formal education credentials included.")

    if not strengths:
        strengths = ["Resume structure is clear and readable."]

    # ─── 5. Build Weaknesses list ───────────────────────
    weaknesses = []
    if len(all_gaps) > 0:
        gap_names = [g["name"] for g in all_gaps[:4]]
        weaknesses.append(f"Skill gaps identified in: {', '.join(gap_names)}.")

    if not any(s["category"] == "Testing & QA" for s in found_skills):
        weaknesses.append("No testing frameworks or methodologies mentioned (Jest, Cypress, TDD).")

    if not any(s["category"] == "Cloud & DevOps" for s in found_skills):
        weaknesses.append("Cloud/DevOps skills not highlighted (Docker, AWS, CI/CD).")

    if not any(s["category"] == "Architecture" for s in found_skills):
        weaknesses.append("System design and architecture experience not mentioned.")

    # Check for quantifiable achievements
    metric_patterns = [r'\d+%', r'\d+x', r'\$\d+', r'\d+ users', r'\d+ customers']
    has_metrics = any(re.search(p, text) for p in metric_patterns)
    if not has_metrics:
        weaknesses.append("Missing quantifiable achievements (e.g., 'improved performance by 40%').")

    if not weaknesses:
        weaknesses = ["Consider adding more industry-specific details."]

    # ─── 6. Build suggestions ───────────────────────────
    suggestions = []
    if len(all_gaps) > 0:
        top_gaps = [g["name"] for g in all_gaps[:3]]
        suggestions.append(f"Focus on building skills in: {', '.join(top_gaps)} — these are in high demand.")

    if not has_metrics:
        suggestions.append("Add measurable impact to achievements (e.g., 'Reduced latency by 35%').")

    if not any(s["category"] == "Testing & QA" for s in found_skills):
        suggestions.append("Add a testing section showcasing Jest, Cypress, or Playwright experience.")

    suggestions.append("Include links to GitHub, portfolio, or notable open-source contributions.")
    suggestions.append("Tailor your resume keywords to match each job description for better ATS scores.")

    if len(advantages) < 5:
        suggestions.append("Expand your technical skills section with more specific technologies.")

    # ─── 7. Scoring ─────────────────────────────────────
    # Score based on advantages vs gaps ratio
    total_skills = len(advantages) + len(all_gaps)
    if total_skills > 0:
        advantage_ratio = len(advantages) / total_skills
    else:
        advantage_ratio = 0.3

    score = min(int(35 + (advantage_ratio * 55) + (len(advantages) * 1.5)), 98)
    ats_score = min(int(30 + (len(found_skills) * 4) + (10 if has_metrics else 0)), 95)

    # ─── 8. Career intent detection ─────────────────────
    career_intent = "Software Engineer"
    if any(s["category"] == "Frontend" for s in advantages) and not any(s["category"] == "Backend" for s in advantages):
        career_intent = "Frontend Developer"
    elif any(s["category"] == "Backend" for s in advantages) and not any(s["category"] == "Frontend" for s in advantages):
        career_intent = "Backend Developer"
    elif any(s["category"] in ["Frontend", "Backend"] for s in advantages):
        career_intent = "Full Stack Developer"
    if any(s["category"] == "AI & ML" for s in advantages):
        career_intent = "ML / AI Engineer"
    if any(s["category"] == "Cloud & DevOps" for s in advantages) and len([s for s in advantages if s["category"] == "Cloud & DevOps"]) >= 3:
        career_intent = "DevOps Engineer"

    # ─── 9. Return structured result ────────────────────
    # The `skills` array now contains ONLY advantage skills (strong ones)
    # The `skillGaps` array contains skills that need improvement or are missing
    return {
        "score": score,
        "atsScore": ats_score,
        "careerIntent": career_intent,
        "strengths": strengths[:6],
        "weaknesses": weaknesses[:6],
        "skills": advantages[:10],
        "skillGaps": all_gaps[:10],
        "suggestions": suggestions[:6],
        "experience": [],
        "education": [],
        "keywords": [s["name"] for s in found_skills],
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No PDF path provided"}))
        return

    pdf_path = sys.argv[1]
    raw_text = extract_text(pdf_path)

    if raw_text.startswith("Error:"):
        print(json.dumps({"success": False, "error": raw_text}))
        return

    analysis = parse_resume(raw_text)

    print(json.dumps({
        "success": True,
        "raw_text": raw_text[:3000],
        "analysis": analysis
    }))

if __name__ == "__main__":
    main()
