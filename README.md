# ResumeCraft – Resume Generator & AI Optimizer

**ResumeCraft** is a modern, modular, and interactive full-stack web application designed for students and developers. It allows users to build ATS-compliant, professional resumes with **instant real-time live preview**, **5 interchangeable industry-standard templates**, **persistent SQLite database storage**, and an **AI optimization suite**.

---

## 📁 Project Structure

```text
ResumeCraft/
├── app.py                  # Main Flask application with Web & REST API routes
├── database.py             # SQLite database helper (Save, Load, Update, Delete)
├── ai_optimizer.py         # AI NLP logic (ATS scoring, summary generator, skill suggester)
├── requirements.txt        # Dependencies (Flask)
├── README.md               # Documentation & setup guide
├── templates/
│   ├── base.html           # Master HTML layout (Fonts, Icons, Header, Modals, Toasts)
│   ├── index.html          # Main application page (Form panel + Live Preview + Template Bar)
│   └── modals.html         # Modals for Database manager, AI summary, AI skills, and ATS diagnostics
└── static/
    ├── css/
    │   └── style.css       # Clean UI design, 5 Resume Templates, color themes, print styles
    └── js/
        └── script.js       # Real-time synchronization, dynamic form cards, DB & AI API integration
```

---

## 🚀 Key Features

### 1. 💾 Persistent SQLite Database Storage
* **Zero Configuration:** Uses Python's built-in `sqlite3` creating a local `resumes.db` file.
* **Save / Update Resumes:** Save multiple resume drafts with custom titles and timestamps.
* **My Resumes Library:** One-click modal to browse, preview, load, or delete saved resumes.
* **Persistent Settings:** Automatically preserves chosen template style and accent color with each resume draft.

### 2. 🎨 5 Free Industry-Standard Resume Templates & Theme Picker
* **Modern Clean (Default):** Clean sans-serif hierarchy, subtle colored header dividers, and tag pills.
* **Classic Ivy (ATS Standard):** Traditional single-column serif formatting (`Merriweather`), centered headers, horizontal rule dividers—optimized for 99%+ ATS parse rate.
* **Tech Minimalist:** Monospace typography accents (`JetBrains Mono`), dark contrast badges, ideal for developers.
* **Executive Sleek:** Bold left-accented colored headers, modern corporate layout.
* **Compact Split:** High-density 2-column layout balancing experience, skills, and coursework.
* **Accent Color Palette:** Live switch between Electric Blue, Emerald Green, Royal Purple, Crimson Rose, and Slate Onyx.

### 3. 🤖 AI Resume Optimization Suite
* **Real-Time ATS Diagnostic Engine:** Instant 0–100% score dial, rating grade, checklist of identified strengths, and actionable improvement recommendations.
* **AI Summary Enhancer:** Generates 3 tailored summary variations (*Student / Entry-level*, *Results & Impact Driven*, and *Technical Specialist*) based on your target role and skills.
* **AI In-Demand Skill Suggester:** Explores and inserts top industry keywords across Software Engineering, Web Development, Backend & APIs, Data Analytics, Machine Learning, and DevOps.
* **AI Bullet Point Polisher:** Converts raw duty descriptions into action-verb-driven statements with metric placeholders.

### 4. ⚡ Real-Time Live Preview & One-Click PDF Export
* **Instant Sync:** Edits in the form reflect immediately on the right-side A4 paper sheet without page reloads.
* **Dynamic Sections:** Add and delete unlimited Education, Project, Experience, Certification, and Achievement cards.
* **Clean Print Export:** Optimized `@media print` CSS rules ensure printing (`Cmd+P` / `Ctrl+P`) exports only the clean resume document without web UI buttons.

---

## 🛠️ Tech Stack

* **Backend:** Python 3, Flask, SQLite 3, Jinja2
* **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox/Grid, `@media print`), Vanilla JavaScript (ES6+)
* **Typography & Icons:** FontAwesome 6.5.1, Google Fonts (*Inter*, *Outfit*, *Merriweather*, *JetBrains Mono*)
* **Design Philosophy:** Beginner-friendly, modular, clean architecture without heavy external build tools.

---

## 💻 Installation & Execution Guide

### 1. Open Terminal and Navigate to Project
```bash
cd /Users/piyush/Resume-G
```

### 2. Install Dependencies
```bash
pip3 install -r requirements.txt
```

### 3. Run the Flask Application
```bash
python3 app.py
```

### 4. Open in Browser
Visit **[http://127.0.0.1:5001](http://127.0.0.1:5001)** or **[http://localhost:5001](http://localhost:5001)** in your browser.

---

## 🧪 Testing Checklist

1. **Test Live Typing:** Type into any section (Personal Info, Summary, Skills, etc.) and observe instant preview updates.
2. **Test Template Switching:** Click through the 5 template tabs (*Modern Clean*, *Classic Ivy*, *Tech Minimalist*, *Executive Sleek*, *Compact Split*) and click different color dots in the customizer toolbar.
3. **Test AI Assistant:**
   * Click **AI ATS Score** in the top navigation to view the diagnostic scorecard and recommendations.
   * Click **AI Enhance** in Section 2 to choose from 3 tailored summary variations.
   * Click **AI Suggest Skills** in Section 4, pick a domain, select chips, and click *Add Selected to Resume*.
4. **Test SQLite Database:**
   * Click **Save Resume**, enter a title, and confirm.
   * Click **My Resumes** to see your saved resume in the list, load it, or delete it.
5. **Test PDF Export:** Click **Print / PDF** to view the clean A4 paper print preview.
