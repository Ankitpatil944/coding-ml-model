// API Configuration
const API_BASE_URL = 'http://localhost:8000'; // Update this to match your FastAPI server

// DOM Elements
const profileForm = document.getElementById('profileForm');
const resultsSection = document.getElementById('resultsSection');
const loading = document.getElementById('loading');

// Form submission handler
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        // Show loading state
        showLoading();
        
        // Get form data
        const formData = new FormData(profileForm);
        const profile = {
            Name: formData.get('name'),
            Education: formData.get('education'),
            Years_of_Experience: parseInt(formData.get('experience')),
            Project_Count: parseInt(formData.get('projectCount')),
            Domain: formData.get('domain'),
            Skills: formData.get('skills').split(',').map(skill => skill.trim()).filter(skill => skill),
            Certifications: formData.get('certifications') || 'None',
            Skill_Level: formData.get('skillLevel'),
            Fatigue: formData.get('fatigue')
        };

        // Validate required fields
        if (!validateProfile(profile)) {
            hideLoading();
            return;
        }

        // Make API call
        const response = await fetch(`${API_BASE_URL}/generate_question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Display results
        displayResults(result);
        hideLoading();
        
    } catch (error) {
        console.error('Error generating question:', error);
        hideLoading();
        showToast('Error generating question. Please try again.', 'error');
    }
});

// Validate profile data
function validateProfile(profile) {
    const errors = [];
    
    if (!profile.Name.trim()) errors.push('Name is required');
    if (!profile.Education) errors.push('Education level is required');
    if (profile.Years_of_Experience < 0) errors.push('Years of experience must be non-negative');
    if (profile.Project_Count < 0) errors.push('Project count must be non-negative');
    if (!profile.Domain) errors.push('Domain is required');
    if (!profile.Skills.length) errors.push('At least one skill is required');
    if (!profile.Skill_Level) errors.push('Skill level is required');
    
    if (errors.length > 0) {
        showToast(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

// Display results
function displayResults(result) {
    // Update candidate info
    document.getElementById('candidateName').textContent = result.name;
    document.getElementById('predictedType').textContent = result.predicted_type;
    document.getElementById('banditType').textContent = result.bandit_selected_type;
    document.getElementById('rewardScore').textContent = result.reward;
    
    // Update question
    document.getElementById('questionText').textContent = result.question;
    
    // Update rationale
    const rationaleList = document.getElementById('rationaleList');
    rationaleList.innerHTML = '';
    result.rationale.forEach(rationale => {
        const li = document.createElement('li');
        li.textContent = rationale;
        rationaleList.appendChild(li);
    });
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.classList.add('fade-in');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Show success toast
    showToast('Question generated successfully!', 'success');
}

// Show loading state
function showLoading() {
    loading.style.display = 'block';
    resultsSection.style.display = 'none';
    loading.scrollIntoView({ behavior: 'smooth' });
}

// Hide loading state
function hideLoading() {
    loading.style.display = 'none';
}

// Generate new question (re-submit form)
function generateNewQuestion() {
    profileForm.dispatchEvent(new Event('submit'));
}

// Copy question to clipboard
async function copyQuestion() {
    const questionText = document.getElementById('questionText').textContent;
    
    try {
        await navigator.clipboard.writeText(questionText);
        showToast('Question copied to clipboard!', 'success');
    } catch (error) {
        console.error('Failed to copy text: ', error);
        showToast('Failed to copy question', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Form validation on input
function addFormValidation() {
    const inputs = profileForm.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            // Remove error state on input
            input.classList.remove('error');
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const num = parseInt(value);
        if (isNaN(num) || num < 0) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        }
    }
    
    // Skills validation
    if (field.name === 'skills' && value) {
        const skills = value.split(',').map(s => s.trim()).filter(s => s);
        if (skills.length === 0) {
            isValid = false;
            errorMessage = 'Please enter at least one skill';
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
    } else {
        field.classList.remove('success');
        field.classList.add('error');
    }
    
    return isValid;
}

// Initialize form validation
addFormValidation();

// Auto-save form data to localStorage
function saveFormData() {
    const formData = new FormData(profileForm);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem('resumeBanditForm', JSON.stringify(data));
}

// Load saved form data
function loadFormData() {
    const saved = localStorage.getItem('resumeBanditForm');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const field = profileForm.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
}

// Save form data on input
profileForm.addEventListener('input', saveFormData);

// Load saved data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Health check on page load
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (response.ok) {
            console.log('API is healthy');
        } else {
            showToast('API server is not responding. Please check your connection.', 'error');
        }
    } catch (error) {
        console.error('API health check failed:', error);
        showToast('Cannot connect to API server. Please ensure the server is running.', 'error');
    }
}

// Check API health on page load
document.addEventListener('DOMContentLoaded', checkAPIHealth);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        profileForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        profileForm.reset();
        resultsSection.style.display = 'none';
        localStorage.removeItem('resumeBanditForm');
    }
});

// Add some helpful tooltips
function addTooltips() {
    const tooltips = {
        'education': 'Select your highest level of education',
        'experience': 'Total years of professional experience',
        'projectCount': 'Number of projects you have worked on',
        'domain': 'Your primary area of expertise',
        'skills': 'Technical skills separated by commas (e.g., Python, JavaScript, React)',
        'certifications': 'Professional certifications (leave empty if none)',
        'skillLevel': 'Your current skill level in your domain'
    };
    
    Object.keys(tooltips).forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.title = tooltips[fieldName];
        }
    });
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', addTooltips);

