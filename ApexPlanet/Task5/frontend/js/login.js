// Login page functionality

document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (isAuthenticated()) {
    const user = getUser();
    if (user && user.userType) {
      redirectToDashboard(user.userType);
    }
  }

  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;
    const submitButton = loginForm.querySelector('button[type="submit"]');
    
    // Hide any previous errors
    hideError('errorMessage');
    
    // Show loading state
    showLoading(submitButton);
    
    try {
      const response = await apiCall(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ userId, password })
      });
      
      if (response.success) {
        // Save token and user data
        saveToken(response.token);
        saveUser(response.user);
        
        // Show success message
        showToast('Login successful!', 'success');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
          redirectToDashboard(response.user.userType);
        }, 500);
      }
    } catch (error) {
      // Show error message
      const errorMessage = document.getElementById('errorMessage');
      const errorText = document.getElementById('errorText');
      errorText.textContent = error.message || 'Invalid credentials. Please try again.';
      errorMessage.style.display = 'flex';
      
      hideLoading(submitButton);
    }
  });
});
