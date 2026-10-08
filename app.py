"""
ResumeCraft – Resume Generator
Main Flask Application

Includes:
- Jinja2 Template Rendering for the Web Interface
- SQLite Persistent Database API (Save, Retrieve, Update, Delete)
- AI Resume Optimization API (ATS Scoring, Summary Optimization, Bullet Polish, Skill Suggestions)
"""

from flask import Flask, render_template, request, jsonify
from database import init_db, save_resume, get_all_resumes, get_resume_by_id, delete_resume_by_id
from ai_optimizer import (
    optimize_summary,
    optimize_bullet_point,
    suggest_skills_for_role,
    calculate_ats_score
)

# Initialize Flask app
app = Flask(__name__)

# Initialize the SQLite database on startup
init_db()

# -------------------------------------------------------------
# Web Page Route
# -------------------------------------------------------------
@app.route('/')
def home():
    """Renders the main interactive resume builder page."""
    return render_template('index.html')

# -------------------------------------------------------------
# Database API Endpoints (Persistent Storage)
# -------------------------------------------------------------
@app.route('/api/resumes', methods=['GET', 'POST'])
def handle_resumes():
    """
    GET: Returns metadata of all saved resumes.
    POST: Saves a new resume or creates a saved version.
    """
    if request.method == 'GET':
        resumes = get_all_resumes()
        return jsonify({'success': True, 'resumes': resumes})
    
    # POST - Save new resume
    payload = request.get_json() or {}
    title = payload.get('title', 'My Resume').strip() or 'Untitled Resume'
    template_id = payload.get('template_id', 'modern')
    theme_color = payload.get('theme_color', '#2563eb')
    data = payload.get('data', {})

    resume_id = save_resume(title, template_id, theme_color, data)
    return jsonify({
        'success': True,
        'message': f'Resume "{title}" saved successfully!',
        'id': resume_id
    }), 201

@app.route('/api/resumes/<int:resume_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_single_resume(resume_id):
    """
    GET: Retrieves a single resume by ID.
    PUT: Updates an existing resume by ID.
    DELETE: Removes a resume from the database.
    """
    if request.method == 'GET':
        resume = get_resume_by_id(resume_id)
        if not resume:
            return jsonify({'success': False, 'error': 'Resume not found'}), 404
        return jsonify({'success': True, 'resume': resume})

    elif request.method == 'PUT':
        payload = request.get_json() or {}
        title = payload.get('title', 'My Resume').strip() or 'Untitled Resume'
        template_id = payload.get('template_id', 'modern')
        theme_color = payload.get('theme_color', '#2563eb')
        data = payload.get('data', {})

        saved_id = save_resume(title, template_id, theme_color, data, resume_id=resume_id)
        return jsonify({
            'success': True,
            'message': f'Resume "{title}" updated successfully!',
            'id': saved_id
        })

    elif request.method == 'DELETE':
        deleted = delete_resume_by_id(resume_id)
        if not deleted:
            return jsonify({'success': False, 'error': 'Resume not found'}), 404
        return jsonify({'success': True, 'message': 'Resume deleted successfully'})

# -------------------------------------------------------------
# AI Resume Optimization API Endpoints
# -------------------------------------------------------------
@app.route('/api/ai/analyze-ats', methods=['POST'])
def ai_analyze_ats():
    """Calculates ATS score and provides actionable recommendations."""
    payload = request.get_json() or {}
    resume_data = payload.get('data', {})
    analysis = calculate_ats_score(resume_data)
    return jsonify({'success': True, 'analysis': analysis})

@app.route('/api/ai/optimize-summary', methods=['POST'])
def ai_optimize_summary():
    """Generates 3 optimized professional summary variations."""
    payload = request.get_json() or {}
    current_summary = payload.get('summary', '')
    job_title = payload.get('job_title', '')
    skills = payload.get('skills', '')

    suggestions = optimize_summary(current_summary, job_title, skills)
    return jsonify({'success': True, 'suggestions': suggestions})

@app.route('/api/ai/optimize-bullet', methods=['POST'])
def ai_optimize_bullet():
    """Polishes raw descriptions with action verbs and metrics."""
    payload = request.get_json() or {}
    raw_text = payload.get('text', '')
    variants = optimize_bullet_point(raw_text)
    return jsonify({'success': True, 'variants': variants})

@app.route('/api/ai/suggest-skills', methods=['POST'])
def ai_suggest_skills():
    """Returns curated skills matching a specific target role."""
    payload = request.get_json() or {}
    role_query = payload.get('role', '')
    skills = suggest_skills_for_role(role_query)
    return jsonify({'success': True, 'skills': skills})

# -------------------------------------------------------------
# Server Entry Point
# -------------------------------------------------------------
if __name__ == '__main__':
    # Using port 5001 to avoid macOS AirPlay port 5000 conflict
    app.run(debug=True, host='0.0.0.0', port=5001)
