// DOM elements
const modal = document.getElementById('zoomModal');
const zoomButton = document.getElementById('zoomButton');
const closeBtn = document.querySelector('.close');
const userSection = document.getElementById('userSection');

// Test alert to verify JavaScript is running
console.log('Script.js loaded successfully');

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    checkLoginStatus();
    
    // Simple test for action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    console.log('Found action buttons:', actionButtons.length);
    
    actionButtons.forEach(button => {
        console.log('Button:', button.textContent.trim(), 'Href:', button.href);
        // Remove any event listeners that might interfere
        button.addEventListener('click', function(e) {
            console.log('Action button clicked:', this.href);
            // Let the link work naturally
        });
    });
    
    // Simple test for login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        console.log('Login button found:', loginBtn.href);
        loginBtn.addEventListener('click', function(e) {
            console.log('Login button clicked');
            // Let the link work naturally
        });
    }
    
    // Zoom button functionality
    if (zoomButton) {
        zoomButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Zoom button clicked');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
});

// Check login status and update UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');
    
    if (isLoggedIn && userData) {
        const user = JSON.parse(userData);
        showLoggedInUser(user);
    } else {
        showLoginButton();
    }
}

// Show logged in user
function showLoggedInUser(user) {
    userSection.innerHTML = `
        <div class="user-info">
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <span class="user-name">${user.firstName} ${user.lastName}</span>
            <button class="logout-btn" onclick="logout()" title="Logout">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    `;
}

// Show login button
function showLoginButton() {
    userSection.innerHTML = `
        <a href="pages/login.html" class="login-btn" id="loginBtn">
            <i class="fas fa-sign-in-alt"></i>
            <span>Login</span>
        </a>
    `;
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    
    showNotification('Logged out successfully!', 'success');
    showLoginButton();
}

// Modal functionality
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Copy meeting information function
function copyMeetingInfo() {
    const meetingId = document.getElementById('meetingId').textContent;
    const meetingPassword = document.getElementById('meetingPassword').textContent;
    const meetingTime = document.getElementById('meetingTime').textContent;
    
    const meetingInfo = `Meeting ID: ${meetingId}\nPassword: ${meetingPassword}\nTime: ${meetingTime}`;
    
    // Use modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(meetingInfo).then(function() {
            showNotification('Meeting information copied to clipboard!', 'success');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(meetingInfo);
        });
    } else {
        fallbackCopyTextToClipboard(meetingInfo);
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Meeting information copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy meeting information', 'error');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showNotification('Failed to copy meeting information', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style); 