// Register page functionality

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const registrationCodeInput = document.getElementById('registrationCode');
  
  // Auto uppercase the input
  registrationCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
  
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const code = registrationCodeInput.value.trim().toUpperCase();
    const submitButton = registerForm.querySelector('button[type="submit"]');
    
    // Hide any previous errors
    hideError('errorMessage');
    
    // Show loading state
    showLoading(submitButton);
    
    try {
      const response = await apiCall(API_ENDPOINTS.verifyCode, {
        method: 'POST',
        body: JSON.stringify({ code })
      });
      
      if (response.success) {
        // Store the code and user type temporarily
        sessionStorage.setItem('registrationCode', code);
        sessionStorage.setItem('userType', response.userType);
        
        // Show success message
        showToast('Code verified! Redirecting...', 'success');
        
        // Redirect to registration portal
        setTimeout(() => {
          window.location.href = 'registration-portal.html';
        }, 500);
      }
    } catch (error) {
      // Show error message
      const errorMessage = document.getElementById('errorMessage');
      const errorText = document.getElementById('errorText');
      errorText.textContent = error.message || 'Invalid registration code. Please contact administration.';
      errorMessage.style.display = 'flex';
      
      hideLoading(submitButton);
    }
  });
});
