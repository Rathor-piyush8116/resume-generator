"""
ResumeCraft – AI Resume Optimizer Engine
Provides intelligent resume enhancement, ATS scoring, action verb upgrades,
and role-specific skill suggestions.
"""

import re

# Action verbs mapped for resume enhancement
ACTION_VERBS = [
    "Architected", "Spearheaded", "Engineered", "Implemented", "Optimized",
    "Developed", "Designed", "Formulated", "Automated", "Pioneered",
    "Streamlined", "Constructed", "Orchestrated", "Accelerated", "Integrated"
]

# Skill recommendations by common computer science & tech domains
ROLE_SKILLS_MAP = {
    "software": [
        "Python", "C++", "Java", "Data Structures & Algorithms", "Git/GitHub",
        "REST APIs", "Object-Oriented Programming (OOP)", "SQL", "Linux/Bash", "Unit Testing"
    ],
    "web": [
        "HTML5", "CSS3", "JavaScript (ES6+)", "Python Flask", "React.js",
        "Node.js", "Tailwind CSS", "RESTful APIs", "Git", "Responsive Web Design"
    ],
    "frontend": [
        "JavaScript", "TypeScript", "HTML5", "CSS3", "React",
        "Vue.js", "Tailwind CSS", "Redux", "Webpack/Vite", "UI/UX Design"
    ],
    "backend": [
        "Python", "Flask/FastAPI", "Node.js/Express", "PostgreSQL", "MongoDB",
        "Docker", "REST & GraphQL APIs", "Microservices", "Redis", "CI/CD"
    ],
    "data": [
        "Python", "SQL", "Pandas", "NumPy", "Matplotlib/Seaborn",
        "Scikit-Learn", "Data Visualization", "PowerBI/Tableau", "Excel", "Statistics"
    ],
    "machine learning": [
        "Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Deep Learning",
        "Natural Language Processing (NLP)", "Computer Vision", "Data Preprocessing", "Git", "Math & Linear Algebra"
    ],
    "cloud": [
        "AWS (Amazon Web Services)", "Docker", "Kubernetes", "Linux", "CI/CD Pipelines",
        "Terraform", "GitOps", "Bash Scripting", "Networking Basics", "Monitoring (Prometheus/Grafana)"
    ]
}

def suggest_skills_for_role(role_query=""):
    """Returns curated skills matching the user's target role."""
    role_query = role_query.lower()
    matched_skills = []
    
    for role_key, skills in ROLE_SKILLS_MAP.items():
        if role_key in role_query:
            matched_skills.extend(skills)
            
    if not matched_skills:
        # Default diverse developer skillset
        matched_skills = [
            "Python", "C++", "Data Structures", "HTML5 & CSS3",
            "JavaScript", "Git & GitHub", "SQL", "Flask", "Problem Solving"
        ]
    
    # Remove duplicates preserving order
    return list(dict.fromkeys(matched_skills))

def optimize_summary(current_summary="", job_title="", skills=""):
    """
    Generates 3 optimized professional summary variations tailored
    to student, results-oriented, and technical specialist perspectives.
    """
    title = job_title.strip() if job_title else "Computer Science Student"
    skills_list = [s.strip() for s in skills.split(',') if s.strip()][:4]
    skills_str = ", ".join(skills_list) if skills_list else "Data Structures, Python, and Web Development"

    options = [
        {
            "tone": "Targeted & Aspiring (Best for Students & Interns)",
            "text": f"Motivated and detail-oriented {title} with a strong academic foundation in {skills_str}. Proven track record of designing modular web applications and solving algorithmic challenges. Passionate about applying problem-solving skills to real-world engineering problems in an agile environment."
        },
        {
            "tone": "Impact & Results-Driven (ATS High Impact)",
            "text": f"Proactive {title} experienced in end-to-end software development using {skills_str}. Demonstrated ability in designing scalable user-centric applications, optimizing system performance, and collaborating in team-driven projects to deliver high-quality software solutions."
        },
        {
            "tone": "Technical Specialist & Continuous Learner",
            "text": f"Energetic {title} with hands-on expertise in {skills_str}. Committed to writing clean, maintainable code and exploring modern tech architectures. Seeking an engineering role to contribute to mission-critical systems while accelerating technical acumen."
        }
    ]
    return options

def optimize_bullet_point(raw_text=""):
    """
    Transforms a simple description into high-impact ATS bullet points
    with action verbs and measurable metrics.
    """
    clean_text = raw_text.strip().rstrip('.')
    if not clean_text:
        return [
            "Architected and implemented responsive core features, enhancing system reliability and user interaction.",
            "Engineered modular backend endpoints, improving query execution time by 25%.",
            "Spearheaded end-to-end development and unit testing, ensuring 99%+ code quality compliance."
        ]

    # Clean starting words like "I made", "worked on", "helped to", "responsible for"
    normalized = re.sub(r'^(i\s+|i\s+have\s+|worked\s+on\s+|made\s+|built\s+|created\s+|responsible\s+for\s+|helped\s+to\s+)', '', clean_text, flags=re.IGNORECASE)

    variants = [
        f"Architected and deployed {normalized}, resulting in enhanced performance and seamless user experience.",
        f"Spearheaded the development of {normalized}, optimizing workflows and cutting turnaround time by 30%.",
        f"Engineered and maintained {normalized} adhering to industry best practices, boosting test coverage and scalability."
    ]
    return variants

