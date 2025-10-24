// Registration portal functionality

document.addEventListener('DOMContentLoaded', () => {
  // Get user type from session
  const userType = sessionStorage.getItem('userType');
  const registrationCode = sessionStorage.getItem('registrationCode');
  
  if (!userType || !registrationCode) {
    window.location.href = 'register.html';
    return;
  }
  
  // Update form title and description
  const formTitle = document.getElementById('formTitle');
  const formDescription = document.getElementById('formDescription');
  
  switch(userType) {
    case 'student':
      formTitle.textContent = 'Register New Student';
      formDescription.textContent = 'Create a new student account for Bhavapuri University';
      document.getElementById('studentFields').style.display = 'block';
      document.getElementById('program').required = true;
      document.getElementById('enrollmentYear').required = true;
      break;
    case 'faculty':
      formTitle.textContent = 'Register New Faculty';
      formDescription.textContent = 'Create a new faculty member account';
      document.getElementById('facultyFields').style.display = 'block';
      document.getElementById('designation').required = true;
      document.getElementById('qualification').required = true;
      break;
    case 'management':
      formTitle.textContent = 'Register New Management Member';
      formDescription.textContent = 'Create a new management account';
      document.getElementById('managementFields').style.display = 'block';
      document.getElementById('role').required = true;
      break;
  }
  
  // Generate User ID button
  const generateIdBtn = document.getElementById('generateIdBtn');
  const userIdInput = document.getElementById('userId');
  
  generateIdBtn.addEventListener('click', () => {
    const prefix = userType === 'student' ? 'S' : 
                   userType === 'faculty' ? 'F' : 'M';
    const userId = generateUserId(prefix);
    userIdInput.value = userId;
    showToast(`User ID generated: ${userId}`, 'success');
  });
  
  // Registration form submission
  const registrationForm = document.getElementById('registrationForm');
  
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userId = document.getElementById('userId').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    // Validate user ID is generated
    if (!userId) {
      showToast('Please generate a User ID', 'error');
      return;
    }
    
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    hideError('errorMessage');
    showLoading(submitButton);
    
    // Collect form data
    const formData = {
      registrationCode,
      userId,
      password,
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      department: document.getElementById('department').value,
      userType
    };
    
    // Add role-specific fields
    if (userType === 'student') {
      formData.program = document.getElementById('program').value;
      formData.enrollmentYear = parseInt(document.getElementById('enrollmentYear').value);
    } else if (userType === 'faculty') {
      formData.designation = document.getElementById('designation').value;
      formData.qualification = document.getElementById('qualification').value;
    } else if (userType === 'management') {
      formData.role = document.getElementById('role').value;
    }
    
    try {
      const response = await apiCall(API_ENDPOINTS.register, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (response.success) {
        // Clear session storage
        sessionStorage.removeItem('registrationCode');
        sessionStorage.removeItem('userType');
        
        // Show success message
        showToast('Account created successfully!', 'success');
        
        // Redirect to login after delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }
    } catch (error) {
      const errorMessage = document.getElementById('errorMessage');
      const errorText = document.getElementById('errorText');
      errorText.textContent = error.message || 'Registration failed. Please try again.';
      errorMessage.style.display = 'flex';
      
      hideLoading(submitButton);
    }
  });
});
