// Student Dashboard functionality

document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!requireAuth()) return;
  
  const user = getUser();
  
  // Verify user type
  if (user.userType !== 'student') {
    redirectToDashboard(user.userType);
    return;
  }
  
  // Initialize dashboard
  initializeDashboard();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load data
  loadDashboardData();
});

function initializeDashboard() {
  const user = getUser();
  
  // Update user info in header
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userId').textContent = user.userId;
  document.getElementById('welcomeText').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
}

function setupEventListeners() {
  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  });
  
  // Tab switching
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const tabName = trigger.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Remove active class from all triggers and contents
  document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  // Add active class to selected trigger and content
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

async function loadDashboardData() {
  try {
    // Load student profile
    const profileResponse = await apiCall(API_ENDPOINTS.studentProfile);
    
    if (profileResponse.success) {
      updateStats(profileResponse.data);
    }
    
    // Load courses
    const coursesResponse = await apiCall(API_ENDPOINTS.studentCourses);
    if (coursesResponse.success) {
      renderCourses(coursesResponse.data);
    }
    
    // Load grades
    const gradesResponse = await apiCall(API_ENDPOINTS.studentGrades);
    if (gradesResponse.success) {
      renderGrades(gradesResponse.data);
    }
    
    // Load notifications
    const notificationsResponse = await apiCall(API_ENDPOINTS.studentNotifications);
    if (notificationsResponse.success) {
      renderNotifications(notificationsResponse.data);
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Error loading dashboard data. Using demo data.', 'error');
    
    // Load demo data as fallback
    loadDemoData();
  }
}

function loadDemoData() {
  // Demo stats
  document.getElementById('cgpa').textContent = '3.65';
  document.getElementById('totalCredits').textContent = '120';
  document.getElementById('activeCourses').textContent = '4';
  document.getElementById('attendance').textContent = '86%';
  
  // Demo courses
  const demoCourses = [
    { courseName: 'Computer Networks', courseCode: 'CS301', credits: 4, attendance: 85 },
    { courseName: 'Database Systems', courseCode: 'CS302', credits: 4, attendance: 92 },
    { courseName: 'Software Engineering', courseCode: 'CS303', credits: 3, attendance: 88 },
    { courseName: 'Operating Systems', courseCode: 'CS304', credits: 4, attendance: 78 }
  ];
  renderCourses(demoCourses);
  
  // Demo grades
  const demoGrades = [
    { course: 'Data Structures', code: 'CS201', grade: 'A', credits: 4, semester: 'Fall 2024' },
    { course: 'Algorithms', code: 'CS202', grade: 'A-', credits: 4, semester: 'Fall 2024' },
    { course: 'Web Development', code: 'CS203', grade: 'B+', credits: 3, semester: 'Fall 2024' }
  ];
  renderGrades(demoGrades);
  
  // Demo notifications
  const demoNotifications = [
    { title: 'Mid-term Examination Schedule Released', date: '2 hours ago', type: 'important' },
    { title: 'New Assignment: Database Systems Project', date: '1 day ago', type: 'academic' },
    { title: 'Campus Holiday - Republic Day', date: '3 days ago', type: 'announcement' },
    { title: 'Library Books Due Date Reminder', date: '5 days ago', type: 'reminder' }
  ];
  renderNotifications(demoNotifications);
}

function updateStats(data) {
  document.getElementById('cgpa').textContent = data.cgpa?.toFixed(2) || '0.00';
  document.getElementById('totalCredits').textContent = data.totalCredits || '0';
  document.getElementById('activeCourses').textContent = data.courses?.length || '0';
  
  // Calculate average attendance
  if (data.courses && data.courses.length > 0) {
    const avgAttendance = data.courses.reduce((sum, course) => sum + (course.attendance || 0), 0) / data.courses.length;
    document.getElementById('attendance').textContent = Math.round(avgAttendance) + '%';
  }
}

function renderCourses(courses) {
  const container = document.getElementById('currentCourses');
  
  if (!courses || courses.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--gray-500);">No courses found</p>';
    return;
  }
  
  container.innerHTML = courses.map(course => `
    <div class="list-item">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="flex: 1;">
          <div class="list-item-title">${course.courseName}</div>
          <div class="list-item-subtitle">${course.courseCode} • ${course.credits} Credits</div>
        </div>
        <span class="badge ${course.attendance >= 85 ? 'badge-success' : 'badge-danger'}">
          ${course.attendance}%
        </span>
      </div>
    </div>
  `).join('');
  
  // Also render in attendance details
  renderAttendanceDetails(courses);
}

function renderAttendanceDetails(courses) {
  const container = document.getElementById('attendanceDetails');
  
  if (!courses || courses.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--gray-500);">No data available</p>';
    return;
  }
  
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${courses.map(course => `
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-size: 0.875rem; color: var(--gray-700);">${course.courseCode}</span>
            <span style="font-size: 0.875rem; color: var(--gray-900);">${course.attendance}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar ${course.attendance >= 85 ? 'progress-bar-success' : 'progress-bar-danger'}" 
                 style="width: ${course.attendance}%;"></div>
          </div>
        </div>
      `).join('')}
      <div class="alert alert-info" style="margin-top: 1rem;">
        <svg class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span style="font-size: 0.875rem;">Minimum 75% attendance required to appear in exams</span>
      </div>
    </div>
  `;
}

function renderGrades(grades) {
  const container = document.getElementById('gradesList');
  
  if (!grades || grades.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--gray-500);">No grades available</p>';
    return;
  }
  
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${grades.map(grade => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid var(--gray-200); border-radius: var(--border-radius);">
          <div>
            <div style="font-weight: 500; color: var(--gray-900);">${grade.course}</div>
            <div style="font-size: 0.875rem; color: var(--gray-500);">${grade.code}</div>
          </div>
          <span class="badge badge-success">${grade.grade}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderNotifications(notifications) {
  const recentContainer = document.getElementById('recentNotifications');
  const allContainer = document.getElementById('allNotifications');
  
  if (!notifications || notifications.length === 0) {
    const emptyMessage = '<p style="text-align: center; color: var(--gray-500);">No notifications</p>';
    recentContainer.innerHTML = emptyMessage;
    allContainer.innerHTML = emptyMessage;
    return;
  }
  
  // Recent notifications (first 4)
  const recentHtml = notifications.slice(0, 4).map(notif => `
    <div class="list-item">
      <div style="display: flex; gap: 0.75rem;">
        <svg style="width: 1.25rem; height: 1.25rem; color: var(--primary-color); flex-shrink: 0; margin-top: 0.125rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 0.875rem; color: var(--gray-900);">${notif.title}</div>
          <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.25rem;">${notif.date}</div>
        </div>
      </div>
    </div>
  `).join('');
  recentContainer.innerHTML = recentHtml;
  
  // All notifications
  const allHtml = notifications.map(notif => `
    <div style="display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--gray-200); border-radius: var(--border-radius); margin-bottom: 0.75rem;">
      <div style="flex-shrink: 0;">
        <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background-color: var(--gray-100); display: flex; align-items: center; justify-content: center;">
          <svg style="width: 1.25rem; height: 1.25rem; color: var(--primary-color);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>
      <div style="flex: 1;">
        <div style="color: var(--gray-900); margin-bottom: 0.25rem;">${notif.title}</div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
          <svg style="width: 0.75rem; height: 0.75rem; color: var(--gray-400);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style="font-size: 0.875rem; color: var(--gray-500);">${notif.date}</span>
        </div>
      </div>
    </div>
  `).join('');
  allContainer.innerHTML = allHtml;
}
