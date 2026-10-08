/**
 * ResumeCraft – Resume Generator & AI Optimizer
 * Vanilla JavaScript Engine
 * 
 * Features:
 * 1. Real-time Live Preview across all 8 resume sections.
 * 2. 5 Distinct Professional Templates & Accent Color Picker.
 * 3. SQLite Database Integration (Save, Load, List, Delete).
 * 4. AI Optimization Suite (ATS Scoring, Summary Generator, Skill Suggester, Bullet Polisher).
 * 5. One-Click Sample Data & Print/PDF Export.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DOM Elements & State
    // ==========================================
    
    // Application State
    let currentResumeId = null;
    let currentTemplateId = 'modern';
    let currentThemeColor = '#2563eb';

    // Inputs
    const inputFullName = document.getElementById('fullName');
    const inputProfessionalTitle = document.getElementById('professionalTitle');
    const inputEmail = document.getElementById('email');
    const inputPhone = document.getElementById('phone');
    const inputLocation = document.getElementById('location');
    const inputLinkedin = document.getElementById('linkedin');
    const inputGithub = document.getElementById('github');
    const inputSummary = document.getElementById('summary');
    const inputSkills = document.getElementById('skillsInput');

    // Preview DOM Elements
    const resumeSheet = document.getElementById('resume-sheet');
    const previewName = document.getElementById('preview-name');
    const previewTitle = document.getElementById('preview-title');
    const previewEmail = document.getElementById('preview-email');
    const previewPhone = document.getElementById('preview-phone');
    const previewLocation = document.getElementById('preview-location');
    const previewLinkedin = document.getElementById('preview-linkedin');
    const previewGithub = document.getElementById('preview-github');
    
    const previewEmailContainer = document.getElementById('preview-email-container');
    const previewPhoneContainer = document.getElementById('preview-phone-container');
    const previewLocationContainer = document.getElementById('preview-location-container');
    const previewLinkedinContainer = document.getElementById('preview-linkedin-container');
    const previewGithubContainer = document.getElementById('preview-github-container');

    const previewSummary = document.getElementById('preview-summary');
    const previewSummarySection = document.getElementById('preview-summary-section');

    const previewEducationSection = document.getElementById('preview-education-section');
    const previewEducationList = document.getElementById('preview-education-list');

    const previewSkillsSection = document.getElementById('preview-skills-section');
    const previewSkillsList = document.getElementById('preview-skills-list');

    const previewProjectsSection = document.getElementById('preview-projects-section');
    const previewProjectsList = document.getElementById('preview-projects-list');

    const previewExperienceSection = document.getElementById('preview-experience-section');
    const previewExperienceList = document.getElementById('preview-experience-list');

    const previewCertificationsSection = document.getElementById('preview-certifications-section');
    const previewCertificationsList = document.getElementById('preview-certifications-list');

    const previewAchievementsSection = document.getElementById('preview-achievements-section');
    const previewAchievementsList = document.getElementById('preview-achievements-list');

    // Dynamic Form Containers
    const educationContainer = document.getElementById('education-container');
    const projectsContainer = document.getElementById('projects-container');
    const experienceContainer = document.getElementById('experience-container');
    const certificationsContainer = document.getElementById('certifications-container');
    const achievementsContainer = document.getElementById('achievements-container');

    // Header & Badge Elements
    const headerAtsPill = document.getElementById('header-ats-pill');
    const previewAtsTag = document.getElementById('preview-ats-tag');
    const previewTemplateNameTag = document.getElementById('preview-template-name-tag');
    const savedCountBadge = document.getElementById('saved-count-badge');
    const currentDocName = document.getElementById('current-doc-name');

    // Toast Container
    const toastContainer = document.getElementById('toast-container');

    // ==========================================
    // 2. Toast Notifications Helper
    // ==========================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // ==========================================
    // 3. Live Preview Update Engine
    // ==========================================
    function updatePersonalInfo() {
        const nameVal = inputFullName.value.trim();
        previewName.textContent = nameVal || 'Your Full Name';

        const titleVal = inputProfessionalTitle.value.trim();
        previewTitle.textContent = titleVal || 'Professional Title / Headline';

        // Email
        const emailVal = inputEmail.value.trim();
        if (emailVal) {
            previewEmail.textContent = emailVal;
            previewEmailContainer.style.display = 'inline-flex';
        } else {
            previewEmailContainer.style.display = 'none';
        }

        // Phone
        const phoneVal = inputPhone.value.trim();
        if (phoneVal) {
            previewPhone.textContent = phoneVal;
            previewPhoneContainer.style.display = 'inline-flex';
        } else {
            previewPhoneContainer.style.display = 'none';
        }

        // Location
        const locationVal = inputLocation.value.trim();
        if (locationVal) {
            previewLocation.textContent = locationVal;
            previewLocationContainer.style.display = 'inline-flex';
        } else {
            previewLocationContainer.style.display = 'none';
        }

        // LinkedIn
        const linkedinVal = inputLinkedin.value.trim();
        if (linkedinVal) {
            const displayUrl = linkedinVal.replace(/^https?:\/\/(www\.)?/, '');
            previewLinkedin.textContent = displayUrl;
            previewLinkedin.href = linkedinVal.startsWith('http') ? linkedinVal : `https://${linkedinVal}`;
            previewLinkedinContainer.style.display = 'inline-flex';
        } else {
            previewLinkedinContainer.style.display = 'none';
        }

        // GitHub
        const githubVal = inputGithub.value.trim();
        if (githubVal) {
            const displayUrl = githubVal.replace(/^https?:\/\/(www\.)?/, '');
            previewGithub.textContent = displayUrl;
            previewGithub.href = githubVal.startsWith('http') ? githubVal : `https://${githubVal}`;
            previewGithubContainer.style.display = 'inline-flex';
        } else {
            previewGithubContainer.style.display = 'none';
        }

        debouncedAtsScore();
    }

    function updateSummary() {
        const summaryVal = inputSummary.value.trim();
        if (summaryVal) {
            previewSummary.textContent = summaryVal;
            previewSummarySection.style.display = 'block';
        } else {
            previewSummarySection.style.display = 'none';
        }
        debouncedAtsScore();
    }

    function updateSkills() {
        const skillsRaw = inputSkills.value.trim();
        previewSkillsList.innerHTML = '';

        if (!skillsRaw) {
            previewSkillsSection.style.display = 'none';
            debouncedAtsScore();
            return;
        }

        const skillsArray = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

        if (skillsArray.length === 0) {
            previewSkillsSection.style.display = 'none';
            debouncedAtsScore();
            return;
        }

        previewSkillsSection.style.display = 'block';
        skillsArray.forEach(skill => {
            const pill = document.createElement('span');
            pill.className = 'skill-pill';
            pill.textContent = skill;
            previewSkillsList.appendChild(pill);
        });

        debouncedAtsScore();
    }

    // Attach listeners for single inputs
    [inputFullName, inputProfessionalTitle, inputEmail, inputPhone, inputLocation, inputLinkedin, inputGithub].forEach(input => {
        if (input) input.addEventListener('input', updatePersonalInfo);
    });

    if (inputSummary) inputSummary.addEventListener('input', updateSummary);
    if (inputSkills) inputSkills.addEventListener('input', updateSkills);

    // ==========================================
    // 4. Dynamic Entry Creators
    // ==========================================

    // --- Education ---
    function createEducationCard(data = { degree: '', college: '', startYear: '', endYear: '', description: '' }) {
        const card = document.createElement('div');
        card.className = 'dynamic-card';
        card.innerHTML = `
            <div class="dynamic-card-header">
                <span class="card-title-tag">Education</span>
                <button type="button" class="btn-remove-item" title="Delete entry"><i class="fa-solid fa-trash-can"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group full-width">
                    <label>Degree / Program</label>
                    <input type="text" class="edu-degree" placeholder="e.g. B.Tech in CSE" value="${data.degree || ''}">
                </div>
                <div class="form-group full-width">
                    <label>College / University</label>
                    <input type="text" class="edu-college" placeholder="e.g. National Institute of Technology" value="${data.college || ''}">
                </div>
                <div class="form-group">
                    <label>Start Year</label>
                    <input type="text" class="edu-start-year" placeholder="e.g. 2024" value="${data.startYear || ''}">
                </div>
                <div class="form-group">
                    <label>End Year</label>
                    <input type="text" class="edu-end-year" placeholder="e.g. 2028" value="${data.endYear || ''}">
                </div>
                <div class="form-group full-width">
                    <label>Description / CGPA</label>
                    <textarea class="edu-desc" rows="2" placeholder="e.g. CGPA: 9.1/10. Data Structures, OOPs.">${data.description || ''}</textarea>
                </div>
            </div>
        `;

        card.querySelector('.btn-remove-item').addEventListener('click', () => {
            card.remove();
            updateEducationPreview();
        });

        card.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updateEducationPreview));
        educationContainer.appendChild(card);
        updateEducationPreview();
    }

    function updateEducationPreview() {
        previewEducationList.innerHTML = '';
        const cards = educationContainer.querySelectorAll('.dynamic-card');
        let count = 0;

        cards.forEach(card => {
            const degree = card.querySelector('.edu-degree').value.trim();
            const college = card.querySelector('.edu-college').value.trim();
            const startYear = card.querySelector('.edu-start-year').value.trim();
            const endYear = card.querySelector('.edu-end-year').value.trim();
            const desc = card.querySelector('.edu-desc').value.trim();

            if (degree || college || desc) {
                count++;
                const entry = document.createElement('div');
                entry.className = 'resume-entry';
                const yearText = (startYear || endYear) ? `${startYear}${startYear && endYear ? ' – ' : ''}${endYear}` : '';

                entry.innerHTML = `
                    <div class="resume-entry-header">
                        <div>
                            <span class="entry-title">${degree || 'Degree Program'}</span>
                            ${college ? `<span class="entry-subtitle"> | ${college}</span>` : ''}
                        </div>
                        ${yearText ? `<span class="entry-date">${yearText}</span>` : ''}
                    </div>
                    ${desc ? `<p class="entry-description">${desc}</p>` : ''}
                `;
                previewEducationList.appendChild(entry);
            }
        });

        previewEducationSection.style.display = count > 0 ? 'block' : 'none';
        debouncedAtsScore();
    }

    // --- Projects ---
    function createProjectCard(data = { name: '', description: '', technologies: '', link: '' }) {
        const card = document.createElement('div');
        card.className = 'dynamic-card';
        card.innerHTML = `
            <div class="dynamic-card-header">
                <span class="card-title-tag">Project</span>
                <button type="button" class="btn-remove-item" title="Delete entry"><i class="fa-solid fa-trash-can"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" class="proj-name" placeholder="e.g. SpendWise Tracker" value="${data.name || ''}">
                </div>
                <div class="form-group">
                    <label>Project / Demo Link</label>
                    <input type="url" class="proj-link" placeholder="e.g. github.com/user/project" value="${data.link || ''}">
                </div>
                <div class="form-group full-width">
                    <label>Technologies Used</label>
                    <input type="text" class="proj-tech" placeholder="e.g. Python, Flask, HTML, CSS" value="${data.technologies || ''}">
                </div>
                <div class="form-group full-width">
                    <label>Description</label>
                    <textarea class="proj-desc" rows="2" placeholder="e.g. Built full-stack tracker cutting load latency by 25%.">${data.description || ''}</textarea>
                </div>
            </div>
        `;

        card.querySelector('.btn-remove-item').addEventListener('click', () => {
            card.remove();
            updateProjectsPreview();
        });

        card.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updateProjectsPreview));
        projectsContainer.appendChild(card);
        updateProjectsPreview();
    }

    function updateProjectsPreview() {
        previewProjectsList.innerHTML = '';
        const cards = projectsContainer.querySelectorAll('.dynamic-card');
        let count = 0;

        cards.forEach(card => {
            const name = card.querySelector('.proj-name').value.trim();
            const link = card.querySelector('.proj-link').value.trim();
            const tech = card.querySelector('.proj-tech').value.trim();
            const desc = card.querySelector('.proj-desc').value.trim();

            if (name || desc || tech) {
                count++;
                const entry = document.createElement('div');
                entry.className = 'resume-entry';

                let linkHtml = '';
                if (link) {
                    const formattedLink = link.startsWith('http') ? link : `https://${link}`;
                    const displayLink = link.replace(/^https?:\/\/(www\.)?/, '');
                    linkHtml = `<a href="${formattedLink}" target="_blank" rel="noopener noreferrer" class="entry-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${displayLink}</a>`;
                }

                entry.innerHTML = `
                    <div class="resume-entry-header">
                        <div>
                            <span class="entry-title">${name || 'Project Name'}</span>
                            ${linkHtml}
                        </div>
                    </div>
                    ${tech ? `<div class="entry-tech"><strong>Tech:</strong> ${tech}</div>` : ''}
                    ${desc ? `<p class="entry-description">${desc}</p>` : ''}
                `;
                previewProjectsList.appendChild(entry);
            }
        });

        previewProjectsSection.style.display = count > 0 ? 'block' : 'none';
        debouncedAtsScore();
    }

    // --- Experience ---
    function createExperienceCard(data = { title: '', company: '', startDate: '', endDate: '', description: '' }) {
        const card = document.createElement('div');
        card.className = 'dynamic-card';
        card.innerHTML = `
            <div class="dynamic-card-header">
                <span class="card-title-tag">Experience</span>
                <button type="button" class="btn-remove-item" title="Delete entry"><i class="fa-solid fa-trash-can"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Job / Internship Title</label>
                    <input type="text" class="exp-title" placeholder="e.g. Software Intern" value="${data.title || ''}">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="exp-company" placeholder="e.g. Apex Tech" value="${data.company || ''}">
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" class="exp-start" placeholder="e.g. June 2024" value="${data.startDate || ''}">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" class="exp-end" placeholder="e.g. Aug 2024" value="${data.endDate || ''}">
                </div>
                <div class="form-group full-width">
                    <label>Responsibilities & Achievements</label>
                    <textarea class="exp-desc" rows="2" placeholder="e.g. Engineered REST endpoints and optimized database queries.">${data.description || ''}</textarea>
                </div>
            </div>
        `;

        card.querySelector('.btn-remove-item').addEventListener('click', () => {
            card.remove();
            updateExperiencePreview();
        });

        card.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updateExperiencePreview));
        experienceContainer.appendChild(card);
        updateExperiencePreview();
    }

    function updateExperiencePreview() {
        previewExperienceList.innerHTML = '';
        const cards = experienceContainer.querySelectorAll('.dynamic-card');
        let count = 0;

        cards.forEach(card => {
            const title = card.querySelector('.exp-title').value.trim();
            const company = card.querySelector('.exp-company').value.trim();
            const start = card.querySelector('.exp-start').value.trim();
            const end = card.querySelector('.exp-end').value.trim();
            const desc = card.querySelector('.exp-desc').value.trim();

            if (title || company || desc) {
                count++;
                const entry = document.createElement('div');
                entry.className = 'resume-entry';
                const dateText = (start || end) ? `${start}${start && end ? ' – ' : ''}${end}` : '';

                entry.innerHTML = `
                    <div class="resume-entry-header">
                        <div>
                            <span class="entry-title">${title || 'Position Title'}</span>
                            ${company ? `<span class="entry-subtitle"> | ${company}</span>` : ''}
                        </div>
                        ${dateText ? `<span class="entry-date">${dateText}</span>` : ''}
                    </div>
                    ${desc ? `<p class="entry-description">${desc}</p>` : ''}
                `;
                previewExperienceList.appendChild(entry);
            }
        });

        previewExperienceSection.style.display = count > 0 ? 'block' : 'none';
        debouncedAtsScore();
    }

    // --- Certifications ---
    function createCertificationCard(data = { name: '', organization: '', date: '', url: '' }) {
        const card = document.createElement('div');
        card.className = 'dynamic-card';
        card.innerHTML = `
            <div class="dynamic-card-header">
                <span class="card-title-tag">Certification</span>
                <button type="button" class="btn-remove-item" title="Delete entry"><i class="fa-solid fa-trash-can"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Certification Name</label>
                    <input type="text" class="cert-name" placeholder="e.g. Python for Everybody" value="${data.name || ''}">
                </div>
                <div class="form-group">
                    <label>Issuing Organization</label>
                    <input type="text" class="cert-org" placeholder="e.g. Coursera" value="${data.organization || ''}">
                </div>
                <div class="form-group">
                    <label>Date Issued</label>
                    <input type="text" class="cert-date" placeholder="e.g. July 2024" value="${data.date || ''}">
                </div>
                <div class="form-group">
                    <label>Credential URL</label>
                    <input type="url" class="cert-url" placeholder="e.g. verify link" value="${data.url || ''}">
                </div>
            </div>
        `;

        card.querySelector('.btn-remove-item').addEventListener('click', () => {
            card.remove();
            updateCertificationsPreview();
        });

        card.querySelectorAll('input').forEach(el => el.addEventListener('input', updateCertificationsPreview));
        certificationsContainer.appendChild(card);
        updateCertificationsPreview();
    }

    function updateCertificationsPreview() {
        previewCertificationsList.innerHTML = '';
        const cards = certificationsContainer.querySelectorAll('.dynamic-card');
        let count = 0;

        cards.forEach(card => {
            const name = card.querySelector('.cert-name').value.trim();
            const org = card.querySelector('.cert-org').value.trim();
            const date = card.querySelector('.cert-date').value.trim();
            const url = card.querySelector('.cert-url').value.trim();

            if (name || org) {
                count++;
                const entry = document.createElement('div');
                entry.className = 'resume-entry';

                let linkHtml = '';
                if (url) {
                    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
                    linkHtml = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer" class="entry-link"><i class="fa-solid fa-certificate"></i> Credential</a>`;
                }

                entry.innerHTML = `
                    <div class="resume-entry-header">
                        <div>
                            <span class="entry-title">${name || 'Certificate Name'}</span>
                            ${org ? `<span class="entry-subtitle"> | ${org}</span>` : ''}
                            ${linkHtml}
                        </div>
                        ${date ? `<span class="entry-date">${date}</span>` : ''}
                    </div>
                `;
                previewCertificationsList.appendChild(entry);
            }
        });

        previewCertificationsSection.style.display = count > 0 ? 'block' : 'none';
        debouncedAtsScore();
    }

    // --- Achievements ---
    function createAchievementCard(data = { text: '' }) {
        const card = document.createElement('div');
        card.className = 'dynamic-card';
        card.innerHTML = `
            <div class="dynamic-card-header">
                <span class="card-title-tag">Achievement</span>
                <button type="button" class="btn-remove-item" title="Delete entry"><i class="fa-solid fa-trash-can"></i> Remove</button>
            </div>
            <div class="form-group full-width">
                <label>Achievement Description</label>
                <textarea class="ach-text" rows="2" placeholder="e.g. Secured 1st position in Annual College Hackathon.">${data.text || ''}</textarea>
            </div>
        `;

        card.querySelector('.btn-remove-item').addEventListener('click', () => {
            card.remove();
            updateAchievementsPreview();
        });

        card.querySelector('textarea').addEventListener('input', updateAchievementsPreview);
        achievementsContainer.appendChild(card);
        updateAchievementsPreview();
    }

    function updateAchievementsPreview() {
        previewAchievementsList.innerHTML = '';
        const cards = achievementsContainer.querySelectorAll('.dynamic-card');
        let count = 0;

        cards.forEach(card => {
            const text = card.querySelector('.ach-text').value.trim();
            if (text) {
                count++;
                const li = document.createElement('li');
                li.textContent = text;
                previewAchievementsList.appendChild(li);
            }
        });

        previewAchievementsSection.style.display = count > 0 ? 'block' : 'none';
        debouncedAtsScore();
    }

    // Dynamic Add Buttons
    document.getElementById('btn-add-education').addEventListener('click', () => createEducationCard());
    document.getElementById('btn-add-project').addEventListener('click', () => createProjectCard());
    document.getElementById('btn-add-experience').addEventListener('click', () => createExperienceCard());
    document.getElementById('btn-add-certification').addEventListener('click', () => createCertificationCard());
    document.getElementById('btn-add-achievement').addEventListener('click', () => createAchievementCard());

    // ==========================================
    // 5. Template & Color Theme Switcher
    // ==========================================
    const templateTabs = document.querySelectorAll('.template-tab');
    const colorDots = document.querySelectorAll('.color-dot');

    const templateDisplayNames = {
        'modern': 'Modern Clean',
        'classic': 'Classic Ivy (ATS)',
        'minimal': 'Tech Minimalist',
        'executive': 'Executive Sleek',
        'creative': 'Compact Split'
    };

    function setTemplate(templateId) {
        currentTemplateId = templateId;
        resumeSheet.className = `resume-sheet template-${templateId}`;
        
        templateTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.template === templateId);
        });

        previewTemplateNameTag.textContent = `Template: ${templateDisplayNames[templateId] || 'Modern'}`;
    }

    function setThemeColor(colorHex) {
        currentThemeColor = colorHex;
        resumeSheet.style.setProperty('--resume-primary', colorHex);
        
        colorDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.color === colorHex);
        });
    }

    templateTabs.forEach(tab => {
        tab.addEventListener('click', () => setTemplate(tab.dataset.template));
    });

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => setThemeColor(dot.dataset.color));
    });

    // ==========================================
    // 6. JSON Data Serialization Helper
    // ==========================================
    function getFormDataJson() {
        const education = [];
        educationContainer.querySelectorAll('.dynamic-card').forEach(c => {
            education.push({
                degree: c.querySelector('.edu-degree').value.trim(),
                college: c.querySelector('.edu-college').value.trim(),
                startYear: c.querySelector('.edu-start-year').value.trim(),
                endYear: c.querySelector('.edu-end-year').value.trim(),
                description: c.querySelector('.edu-desc').value.trim()
            });
        });

        const projects = [];
        projectsContainer.querySelectorAll('.dynamic-card').forEach(c => {
            projects.push({
                name: c.querySelector('.proj-name').value.trim(),
                link: c.querySelector('.proj-link').value.trim(),
                technologies: c.querySelector('.proj-tech').value.trim(),
                description: c.querySelector('.proj-desc').value.trim()
            });
        });

        const experience = [];
        experienceContainer.querySelectorAll('.dynamic-card').forEach(c => {
            experience.push({
                title: c.querySelector('.exp-title').value.trim(),
                company: c.querySelector('.exp-company').value.trim(),
                startDate: c.querySelector('.exp-start').value.trim(),
                endDate: c.querySelector('.exp-end').value.trim(),
                description: c.querySelector('.exp-desc').value.trim()
            });
        });

        const certifications = [];
        certificationsContainer.querySelectorAll('.dynamic-card').forEach(c => {
            certifications.push({
                name: c.querySelector('.cert-name').value.trim(),
                organization: c.querySelector('.cert-org').value.trim(),
                date: c.querySelector('.cert-date').value.trim(),
                url: c.querySelector('.cert-url').value.trim()
            });
        });

        const achievements = [];
        achievementsContainer.querySelectorAll('.dynamic-card').forEach(c => {
            achievements.push({
                text: c.querySelector('.ach-text').value.trim()
            });
        });

        return {
            personal: {
                fullName: inputFullName.value.trim(),
                professionalTitle: inputProfessionalTitle.value.trim(),
                email: inputEmail.value.trim(),
                phone: inputPhone.value.trim(),
                location: inputLocation.value.trim(),
                linkedin: inputLinkedin.value.trim(),
                github: inputGithub.value.trim()
            },
            summary: inputSummary.value.trim(),
            skills: inputSkills.value.trim(),
            education,
            projects,
            experience,
            certifications,
            achievements
        };
    }

    function populateFormFromJson(data) {
        if (!data) return;

        // Personal
        const p = data.personal || {};
        inputFullName.value = p.fullName || '';
        inputProfessionalTitle.value = p.professionalTitle || '';
        inputEmail.value = p.email || '';
        inputPhone.value = p.phone || '';
        inputLocation.value = p.location || '';
        inputLinkedin.value = p.linkedin || '';
        inputGithub.value = p.github || '';

        // Summary & Skills
        inputSummary.value = data.summary || '';
        inputSkills.value = data.skills || '';

        // Clear dynamic containers
        educationContainer.innerHTML = '';
        projectsContainer.innerHTML = '';
        experienceContainer.innerHTML = '';
        certificationsContainer.innerHTML = '';
        achievementsContainer.innerHTML = '';

        // Repopulate dynamic containers
        (data.education || []).forEach(item => createEducationCard(item));
        (data.projects || []).forEach(item => createProjectCard(item));
        (data.experience || []).forEach(item => createExperienceCard(item));
        (data.certifications || []).forEach(item => createCertificationCard(item));
        (data.achievements || []).forEach(item => createAchievementCard(item));

        // Update previews
        updatePersonalInfo();
        updateSummary();
        updateSkills();
    }

    // ==========================================
    // 7. SQLite Database Operations
    // ==========================================
    const modalSaveResume = document.getElementById('modal-save-resume');
    const modalSavedResumes = document.getElementById('modal-saved-resumes');
    const saveResumeTitleInput = document.getElementById('save-resume-title');

    // Open Save Modal
    document.getElementById('btn-save-resume-db').addEventListener('click', () => {
        const name = inputFullName.value.trim() || 'My';
        saveResumeTitleInput.value = `${name}'s Resume (${new Date().toLocaleDateString()})`;
        openModal(modalSaveResume);
    });

    // Save to Database
    document.getElementById('btn-confirm-save-resume').addEventListener('click', async () => {
        const title = saveResumeTitleInput.value.trim() || 'Untitled Resume';
        const formData = getFormDataJson();

        const payload = {
            title: title,
            template_id: currentTemplateId,
            theme_color: currentThemeColor,
            data: formData
        };

        try {
            let res;
            if (currentResumeId) {
                // Update existing
                res = await fetch(`/api/resumes/${currentResumeId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create new
                res = await fetch('/api/resumes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();
            if (data.success) {
                currentResumeId = data.id;
                currentDocName.textContent = title;
                closeModal(modalSaveResume);
                showToast(`Resume "${title}" saved to database!`, 'success');
                refreshSavedResumesCount();
            } else {
                showToast(data.error || 'Failed to save resume.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error while saving to database.', 'error');
        }
    });

    // Open Saved Resumes Modal
    document.getElementById('btn-open-my-resumes').addEventListener('click', () => {
        loadSavedResumesList();
        openModal(modalSavedResumes);
    });

    async function refreshSavedResumesCount() {
        try {
            const res = await fetch('/api/resumes');
            const data = await res.json();
            if (data.success && data.resumes) {
                savedCountBadge.textContent = data.resumes.length;
            }
        } catch (e) {
            console.warn('Could not fetch saved count', e);
        }
    }

    async function loadSavedResumesList() {
        const listContainer = document.getElementById('saved-resumes-list');
        listContainer.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>';

        try {
            const res = await fetch('/api/resumes');
            const data = await res.json();

            if (!data.success || !data.resumes || data.resumes.length === 0) {
                listContainer.innerHTML = '<p class="text-muted" style="text-align:center; padding: 2rem;">No saved resumes found in database yet. Click "Save Resume" to save your current draft!</p>';
                savedCountBadge.textContent = '0';
                return;
            }

            savedCountBadge.textContent = data.resumes.length;
            listContainer.innerHTML = '';

            data.resumes.forEach(item => {
                const row = document.createElement('div');
                row.className = 'saved-resume-item';
                row.innerHTML = `
                    <div>
                        <div class="saved-item-title">${item.title}</div>
                        <div class="saved-item-meta">
                            <span>Template: ${templateDisplayNames[item.template_id] || item.template_id}</span> • 
                            <span>Updated: ${item.updated_at}</span>
                        </div>
                    </div>
                    <div class="saved-item-actions">
                        <button type="button" class="btn btn-primary btn-sm btn-load-db" data-id="${item.id}">
                            <i class="fa-solid fa-folder-open"></i> Load
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm btn-delete-db" data-id="${item.id}" title="Delete">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                `;

                // Load resume listener
                row.querySelector('.btn-load-db').addEventListener('click', async () => {
                    await loadResumeById(item.id);
                    closeModal(modalSavedResumes);
                });

                // Delete resume listener
                row.querySelector('.btn-delete-db').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${item.title}" permanently from database?`)) {
                        await deleteResumeById(item.id);
                        loadSavedResumesList();
                    }
                });

                listContainer.appendChild(row);
            });
        } catch (err) {
            console.error(err);
            listContainer.innerHTML = '<p class="text-danger">Failed to load saved resumes.</p>';
        }
    }

    async function loadResumeById(id) {
        try {
            const res = await fetch(`/api/resumes/${id}`);
            const data = await res.json();
            if (data.success && data.resume) {
                currentResumeId = data.resume.id;
                currentDocName.textContent = data.resume.title;
                
                if (data.resume.template_id) setTemplate(data.resume.template_id);
                if (data.resume.theme_color) setThemeColor(data.resume.theme_color);

                populateFormFromJson(data.resume.data);
                showToast(`Loaded "${data.resume.title}" successfully!`, 'success');
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to load resume.', 'error');
        }
    }

    async function deleteResumeById(id) {
        try {
            const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showToast('Resume deleted from database.', 'success');
                if (currentResumeId === id) {
                    currentResumeId = null;
                    currentDocName.textContent = 'Untitled Draft';
                }
                refreshSavedResumesCount();
            }
        } catch (err) {
            console.error(err);
            showToast('Error deleting resume.', 'error');
        }
    }

    // ==========================================
    // 8. AI Resume Optimization Suite
    // ==========================================
    
    // --- ATS Score Analyzer ---
    const modalAts = document.getElementById('modal-ats-analyzer');
    let atsTimeout = null;

    function debouncedAtsScore() {
        clearTimeout(atsTimeout);
        atsTimeout = setTimeout(calculateLiveAtsScore, 600);
    }

    async function calculateLiveAtsScore() {
        const formData = getFormDataJson();
        try {
            const res = await fetch('/api/ai/analyze-ats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: formData })
            });
            const result = await res.json();
            if (result.success && result.analysis) {
                const a = result.analysis;
                headerAtsPill.textContent = `${a.score}%`;
                previewAtsTag.innerHTML = `<i class="fa-solid fa-gauge-high"></i> ATS Score: ${a.score}%`;

                // Update ATS modal contents
                document.getElementById('ats-modal-score-number').textContent = a.score;
                document.getElementById('ats-modal-rating-title').textContent = a.rating;

                const strengthsList = document.getElementById('ats-modal-strengths-list');
                strengthsList.innerHTML = a.strengths.map(s => `<li>${s}</li>`).join('');

                const improvementsList = document.getElementById('ats-modal-improvements-list');
                improvementsList.innerHTML = a.improvements.map(i => `<li>${i}</li>`).join('') || '<li>All core ATS criteria met!</li>';
            }
        } catch (e) {
            console.warn('ATS score calculation error', e);
        }
    }

    document.getElementById('btn-open-ats-modal').addEventListener('click', () => {
        calculateLiveAtsScore();
        openModal(modalAts);
    });

    document.getElementById('btn-refresh-ats-score').addEventListener('click', () => {
        calculateLiveAtsScore();
        showToast('ATS Score updated!', 'info');
    });

    // --- AI Professional Summary Optimizer ---
    const modalAiSummary = document.getElementById('modal-ai-summary');
    const btnTriggerAiSummary = document.getElementById('btn-trigger-ai-summary');

    btnTriggerAiSummary.addEventListener('click', async () => {
        const currentSummary = inputSummary.value.trim();
        const jobTitle = inputProfessionalTitle.value.trim() || 'Computer Science Student';
        const skills = inputSkills.value.trim();

        openModal(modalAiSummary);
        const container = document.getElementById('ai-summary-cards-container');
        container.innerHTML = '<div class="loading-state"><i class="fa-solid fa-wand-magic-sparkles fa-spin"></i> Generating tailored summaries...</div>';

        try {
            const res = await fetch('/api/ai/optimize-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ summary: currentSummary, job_title: jobTitle, skills: skills })
            });
            const data = await res.json();

            if (data.success && data.suggestions) {
                container.innerHTML = '';
                data.suggestions.forEach(opt => {
                    const card = document.createElement('div');
                    card.className = 'ai-summary-card';
                    card.innerHTML = `
                        <div class="ai-card-badge"><i class="fa-solid fa-sparkles"></i> ${opt.tone}</div>
                        <p class="ai-summary-text">${opt.text}</p>
                        <div>
                            <button type="button" class="btn btn-ai-small btn-apply-summary">
                                <i class="fa-solid fa-check"></i> Use This Summary
                            </button>
                        </div>
                    `;
                    card.querySelector('.btn-apply-summary').addEventListener('click', () => {
                        inputSummary.value = opt.text;
                        updateSummary();
                        closeModal(modalAiSummary);
                        showToast('AI Summary applied to resume!', 'success');
                    });
                    container.appendChild(card);
                });
            }
        } catch (err) {
            console.error(err);
            container.innerHTML = '<p class="text-danger">Failed to generate AI summary suggestions.</p>';
        }
    });

    // --- AI Skill Suggester ---
    const modalAiSkills = document.getElementById('modal-ai-skills');
    const btnTriggerAiSkills = document.getElementById('btn-trigger-ai-skills');
    const roleSelect = document.getElementById('ai-role-select');
    const skillsPillsContainer = document.getElementById('ai-suggested-skills-pills');

    async function loadSuggestedSkills(role) {
        skillsPillsContainer.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Fetching skills...</div>';
        try {
            const res = await fetch('/api/ai/suggest-skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role })
            });
            const data = await res.json();
            if (data.success && data.skills) {
                skillsPillsContainer.innerHTML = '';
                data.skills.forEach(skill => {
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.className = 'skill-chip-toggle';
                    chip.innerHTML = `<i class="fa-solid fa-plus"></i> ${skill}`;
                    chip.dataset.skill = skill;

                    chip.addEventListener('click', () => {
                        chip.classList.toggle('selected');
                        if (chip.classList.contains('selected')) {
                            chip.querySelector('i').className = 'fa-solid fa-check';
                        } else {
                            chip.querySelector('i').className = 'fa-solid fa-plus';
                        }
                    });
                    skillsPillsContainer.appendChild(chip);
                });
            }
        } catch (err) {
            console.error(err);
            skillsPillsContainer.innerHTML = '<p class="text-danger">Failed to load skills.</p>';
        }
    }

    btnTriggerAiSkills.addEventListener('click', () => {
        loadSuggestedSkills(roleSelect.value);
        openModal(modalAiSkills);
    });

    roleSelect.addEventListener('change', () => loadSuggestedSkills(roleSelect.value));

    document.getElementById('btn-apply-selected-skills').addEventListener('click', () => {
        const selectedChips = skillsPillsContainer.querySelectorAll('.skill-chip-toggle.selected');
        const selectedSkills = Array.from(selectedChips).map(c => c.dataset.skill);

        if (selectedSkills.length === 0) {
            showToast('Please select at least one skill to add.', 'info');
            return;
        }

        const currentSkills = inputSkills.value.trim();
        const existingArray = currentSkills ? currentSkills.split(',').map(s => s.trim()) : [];
        const combined = Array.from(new Set([...existingArray, ...selectedSkills])).filter(Boolean);

        inputSkills.value = combined.join(', ');
        updateSkills();
        closeModal(modalAiSkills);
        showToast(`Added ${selectedSkills.length} skills to resume!`, 'success');
    });

    // ==========================================
    // 9. Modal Helpers & Handlers
    // ==========================================
    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.add('show');
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove('show');
    }

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.close;
            const targetModal = document.getElementById(targetId);
            closeModal(targetModal);
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // ==========================================
    // 10. Sample Data Loader & Reset Controls
    // ==========================================
    function loadSampleData() {
        inputFullName.value = "Piyush Verma";
        inputProfessionalTitle.value = "Computer Science Student | Aspiring Full-Stack Developer";
        inputEmail.value = "piyush.verma@example.com";
        inputPhone.value = "+91 98765 43210";
        inputLocation.value = "Bengaluru, Karnataka, India";
        inputLinkedin.value = "linkedin.com/in/piyush-verma-cse";
        inputGithub.value = "github.com/piyush-verma";

        inputSummary.value = "Motivated first-year Computer Science student with a strong foundation in data structures, algorithms, and modular full-stack web development. Experienced in building responsive web tools with Python Flask and vanilla JavaScript. Passionate about software engineering and seeking summer internship opportunities.";

        inputSkills.value = "C++, Python, Flask, JavaScript (ES6+), HTML5, CSS3, SQL, Git & GitHub, Data Structures, REST APIs, Linux";

        educationContainer.innerHTML = '';
        projectsContainer.innerHTML = '';
        experienceContainer.innerHTML = '';
        certificationsContainer.innerHTML = '';
        achievementsContainer.innerHTML = '';

        createEducationCard({
            degree: "B.Tech in Computer Science and Engineering",
            college: "National Institute of Technology, Delhi",
            startYear: "2024",
            endYear: "2028",
            description: "Current CGPA: 9.2/10. Active member of Coding Club & Open Source Society."
        });

        createEducationCard({
            degree: "Senior Secondary (Class XII - CBSE)",
            college: "Delhi Public School",
            startYear: "2022",
            endYear: "2024",
            description: "Secured 94.6% in PCM with Computer Science."
        });

        createProjectCard({
            name: "ResumeCraft – AI Resume Generator",
            description: "Architected a full-stack resume generator with real-time live preview, 5 ATS templates, SQLite storage, and an AI optimization suite.",
            technologies: "Python, Flask, SQLite, Jinja2, Vanilla JavaScript, CSS3",
            link: "github.com/piyush-verma/ResumeCraft"
        });

        createProjectCard({
            name: "SpendWise – Personal Expense Tracker",
            description: "Designed a client-side finance tracker with interactive category filters, budget analytics, and persistent storage.",
            technologies: "HTML5, CSS3, JavaScript ES6+, LocalStorage API",
            link: "github.com/piyush-verma/SpendWise"
        });

        createExperienceCard({
            title: "Web Development Intern",
            company: "Apex Innovations",
            startDate: "June 2024",
            endDate: "Aug 2024",
            description: "Engineered responsive landing interfaces and modular REST API endpoints, cutting query response time by 20%."
        });

        createCertificationCard({
            name: "Python for Everybody Specialization",
            organization: "University of Michigan (Coursera)",
            date: "July 2024",
            url: "coursera.org/verify/sample123"
        });

        createCertificationCard({
            name: "Foundations of Front-End Web Development",
            organization: "freeCodeCamp",
            date: "May 2024",
            url: "freecodecamp.org/cert/sample456"
        });

        createAchievementCard({
            text: "Secured 1st place in Intra-College Hackathon 2024 among 45 teams for developing an interactive student productivity portal."
        });

        createAchievementCard({
            text: "Solved 200+ algorithmic problems across LeetCode & CodeChef with high problem-solving contest ratings."
        });

        updatePersonalInfo();
        updateSummary();
        updateSkills();
        showToast('Sample CS student resume loaded!', 'info');
    }

    function resetForm() {
        if (confirm("Are you sure you want to reset all form fields?")) {
            currentResumeId = null;
            currentDocName.textContent = 'Untitled Draft';
            document.getElementById('resume-form').reset();
            
            educationContainer.innerHTML = '';
            projectsContainer.innerHTML = '';
            experienceContainer.innerHTML = '';
            certificationsContainer.innerHTML = '';
            achievementsContainer.innerHTML = '';

            createEducationCard();
            createProjectCard();
            createExperienceCard();
            createCertificationCard();
            createAchievementCard();

            updatePersonalInfo();
            updateSummary();
            updateSkills();
            showToast('Form reset.', 'info');
        }
    }

    // Attach Action Listeners
    document.getElementById('btn-load-sample').addEventListener('click', loadSampleData);
    document.getElementById('btn-clear-form').addEventListener('click', resetForm);
    document.getElementById('btn-print-resume').addEventListener('click', () => window.print());

    // Initialize initial state
    loadSampleData();
    refreshSavedResumesCount();
});