def calculate_ats_score(resume_data):
    """
    Analyzes resume content against ATS best practices and returns
    a score (0-100), rating, strengths, and targeted improvement suggestions.
    """
    score = 0
    max_score = 100
    strengths = []
    improvements = []

    personal = resume_data.get('personal', {})
    summary = resume_data.get('summary', '').strip()
    education = resume_data.get('education', [])
    skills = resume_data.get('skills', '').strip()
    projects = resume_data.get('projects', [])
    experience = resume_data.get('experience', [])
    certifications = resume_data.get('certifications', [])
    achievements = resume_data.get('achievements', [])

    # 1. Contact Information Analysis (20 pts)
    if personal.get('fullName', '').strip():
        score += 5
        strengths.append("Full Name is clearly defined.")
    else:
        improvements.append("Add your full name in Personal Information.")

    if personal.get('email', '').strip():
        score += 5
        strengths.append("Email address provided.")
    else:
        improvements.append("Provide a valid professional email address.")

    if personal.get('phone', '').strip():
        score += 3
        strengths.append("Contact phone number provided.")
    else:
        improvements.append("Add a contact phone number.")

    if personal.get('linkedin', '').strip():
        score += 4
        strengths.append("LinkedIn profile link included.")
    else:
        improvements.append("Add your LinkedIn profile to increase recruiter response rate.")

    if personal.get('github', '').strip():
        score += 3
        strengths.append("GitHub profile link included for technical validation.")
    else:
        improvements.append("Add your GitHub URL to showcase your code repositories.")

    # 2. Professional Summary Analysis (15 pts)
    if summary:
        word_count = len(summary.split())
        if 25 <= word_count <= 100:
            score += 15
            strengths.append(f"Professional Summary is optimal in length ({word_count} words).")
        elif word_count < 25:
            score += 8
            improvements.append("Summary is slightly short. Aim for 30-60 words highlighting key skills.")
        else:
            score += 10
            improvements.append("Summary is a bit long. Keep it concise (under 80 words) for quick scanning.")
    else:
        improvements.append("Include a 2-3 sentence Professional Summary to hook recruiters.")

    # 3. Skills Keyword Analysis (15 pts)
    if skills:
        skills_count = len([s.strip() for s in skills.split(',') if s.strip()])
        if skills_count >= 8:
            score += 15
            strengths.append(f"Strong skill density ({skills_count} key technical/soft skills).")
        elif skills_count >= 4:
            score += 10
            improvements.append(f"You have {skills_count} skills. Aim for 8-12 relevant skills to match ATS keywords.")
        else:
            score += 5
            improvements.append("Add more domain-specific skills (languages, frameworks, tools).")
    else:
        improvements.append("Add a list of skills; ATS parsers heavily scan for skill keywords.")

    # 4. Education (15 pts)
    valid_edu = [e for e in education if e.get('degree', '').strip() or e.get('college', '').strip()]
    if valid_edu:
        score += 15
        strengths.append(f"Education details provided ({len(valid_edu)} entries).")
    else:
        improvements.append("Add your degree, university, and graduation years under Education.")

    # 5. Projects (15 pts)
    valid_proj = [p for p in projects if p.get('name', '').strip()]
    if len(valid_proj) >= 2:
        score += 15
        strengths.append(f"Strong portfolio with {len(valid_proj)} detailed projects.")
    elif len(valid_proj) == 1:
        score += 10
        improvements.append("Consider adding at least 2 distinct technical projects to demonstrate breadth.")
    else:
        improvements.append("Include at least 1 or 2 key projects demonstrating hands-on coding ability.")

    # 6. Experience or Internships (10 pts)
    valid_exp = [e for e in experience if e.get('title', '').strip() or e.get('company', '').strip()]
    if valid_exp:
        score += 10
        strengths.append(f"Relevant experience / internship listed ({len(valid_exp)} entry).")
    else:
        improvements.append("Add internship, freelance, or club leadership experience if available.")

    # 7. Certifications & Achievements (10 pts)
    valid_cert = [c for c in certifications if c.get('name', '').strip()]
    valid_ach = [a for a in achievements if a.get('text', '').strip()]

    cert_ach_score = 0
    if valid_cert:
        cert_ach_score += 5
        strengths.append(f"{len(valid_cert)} verified certifications added.")
    if valid_ach:
        cert_ach_score += 5
        strengths.append(f"{len(valid_ach)} key achievements listed.")
    
    score += cert_ach_score
    if not valid_cert and not valid_ach:
        improvements.append("Add verified certifications or competitive achievements (e.g. hackathons, contests).")

    # Determine Rating Label & Color
    if score >= 85:
        rating = "Excellent (ATS Ready)"
        badge_color = "#10b981"
    elif score >= 70:
        rating = "Good (Minor Tweaks Needed)"
        badge_color = "#3b82f6"
    elif score >= 50:
        rating = "Fair (Needs Optimization)"
        badge_color = "#f59e0b"
    else:
        rating = "Needs Attention"
        badge_color = "#ef4444"

    return {
        "score": min(score, 100),
        "rating": rating,
        "badge_color": badge_color,
        "strengths": strengths,
        "improvements": improvements
    }
