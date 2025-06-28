// DOM elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const chatItems = document.querySelectorAll('.chat-item');
const groupItems = document.querySelectorAll('.group-item');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const chatUserName = document.getElementById('chatUserName');
const currentUserName = document.getElementById('currentUserName');
const requestBadge = document.getElementById('requestBadge');

// Current chat state
let currentChat = 'luka';
let currentUser = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Messenger page loaded');
    
    // Check if user is logged in
    checkUserLogin();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize chat interactions
    initializeChatInteractions();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize request actions
    initializeRequestActions();
    
    // Initialize friend actions
    initializeFriendActions();
    
    // Initialize message sending
    initializeMessageSending();
    
    // Load initial chat
    loadChat(currentChat);
    
    // Render friends
    renderFriendsTab();
    
    // User search functionality
    initializeUserSearch();
    
    // Auto-friend logic for Gabro and Qababi
    autoFriendGabroQababi();
});

// Check user login status
function checkUserLogin() {
    const userData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    
    if (isLoggedIn && userData) {
        currentUser = JSON.parse(userData);
        currentUserName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    } else {
        // Redirect to login if not logged in
        showNotification('Please log in to access messenger', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Initialize tab switching
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(targetTab + 'Tab').classList.add('active');
        });
    });
}

// Initialize chat interactions
function initializeChatInteractions() {
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            const chatId = this.getAttribute('data-chat');
            
            // Update active chat item
            chatItems.forEach(chat => chat.classList.remove('active'));
            this.classList.add('active');
            
            // Load chat
            loadChat(chatId);
        });
    });
    
    groupItems.forEach(item => {
        item.addEventListener('click', function() {
            const groupId = this.getAttribute('data-group');
            
            // Update active group item
            groupItems.forEach(group => group.classList.remove('active'));
            this.classList.add('active');
            
            // Load group chat
            loadGroupChat(groupId);
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const chatSearch = document.getElementById('chatSearch');
    const groupSearch = document.getElementById('groupSearch');
    const friendSearch = document.getElementById('friendSearch');
    
    if (chatSearch) {
        chatSearch.addEventListener('input', function() {
            filterChats(this.value);
        });
    }
    
    if (groupSearch) {
        groupSearch.addEventListener('input', function() {
            filterGroups(this.value);
        });
    }
    
    if (friendSearch) {
        friendSearch.addEventListener('input', function() {
            filterFriends(this.value);
        });
    }
}

// Initialize request actions
function initializeRequestActions() {
    const acceptBtns = document.querySelectorAll('.request-btn.accept');
    const declineBtns = document.querySelectorAll('.request-btn.decline');
    
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const userName = requestItem.querySelector('h4').textContent;
            const username = requestItem.getAttribute('data-username') || userName.toLowerCase().replace(/\s+/g, '_');
            addFriend({ name: userName, username });
            requestItem.remove();
            updateRequestBadge();
            showNotification(`Accepted ${userName}'s request`, 'success');
            // Update friends tab immediately
            renderFriendsTab();
        });
    });
    
    declineBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const userName = requestItem.querySelector('h4').textContent;
            requestItem.remove();
            updateRequestBadge();
            showNotification(`Declined ${userName}'s request`, 'info');
        });
    });
}

// Initialize friend actions
function initializeFriendActions() {
    const friendBtns = document.querySelectorAll('.friend-btn');
    
    friendBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('title').toLowerCase();
            const friendItem = this.closest('.friend-item');
            const friendName = friendItem.querySelector('h4').textContent;
            
            if (action === 'message') {
                // Start chat with friend
                showNotification(`Starting chat with ${friendName}`, 'info');
            } else if (action === 'call') {
                // Initiate call
                showNotification(`Calling ${friendName}...`, 'info');
            }
        });
    });
}

// Initialize message sending
function initializeMessageSending() {
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        messageInput.addEventListener('input', function() {
            // Enable/disable send button based on input
            sendBtn.disabled = this.value.trim().length === 0;
        });
    }
}

