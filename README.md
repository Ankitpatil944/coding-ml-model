# Personalized Resume Bandit API - UI

A modern, responsive web interface for the Personalized Resume Bandit API that generates AI-driven personalized coding questions using online learning.

## 🚀 Features

- **Modern UI**: Clean, responsive design with gradient backgrounds and smooth animations
- **Form Validation**: Real-time validation with helpful error messages
- **Auto-save**: Form data is automatically saved to localStorage
- **Copy to Clipboard**: Easy copying of generated questions
- **Mobile Responsive**: Works perfectly on all device sizes
- **Toast Notifications**: User-friendly feedback for all actions
- **Keyboard Shortcuts**: Ctrl+Enter to submit, Escape to clear form

## 📁 Files Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling with responsive design
├── script.js           # JavaScript for API interaction and form handling
├── server.py           # Simple HTTP server to serve the UI
└── README.md           # This file
```

## 🛠️ Setup Instructions

### 1. Start the FastAPI Server

First, make sure your FastAPI server is running:

```bash
# In your FastAPI project directory
python your_fastapi_file.py
# or
uvicorn your_fastapi_file:app --reload
```

The FastAPI server should be running on `http://localhost:8000`

### 2. Start the UI Server

```bash
# In the UI directory
python server.py
```

The UI will be available at `http://localhost:3000`

### 3. Configure API URL (if needed)

If your FastAPI server is running on a different port or host, update the `API_BASE_URL` in `script.js`:

```javascript
const API_BASE_URL = 'http://your-server:your-port';
```

## 🎨 UI Features

### Form Fields
- **Name**: Full name of the candidate
- **Education**: Dropdown with Diploma, Bachelor, Master, PhD options
- **Experience**: Years of professional experience (0-50)
- **Project Count**: Number of projects worked on (0-100)
- **Domain**: Primary area of expertise (Web Dev, AI/ML, etc.)
- **Skills**: Comma-separated list of technical skills
- **Certifications**: Professional certifications (optional)
- **Skill Level**: Beginner, Intermediate, Advanced
- **Fatigue Level**: Low, Medium, High (defaults to Low)

### Results Display
- **Candidate Info**: Shows the candidate's name
- **Prediction vs Selection**: Displays both the ML model prediction and bandit selection
- **Reward Score**: Shows the calculated reward (0-1)
- **Generated Question**: The personalized question from Gemini AI
- **Rationale**: Explanation of why this question was selected
- **Action Buttons**: Generate another question or copy to clipboard

### Responsive Design
- **Desktop**: Two-column layout with side-by-side form fields
- **Tablet**: Responsive grid that adapts to screen size
- **Mobile**: Single-column layout optimized for touch

## 🔧 Customization

### Styling
Edit `styles.css` to customize:
- Colors and gradients
- Fonts and typography
- Spacing and layout
- Animations and transitions

### Functionality
Edit `script.js` to customize:
- Form validation rules
- API endpoints
- User interactions
- Data processing

### Content
Edit `index.html` to customize:
- Form fields and labels
- Help text and tooltips
- Page structure
- Meta information

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your FastAPI server has CORS enabled
2. **API Not Found**: Check that the FastAPI server is running on the correct port
3. **Form Not Submitting**: Check browser console for JavaScript errors
4. **Styling Issues**: Ensure all CSS files are properly linked

### Debug Mode

Open browser developer tools (F12) to see:
- Network requests to the API
- Console errors and warnings
- Form validation messages

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 Usage Tips

1. **Fill all required fields** for best results
2. **Use specific skills** rather than generic terms
3. **Be accurate with experience** and project counts
4. **Try different skill levels** to see how questions change
5. **Use the copy button** to save questions for later

## 🔄 API Integration

The UI communicates with your FastAPI server using:

- **Endpoint**: `POST /generate_question`
- **Content-Type**: `application/json`
- **Response**: JSON with question, reward, rationale, etc.

Make sure your FastAPI server is configured to accept requests from the UI server.

## 📄 License

This UI is part of the Personalized Resume Bandit API project by Arihant B. Angolkar.

