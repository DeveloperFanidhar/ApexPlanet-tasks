// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  verifyCode: `${API_BASE_URL}/auth/verify-code`,
  me: `${API_BASE_URL}/auth/me`,
  
  // Student endpoints
  studentProfile: `${API_BASE_URL}/students/profile`,
  studentCourses: `${API_BASE_URL}/students/courses`,
  studentGrades: `${API_BASE_URL}/students/grades`,
  studentNotifications: `${API_BASE_URL}/students/notifications`,
  
  // Faculty endpoints
  facultyProfile: `${API_BASE_URL}/faculty/profile`,
  facultyCourses: `${API_BASE_URL}/faculty/courses`,
  facultySchedule: `${API_BASE_URL}/faculty/schedule`,
  facultyTasks: `${API_BASE_URL}/faculty/tasks`,
  
  // Management endpoints
  managementProfile: `${API_BASE_URL}/management/profile`,
  managementStats: `${API_BASE_URL}/management/stats`,
  managementApprovals: `${API_BASE_URL}/management/approvals`,
  managementActivities: `${API_BASE_URL}/management/activities`
};