// Load chat
function loadChat(username) {
    // Try to load as friend chat first
    const friends = getFriends();
    const friend = friends.find(f => f.username === username);
    if (friend) {
        chatUserName.textContent = friend.name;
        renderChatMessages(username);
        return;
    }
    // If not a friend, try to load as regular chat (e.g., Luka)
    const chatItem = document.querySelector(`[data-chat="${username}"]`);
    if (chatItem) {
        const chatName = chatItem.querySelector('h4').textContent;
        chatUserName.textContent = chatName;
        renderChatMessages(username);
    }
}

// Load group chat
function loadGroupChat(groupId) {
    const groupItem = document.querySelector(`[data-group="${groupId}"]`);
    if (groupItem) {
        const groupName = groupItem.querySelector('h4').textContent;
        chatUserName.textContent = groupName;
        
        // Load group messages
        loadGroupMessages(groupId);
    }
}

// Load chat messages
function loadChatMessages(chatId) {
    // In a real app, this would fetch messages from server
    // For now, we'll just scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Load group messages
function loadGroupMessages(groupId) {
    // In a real app, this would fetch group messages from server
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChat) return;
    const messages = getMessages();
    if (!messages[currentChat]) messages[currentChat] = [];
    messages[currentChat].push({ sender: currentUser.username, text });
    setMessages(messages);
    messageInput.value = '';
    renderChatMessages(currentChat);
}

// Create message element
function createMessageElement(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (type === 'received') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
    }
    
    return messageDiv;
}

