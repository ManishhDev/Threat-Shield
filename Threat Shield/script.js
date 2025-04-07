// Set current year in the footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

// Email analyzer functionality
document.addEventListener('DOMContentLoaded', () => {
  const emailContent = document.getElementById('email-content');
  const analyzeBtn = document.getElementById('analyze-btn');
  const clearBtn = document.getElementById('clear-btn');
  const emailFileInput = document.getElementById('email-file');
  
  const noAnalysisState = document.getElementById('no-analysis');
  const analyzingState = document.getElementById('analyzing');
  const analysisResults = document.getElementById('analysis-results');
  const suspiciousUrls = document.getElementById('suspicious-urls');
  const analyzeAnother = document.getElementById('analyze-another');
  
  const riskLevel = document.getElementById('risk-level');
  const scoreValue = document.getElementById('score-value');
  const scoreFill = document.getElementById('score-fill');
  const issuesList = document.getElementById('issues-list');
  
  // Enable/disable analyze button based on content
  emailContent.addEventListener('input', () => {
    analyzeBtn.disabled = !emailContent.value.trim();
  });
  
  // File upload handler
  emailFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      emailContent.value = e.target.result;
      analyzeBtn.disabled = false;
    };
    reader.readAsText(file);
  });
  
  // Clear button handler
  clearBtn.addEventListener('click', () => {
    emailContent.value = '';
    analyzeBtn.disabled = true;
    noAnalysisState.classList.remove('hidden');
    analyzingState.classList.add('hidden');
    analysisResults.classList.add('hidden');
  });
  
  // Analyze button handler
  analyzeBtn.addEventListener('click', () => {
    if (!emailContent.value.trim()) return;
    
    // Show analyzing state
    noAnalysisState.classList.add('hidden');
    analyzingState.classList.remove('hidden');
    analysisResults.classList.add('hidden');
    
    // Simulate API call with timeout
    setTimeout(() => {
      analyzingState.classList.add('hidden');
      analysisResults.classList.remove('hidden');
      
      // Generate mock analysis result
      const isSuspicious = isEmailSuspicious(emailContent.value);
      const score = isSuspicious ? 
        Math.floor(Math.random() * 40) + 60 : // High score (60-100) if suspicious
        Math.floor(Math.random() * 30) + 10;  // Low score (10-40) if not suspicious
      
      // Update UI with score
      scoreValue.textContent = `${score}%`;
      scoreFill.style.width = `${score}%`;
      
      // Set score color
      if (score > 70) {
        scoreFill.style.backgroundColor = 'var(--color-red)';
        scoreValue.style.color = 'var(--color-red)';
        riskLevel.innerHTML = 'Risk: <span style="color: var(--color-red)">High</span>';
      } else if (score > 40) {
        scoreFill.style.backgroundColor = 'var(--color-yellow)';
        scoreValue.style.color = 'var(--color-yellow)';
        riskLevel.innerHTML = 'Risk: <span style="color: var(--color-yellow)">Medium</span>';
      } else {
        scoreFill.style.backgroundColor = 'var(--color-green)';
        scoreValue.style.color = 'var(--color-green)';
        riskLevel.innerHTML = 'Risk: <span style="color: var(--color-green)">Low</span>';
      }
      
      // Generate issues
      generateIssues(emailContent.value, issuesList);
      
      // Show suspicious URLs card if suspicious
      if (isSuspicious) {
        suspiciousUrls.classList.remove('hidden');
      } else {
        suspiciousUrls.classList.add('hidden');
      }
    }, 2000);
  });
  
  // Analyze another email button handler
  analyzeAnother.addEventListener('click', () => {
    emailContent.value = '';
    analyzeBtn.disabled = true;
    noAnalysisState.classList.remove('hidden');
    analysisResults.classList.add('hidden');
  });
  
  // Function to check if email is suspicious
  function isEmailSuspicious(content) {
    const suspiciousTerms = [
      'password', 'verify', 'account', 'click here', 'urgent', 'payment',
      'bank', 'credit card', 'security', 'login', 'suspicious', 'unusual activity'
    ];
    
    content = content.toLowerCase();
    return suspiciousTerms.some(term => content.includes(term));
  }
  
  // Function to generate issues
  function generateIssues(content, container) {
    container.innerHTML = '';
    content = content.toLowerCase();
    const issues = [];
    
    // Check for suspicious keywords
    if (content.includes('password') || content.includes('verify') || content.includes('login')) {
      issues.push({
        title: 'Sensitive Information Request',
        description: 'This email asks for password or account verification, a common phishing tactic.'
      });
    }
    
    if (content.includes('urgent') || content.includes('immediate') || content.includes('alert')) {
      issues.push({
        title: 'Urgency Tactics',
        description: 'The email creates a false sense of urgency to force quick action.'
      });
    }
    
    if (content.includes('click here') || content.includes('http') || content.includes('www')) {
      issues.push({
        title: 'Suspicious Links',
        description: 'Contains potentially harmful links or misleading URLs.'
      });
    }
    
    if (content.includes('bank') || content.includes('paypal') || content.includes('account')) {
      issues.push({
        title: 'Brand Impersonation',
        description: 'This email may be impersonating a trusted organization.'
      });
    }
    
    // If no issues detected but content is suspicious
    if (issues.length === 0 && isEmailSuspicious(content)) {
      issues.push({
        title: 'Suspicious Content',
        description: 'The email content contains patterns similar to known phishing attempts.'
      });
    }
    
    // If no issues detected at all
    if (issues.length === 0) {
      const safeIssue = document.createElement('div');
      safeIssue.className = 'issue-item';
      safeIssue.style.borderColor = 'var(--color-green)';
      safeIssue.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-green)">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <div class="issue-content">
          <h5 style="color: var(--color-green)">No Issues Detected</h5>
          <p>This email appears to be legitimate based on our analysis.</p>
        </div>
      `;
      container.appendChild(safeIssue);
      return;
    }
    
    // Add issues to container
    issues.forEach(issue => {
      const issueElement = document.createElement('div');
      issueElement.className = 'issue-item';
      issueElement.style.borderColor = 'var(--color-red-light)';
      issueElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-red)">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <div class="issue-content">
          <h5 style="color: var(--color-red)">${issue.title}</h5>
          <p>${issue.description}</p>
        </div>
      `;
      container.appendChild(issueElement);
    });
  }
});
