// Authentication helper functions

// Save auth token
function saveToken(token) {
  localStorage.setItem('token', token);
}

// Get auth token
function getToken() {
  return localStorage.getItem('token');
}

// Remove auth token
function removeToken() {
  localStorage.removeItem('token');
}

// Save user data
function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Get user data
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Remove user data
function removeUser() {
  localStorage.removeItem('user');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Logout
function logout() {
  removeToken();
  removeUser();
  window.location.href = 'index.html';
}

// Get authorization headers
function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

// Check auth and redirect if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Redirect based on user type
function redirectToDashboard(userType) {
  switch(userType) {
    case 'student':
      window.location.href = 'student-dashboard.html';
      break;
    case 'faculty':
      window.location.href = 'faculty-dashboard.html';
      break;
    case 'management':
      window.location.href = 'management-dashboard.html';
      break;
    default:
      window.location.href = 'index.html';
  }
}
