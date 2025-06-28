// Videos page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Video cards click functionality
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoTitle = this.querySelector('h4').textContent;
            showNotification(`Video player for "${videoTitle}" coming soon!`, 'info');
        });
    });
    
    // Category buttons functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryName = this.closest('.category-card').querySelector('h4').textContent;
            showNotification(`${categoryName} course page coming soon!`, 'info');
        });
    });
    
    // Recent video items click functionality
    const recentVideoItems = document.querySelectorAll('.recent-video-item');
    
    recentVideoItems.forEach(item => {
        item.addEventListener('click', function() {
            const videoTitle = this.querySelector('h5').textContent;
            showNotification(`Video player for "${videoTitle}" coming soon!`, 'info');
        });
    });
    
    // Add hover effects and animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.video-card, .category-card, .recent-video-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add click effects to cards
    const cards = document.querySelectorAll('.video-card, .category-card, .recent-video-item');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(102, 126, 234, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Video thumbnail hover effects
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        thumbnail.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add CSS animation for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .video-thumbnail {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Simulate video loading
    setTimeout(() => {
        showNotification('Video lessons are ready! Click on any video to start learning.', 'success');
    }, 2000);
    
    // Admin upload section logic
    setupAdminAddVideoButton();
    renderUploadedVideos();
});

// Notification system
function showNotification(message, type = 'info') {
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
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
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

function setupAdminAddVideoButton() {
    const addBtn = document.getElementById('addVideoBtn');
    const modal = document.getElementById('videoUploadModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    let isAdmin = false;
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.username === 'admin' || user.username === 'luka') {
                isAdmin = true;
            }
        } catch {}
    }
    if (isAdmin && addBtn) {
        addBtn.style.display = '';
    }
    if (addBtn && modal) {
        addBtn.onclick = () => {
            modal.classList.add('show');
            modal.style.display = 'flex';
        };
    }
    if (closeModalBtn && modal) {
        closeModalBtn.onclick = () => {
            modal.classList.remove('show');
            modal.style.display = 'none';
        };
    }
    // Close modal on outside click
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        };
    }
    // Form submission
    const form = document.getElementById('videoUploadForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const title = document.getElementById('videoTitle').value.trim();
            const link = document.getElementById('youtubeLink').value.trim();
            if (!title || !link || !isYouTubeLink(link)) {
                showNotification('Please enter a valid title and YouTube link.', 'error');
                return;
            }
            const videos = getUploadedVideos();
            videos.unshift({ title, link, uploadedAt: new Date().toISOString() });
            setUploadedVideos(videos);
            renderUploadedVideos();
            form.reset();
            modal.classList.remove('show');
            modal.style.display = 'none';
            showNotification('Video uploaded successfully!', 'success');
        };
    }
}

function isYouTubeLink(url) {
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}

function getUploadedVideos() {
    const data = localStorage.getItem('uploadedVideos');
    return data ? JSON.parse(data) : [];
}

function setUploadedVideos(videos) {
    localStorage.setItem('uploadedVideos', JSON.stringify(videos));
}

function renderUploadedVideos() {
    const container = document.getElementById('uploadedVideos');
    if (!container) return;
    const videos = getUploadedVideos();
    let isAdmin = false;
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.username === 'admin' || user.username === 'luka') {
                isAdmin = true;
            }
        } catch {}
    }
    if (videos.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = '<h4>Uploaded Videos</h4>' + videos.map((video, idx) => `
        <div class="uploaded-video-item" style="margin-bottom: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 10px; box-shadow: 0 2px 8px rgba(102,126,234,0.06); position:relative;">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="flex-shrink:0; width: 120px; height: 68px; background: #222; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <iframe width="120" height="68" src="${getEmbedUrl(video.link)}" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe>
                </div>
                <div style="flex:1;">
                    <h5 style="margin:0 0 0.3rem 0;">${video.title}</h5>
                    <a href="${video.link}" target="_blank" style="color:#667eea; text-decoration:underline; font-size:0.95rem;">Watch on YouTube</a>
                    <div style="font-size:0.85rem; color:#888; margin-top:0.2rem;">Uploaded: ${new Date(video.uploadedAt).toLocaleString()}</div>
                </div>
                ${isAdmin ? `<button class="delete-video-btn" title="Delete Video" style="background:#f56565;color:white;border:none;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:1rem;transition:background 0.2s;">Delete</button>` : ''}
            </div>
        </div>
    `).join('');
    // Add example video card if a new video was just uploaded
    if (videos.length === 1) {
        container.innerHTML += `
        <div class="uploaded-video-item" style="margin-bottom: 1.5rem; padding: 1rem; background: #e6f7ff; border-radius: 10px; box-shadow: 0 2px 8px rgba(102,126,234,0.06);">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="flex-shrink:0; width: 120px; height: 68px; background: #222; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <iframe width="120" height="68" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen style="border-radius:8px;"></iframe>
                </div>
                <div style="flex:1;">
                    <h5 style="margin:0 0 0.3rem 0;">Example: Math Video</h5>
                    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" style="color:#667eea; text-decoration:underline; font-size:0.95rem;">Watch on YouTube</a>
                    <div style="font-size:0.85rem; color:#888; margin-top:0.2rem;">Uploaded: Example</div>
                </div>
            </div>
        </div>
        `;
    }
    // Add delete functionality
    if (isAdmin) {
        const deleteBtns = container.querySelectorAll('.delete-video-btn');
        deleteBtns.forEach((btn, idx) => {
            btn.onclick = function(e) {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this video?')) {
                    const videos = getUploadedVideos();
                    videos.splice(idx, 1);
                    setUploadedVideos(videos);
                    renderUploadedVideos();
                    showNotification('Video deleted.', 'success');
                }
            };
        });
    }
}

function getEmbedUrl(link) {
    // Convert YouTube link to embed URL
    let videoId = '';
    if (link.includes('youtu.be/')) {
        videoId = link.split('youtu.be/')[1].split(/[?&]/)[0];
    } else if (link.includes('youtube.com/watch?v=')) {
        videoId = link.split('watch?v=')[1].split('&')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
} 