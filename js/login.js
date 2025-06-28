// DOM elements
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const passwordToggles = document.querySelectorAll('.password-toggle');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');
const strengthFill = document.querySelector('.strength-fill');
const strengthText = document.querySelector('.strength-text');

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update active form
        authForms.forEach(form => form.classList.remove('active'));
        document.getElementById(targetTab + 'Form').classList.add('active');
    });
});

// Password visibility toggle
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) {
        feedback = 'Weak';
        strengthFill.className = 'strength-fill weak';
    } else if (strength < 5) {
        feedback = 'Medium';
        strengthFill.className = 'strength-fill medium';
    } else {
        feedback = 'Strong';
        strengthFill.className = 'strength-fill strong';
    }
    
    strengthText.textContent = feedback;
}

// Password strength monitoring
if (registerPassword) {
    registerPassword.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
}

// Form validation
function validateForm(formData) {
    const errors = [];
    // Username or email validation
    const userOrEmail = formData.get('userOrEmail');
    if (!userOrEmail || userOrEmail.trim().length < 3) {
        errors.push('Please enter a valid username or email');
    }
    // Password validation
    const password = formData.get('password');
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    return errors;
}

function validateRegisterForm(formData) {
    const errors = validateForm(formData);
    
    // Additional register validations
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const username = formData.get('username');
    const confirmPassword = formData.get('confirmPassword');
    const password = formData.get('password');
    const userType = formData.get('userType');
    const terms = formData.get('terms');
    
    if (!firstName || firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
    }
    
    if (!lastName || lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }
    
    if (!username || username.trim().length < 3) {
        errors.push('Username must be at least 3 characters long');
    }
    
    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    if (!userType) {
        errors.push('Please select your role');
    }
    
    if (!terms) {
        errors.push('You must agree to the terms and conditions');
    }
    
    return errors;
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Simulate authentication
function simulateAuth(userOrEmail, password, isLogin = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate server response
            // Accept login by username or email
            const users = [
                { email: 'admin@mathstudy.com', username: 'admin', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin' },
                { email: 'luka@mathstudy.com', username: 'luka_teacher', password: 'password123', firstName: 'Luka', lastName: 'Mshvildadze', role: 'teacher' },
                { email: 'maria@example.com', username: 'maria_student', password: 'password123', firstName: 'Maria', lastName: 'Garcia', role: 'student' },
                { email: 'alex@example.com', username: 'alex_math', password: 'password123', firstName: 'Alex', lastName: 'Johnson', role: 'student' },
                { email: 'sarah@example.com', username: 'sarah_learner', password: 'password123', firstName: 'Sarah', lastName: 'Wilson', role: 'student' },
                { email: 'qababi@example.com', username: 'Qababi', password: 'Qababi123', firstName: 'Qababi', lastName: 'Qababi', role: 'student' },
                { email: 'gabro@example.com', username: 'Gabro', password: 'Gabro123', firstName: 'Gabro', lastName: 'Gabro', role: 'student' }
            ];
            if (isLogin) {
                const user = users.find(u => (u.email === userOrEmail || u.username === userOrEmail) && u.password === password);
                if (user) {
                    resolve({ success: true, user });
                } else {
                    reject(new Error('Invalid username/email or password.'));
                }
            } else {
                // Register simulation (no change)
                resolve({
                    success: true,
                    user: {
                        firstName: 'New',
                        lastName: 'User',
                        email: userOrEmail,
                        role: 'student'
                    }
                });
            }
        }, 1000);
    });
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return;
        }
        const submitBtn = this.querySelector('.auth-btn');
        const originalText = submitBtn.innerHTML;
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        try {
            const result = await simulateAuth(
                formData.get('userOrEmail'),
                formData.get('password'),
                true
            );
            if (result.success) {
                // Store user data
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(result.user));
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', result.user.email);
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Register form submission
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const errors = validateRegisterForm(formData);
        
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return;
        }
        
        const submitBtn = this.querySelector('.auth-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        try {
            const result = await simulateAuth(
                formData.get('email'),
                formData.get('password'),
                false
            );
            
            if (result.success) {
                // Store user data
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify({
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    role: formData.get('userType')
                }));
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', formData.get('email'));
                
                showNotification('Account created successfully! Redirecting...', 'success');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Social login buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Social login feature coming soon!', 'warning');
    });
});

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    showNotification('Password reset feature coming soon!', 'warning');
});

// Terms links
document.querySelectorAll('.terms-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Terms and Privacy Policy coming soon!', 'warning');
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    // Show available login credentials
    showNotification('Available accounts: admin@mathstudy.com (admin123), luka@mathstudy.com, maria@example.com, alex@example.com, sarah@example.com (password: password123)', 'info');
}); 