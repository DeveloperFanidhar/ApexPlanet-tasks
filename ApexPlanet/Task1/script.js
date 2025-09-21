// Form state
let formData = {
    events: [],
    participationType: 'individual'
};

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateSelectedEvents();
});

function initializeEventListeners() {
    const form = document.getElementById('registrationForm');
    const participationRadios = document.querySelectorAll('input[name="participationType"]');
    const eventCheckboxes = document.querySelectorAll('input[name="events"]');

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Participation type change
    participationRadios.forEach(radio => {
        radio.addEventListener('change', handleParticipationChange);
    });

    // Event selection
    eventCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleEventChange);
    });

    // Clear errors on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => clearError(input.name || input.id));
    });
}

function handleParticipationChange(e) {
    const teamFields = document.getElementById('teamFields');
    formData.participationType = e.target.value;
    
    if (e.target.value === 'team') {
        teamFields.classList.add('show');
    } else {
        teamFields.classList.remove('show');
        // Clear team fields
        document.getElementById('teamName').value = '';
        document.getElementById('teamSize').value = '';
        clearError('teamName');
    }
}

function handleEventChange(e) {
    const eventName = e.target.value;
    
    if (e.target.checked) {
        if (!formData.events.includes(eventName)) {
            formData.events.push(eventName);
        }
    } else {
        formData.events = formData.events.filter(event => event !== eventName);
    }
    
    updateSelectedEvents();
    clearError('events');
}

function updateSelectedEvents() {
    const selectedEventsDiv = document.getElementById('selectedEvents');
    const eventCount = document.getElementById('eventCount');
    const eventBadges = document.getElementById('eventBadges');
    
    eventCount.textContent = formData.events.length;
    
    if (formData.events.length > 0) {
        selectedEventsDiv.classList.add('show');
        
        eventBadges.innerHTML = formData.events.map(event => `
            <div class="event-badge">
                ${event}
                <button type="button" class="remove-event" onclick="removeEvent('${event}')">×</button>
            </div>
        `).join('');
    } else {
        selectedEventsDiv.classList.remove('show');
    }
}

function removeEvent(eventName) {
    // Uncheck the checkbox
    const checkbox = document.querySelector(`input[name="events"][value="${eventName}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // Update form data
    formData.events = formData.events.filter(event => event !== eventName);
    updateSelectedEvents();
}

function validateForm() {
    let isValid = true;
    const form = document.getElementById('registrationForm');
    const formDataObj = new FormData(form);

    // Clear all errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    // Required fields validation
    const requiredFields = [
        { name: 'firstName', message: 'First name is required' },
        { name: 'lastName', message: 'Last name is required' },
        { name: 'email', message: 'Email is required' },
        { name: 'phone', message: 'Phone number is required' },
        { name: 'college', message: 'College name is required' },
        { name: 'yearOfStudy', message: 'Year of study is required' },
        { name: 'emergencyContact', message: 'Emergency contact is required' },
        { name: 'emergencyPhone', message: 'Emergency phone is required' }
    ];

    requiredFields.forEach(field => {
        const value = formDataObj.get(field.name);
        if (!value || !value.trim()) {
            showError(field.name, field.message);
            isValid = false;
        }
    });

    // Email validation
    const email = formDataObj.get('email');
    if (email && !/^\S+@\S+$/.test(email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }

    // Phone validation
    const phone = formDataObj.get('phone');
    if (phone && !/^[0-9]{10}$/.test(phone)) {
        showError('phone', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }

    const emergencyPhone = formDataObj.get('emergencyPhone');
    if (emergencyPhone && !/^[0-9]{10}$/.test(emergencyPhone)) {
        showError('emergencyPhone', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }

    // Team validation
    if (formData.participationType === 'team') {
        const teamName = formDataObj.get('teamName');
        if (!teamName || !teamName.trim()) {
            showError('teamName', 'Team name is required');
            isValid = false;
        }
    }

    // Events validation
    if (formData.events.length === 0) {
        showError('events', 'Please select at least one event');
        isValid = false;
    }

    // Terms validation
    const terms = formDataObj.get('terms');
    if (!terms) {
        showError('terms', 'Please accept the terms and conditions');
        isValid = false;
    }

    return isValid;
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function handleSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const form = document.getElementById('registrationForm');
        const formDataObj = new FormData(form);
        
        // Build final form data
        const finalData = {
            firstName: formDataObj.get('firstName'),
            lastName: formDataObj.get('lastName'),
            email: formDataObj.get('email'),
            phone: formDataObj.get('phone'),
            college: formDataObj.get('college'),
            yearOfStudy: formDataObj.get('yearOfStudy'),
            participationType: formData.participationType,
            teamName: formDataObj.get('teamName') || '',
            teamSize: formDataObj.get('teamSize') || null,
            events: formData.events,
            emergencyContact: formDataObj.get('emergencyContact'),
            emergencyPhone: formDataObj.get('emergencyPhone'),
            dietaryRestrictions: formDataObj.get('dietaryRestrictions') || '',
            referralSource: formDataObj.get('referralSource') || '',
            previousParticipation: !!formDataObj.get('previousParticipation')
        };

        console.log('Registration Data:', finalData);
        alert('Registration submitted successfully! Check console for data.');
    }
}