// Filter chats
function filterChats(searchTerm) {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const chatName = item.querySelector('h4').textContent.toLowerCase();
        const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
        
        if (chatName.includes(searchTerm.toLowerCase()) || lastMessage.includes(searchTerm.toLowerCase())) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter groups
function filterGroups(searchTerm) {
    const groupItems = document.querySelectorAll('.group-item');
    
    groupItems.forEach(item => {
        const groupName = item.querySelector('h4').textContent.toLowerCase();
        
        if (groupName.includes(searchTerm.toLowerCase())) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter friends
function filterFriends(searchTerm) {
    renderFriends(searchTerm);
}

// Update request badge
function updateRequestBadge() {
    const requestItems = document.querySelectorAll('.request-item');
    const count = requestItems.length;
    
    if (requestBadge) {
        if (count > 0) {
            requestBadge.textContent = count;
            requestBadge.style.display = 'inline';
        } else {
            requestBadge.style.display = 'none';
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// --- Friend and Message Data Management ---
function getFriends() {
    const data = localStorage.getItem('messengerFriends');
    return data ? JSON.parse(data) : [];
}
function setFriends(friends) {
    localStorage.setItem('messengerFriends', JSON.stringify(friends));
}
function getMessages() {
    const data = localStorage.getItem('messengerMessages');
    return data ? JSON.parse(data) : {};
}
function setMessages(messages) {
    localStorage.setItem('messengerMessages', JSON.stringify(messages));
}

// --- Add Friend (from request) ---
function addFriend(friend) {
    const friends = getFriends();
    if (!friends.find(f => f.username === friend.username)) {
        friends.push(friend);
        setFriends(friends);
    }
    renderFriends();
}

// --- Render Friends Tab ---
function renderFriendsTab(filter = '') {
    const friends = getFriends();
    const friendsTab = document.getElementById('friendsTab');
    if (!friendsTab) return;
    let html = `
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="friendSearchInput" placeholder="Search friends...">
        </div>
        <div class="friend-list"></div>
    `;
    friendsTab.innerHTML = html;
    // Render friend items
    renderFriends(filter);
    // Add search event
    const friendSearchInput = document.getElementById('friendSearchInput');
    if (friendSearchInput) {
        friendSearchInput.addEventListener('input', function() {
            renderFriends(this.value);
        });
    }
}

// --- Update renderFriends to work for both sidebar and friends tab ---
function renderFriends(filter = '') {
    const friends = getFriends();
    // Try to find the friend-list in the friends tab first, then sidebar
    let friendList = document.querySelector('#friendsTab .friend-list') || document.querySelector('.friend-list');
    if (!friendList) return;
    friendList.innerHTML = '';
    friends.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.username.toLowerCase().includes(filter.toLowerCase()))
        .forEach(friend => {
        const item = document.createElement('div');
        item.className = 'friend-item';
        item.innerHTML = `
            <div class="friend-avatar">${friend.avatar || '<i class=\'fas fa-user\'></i>'}</div>
            <div class="friend-info">
                <h4>${friend.name}</h4>
                <p>@${friend.username}</p>
            </div>
            <div class="friend-actions">
                <button class="friend-btn" title="Message"><i class="fas fa-comment"></i></button>
            </div>
        `;
        item.onclick = () => selectFriendChat(friend.username);
        friendList.appendChild(item);
    });
}

// --- Select Friend to Chat ---
function selectFriendChat(username) {
    currentChat = username;
    loadChat(username);
}

// --- Chatting Functionality ---
function renderChatMessages(username) {
    const messages = getMessages();
    const chat = messages[username] || [];
    chatMessages.innerHTML = '';
    chat.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + (msg.sender === currentUser.username ? 'sent' : 'received');
        msgDiv.innerHTML = `<div class="message-content"><span class="message-text">${msg.text}</span></div>`;
        chatMessages.appendChild(msgDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- User Search Functionality ---
function initializeUserSearch() {
    const userSearchInput = document.getElementById('userSearchInput');
    if (!userSearchInput) return;
    userSearchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        renderUserSearchResults(query);
    });
}

// Simulated user database (replace with backend in real app)
const allUsers = [
    { name: 'Luka Mshvildadze', username: 'luka', avatar: '<i class="fas fa-user-graduate"></i>' },
    { name: 'Maria Garcia', username: 'maria', avatar: '<i class="fas fa-user"></i>' },
    { name: 'Alex Johnson', username: 'alex', avatar: '<i class="fas fa-user"></i>' },
    { name: 'Sarah Lee', username: 'sarah', avatar: '<i class="fas fa-user"></i>' },
    { name: 'Admin User', username: 'admin', avatar: '<i class="fas fa-user-shield"></i>' },
    { name: 'Qababi Qababi', username: 'Qababi', avatar: '<i class="fas fa-user"></i>' },
    { name: 'Gabro Gabro', username: 'Gabro', avatar: '<i class="fas fa-user"></i>' }
];

function renderUserSearchResults(query) {
    const resultsContainer = document.getElementById('userSearchResults');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';
    if (!query) return;
    const friends = getFriends();
    const friendUsernames = friends.map(f => f.username);
    const currentUserData = localStorage.getItem('userData');
    let currentUsername = '';
    if (currentUserData) {
        try {
            currentUsername = JSON.parse(currentUserData).username;
        } catch {}
    }
    const filtered = allUsers.filter(user =>
        (user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)) &&
        !friendUsernames.includes(user.username) &&
        user.username !== currentUsername
    );
    filtered.forEach(user => {
        const item = document.createElement('div');
        item.className = 'user-search-result-item';
        item.innerHTML = `
            <div class="user-search-result-avatar">${user.avatar}</div>
            <div class="user-search-result-info">
                <h4>${user.name}</h4>
                <p>@${user.username}</p>
            </div>
            <button class="add-friend-btn" title="Add Friend"><i class="fas fa-user-plus"></i></button>
        `;
        item.querySelector('.add-friend-btn').onclick = function(e) {
            e.stopPropagation();
            addFriend(user);
            showNotification(`Added ${user.name} as a friend!`, 'success');
            renderUserSearchResults(query); // Refresh results
        };
        resultsContainer.appendChild(item);
    });
}

// Auto-friend logic for Gabro and Qababi
function autoFriendGabroQababi() {
    const userData = localStorage.getItem('userData');
    if (!userData) return;
    let user;
    try { user = JSON.parse(userData); } catch { return; }
    if (user.username === 'Gabro') {
        // Add Qababi as friend if not already
        const friends = getFriends();
        if (!friends.find(f => f.username === 'Qababi')) {
            friends.push({ name: 'Qababi Qababi', username: 'Qababi', avatar: '<i class="fas fa-user"></i>' });
            setFriends(friends);
        }
    } else if (user.username === 'Qababi') {
        // Add Gabro as friend if not already
        const friends = getFriends();
        if (!friends.find(f => f.username === 'Gabro')) {
            friends.push({ name: 'Gabro Gabro', username: 'Gabro', avatar: '<i class="fas fa-user"></i>' });
            setFriends(friends);
        }
    }
}

// Initialize request badge count
updateRequestBadge(); 