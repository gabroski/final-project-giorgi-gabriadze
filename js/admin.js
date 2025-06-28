// Admin Panel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    checkAdminAuth();
    
    // Initialize admin panel
    initializeAdminPanel();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadDashboardData();
});

// Check admin authentication
function checkAdminAuth() {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    const admin = JSON.parse(adminData);
    document.getElementById('adminName').textContent = `${admin.firstName} ${admin.lastName}`;
}

// Initialize admin panel
function initializeAdminPanel() {
    // Set up navigation
    setupNavigation();
    
    // Load content tables
    loadVideosTable();
    loadPDFsTable();
    loadBooksTable();
    loadCoursesTable();
    loadUsersTable();
    
    // Set up search and filters
    setupSearchAndFilters();
}

// Set up navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab + 'Tab') {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Load dashboard data
function loadDashboardData() {
    const stats = db.getStatistics();
    
    document.getElementById('totalVideos').textContent = stats.totalVideos;
    document.getElementById('totalPDFs').textContent = stats.totalPDFs;
    document.getElementById('totalBooks').textContent = stats.totalBooks;
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    
    // Load recent activity
    loadRecentActivity();
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const activities = [
        {
            icon: 'fas fa-video',
            title: 'New video added',
            description: 'Introduction to Calculus uploaded by Luka Mshvildadze',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-file-pdf',
            title: 'PDF uploaded',
            description: 'Calculus Practice Problems added to library',
            time: '4 hours ago'
        },
        {
            icon: 'fas fa-user-plus',
            title: 'New user registered',
            description: 'Maria Garcia joined the platform',
            time: '6 hours ago'
        },
        {
            icon: 'fas fa-book',
            title: 'Book added',
            description: 'Linear Algebra textbook uploaded',
            time: '1 day ago'
        }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Load videos table
function loadVideosTable() {
    const videos = db.getVideos();
    const tbody = document.getElementById('videosTableBody');
    
    tbody.innerHTML = videos.map(video => `
        <tr>
            <td>
                <img src="${video.thumbnail}" alt="${video.title}" class="table-thumbnail">
            </td>
            <td>
                <div>
                    <strong>${video.title}</strong>
                    <br>
                    <small>${video.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>
                <span class="category-badge">${video.category}</span>
            </td>
            <td>${video.duration}</td>
            <td>${video.views.toLocaleString()}</td>
            <td>${new Date(video.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('video', '${video.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('video', '${video.id}', '${video.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load PDFs table
function loadPDFsTable() {
    const pdfs = db.getPDFs();
    const tbody = document.getElementById('pdfsTableBody');
    
    tbody.innerHTML = pdfs.map(pdf => `
        <tr>
            <td>
                <div>
                    <strong>${pdf.title}</strong>
                    <br>
                    <small>${pdf.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>
                <span class="category-badge">${pdf.category}</span>
            </td>
            <td>${pdf.fileSize}</td>
            <td>${pdf.pages}</td>
            <td>${pdf.downloads.toLocaleString()}</td>
            <td>${new Date(pdf.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('pdf', '${pdf.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('pdf', '${pdf.id}', '${pdf.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load books table
function loadBooksTable() {
    const books = db.getBooks();
    const tbody = document.getElementById('booksTableBody');
    
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>
                <img src="${book.coverUrl}" alt="${book.title}" class="table-thumbnail">
            </td>
            <td>
                <div>
                    <strong>${book.title}</strong>
                    <br>
                    <small>${book.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>${book.author}</td>
            <td>
                <span class="category-badge">${book.category}</span>
            </td>
            <td>${book.pages}</td>
            <td>${book.downloads.toLocaleString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('book', '${book.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('book', '${book.id}', '${book.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load courses table
function loadCoursesTable() {
    const courses = db.getCourses();
    const tbody = document.getElementById('coursesTableBody');
    
    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>
                <img src="${course.imageUrl}" alt="${course.title}" class="table-thumbnail">
            </td>
            <td>
                <div>
                    <strong>${course.title}</strong>
                    <br>
                    <small>${course.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>
                <span class="category-badge">${course.category}</span>
            </td>
            <td>
                <span class="level-badge ${course.level.toLowerCase()}">${course.level}</span>
            </td>
            <td>${course.duration}</td>
            <td>${course.students}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('course', '${course.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('course', '${course.id}', '${course.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load users table
function loadUsersTable() {
    const users = db.getUsers();
    const admins = db.getAdmins();
    const allUsers = [...users, ...admins];
    const tbody = document.getElementById('usersTableBody');
    
    tbody.innerHTML = allUsers.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <strong>${user.firstName} ${user.lastName}</strong>
                        <br>
                        <small>@${user.username || user.email}</small>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge ${user.role}">${user.role}</span>
            </td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editUser('${user.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.role !== 'admin' ? `
                        <button class="delete-btn" onclick="deleteUser('${user.id}', '${user.firstName} ${user.lastName}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Set up search and filters
function setupSearchAndFilters() {
    // Video search and filter
    const videoSearch = document.getElementById('videoSearch');
    const videoCategory = document.getElementById('videoCategory');
    
    if (videoSearch) {
        videoSearch.addEventListener('input', filterVideos);
    }
    if (videoCategory) {
        videoCategory.addEventListener('change', filterVideos);
    }
    
    // PDF search and filter
    const pdfSearch = document.getElementById('pdfSearch');
    const pdfCategory = document.getElementById('pdfCategory');
    
    if (pdfSearch) {
        pdfSearch.addEventListener('input', filterPDFs);
    }
    if (pdfCategory) {
        pdfCategory.addEventListener('change', filterPDFs);
    }
    
    // Book search and filter
    const bookSearch = document.getElementById('bookSearch');
    const bookCategory = document.getElementById('bookCategory');
    
    if (bookSearch) {
        bookSearch.addEventListener('input', filterBooks);
    }
    if (bookCategory) {
        bookCategory.addEventListener('change', filterBooks);
    }
    
    // Course search and filter
    const courseSearch = document.getElementById('courseSearch');
    const courseCategory = document.getElementById('courseCategory');
    
    if (courseSearch) {
        courseSearch.addEventListener('input', filterCourses);
    }
    if (courseCategory) {
        courseCategory.addEventListener('change', filterCourses);
    }
    
    // User search and filter
    const userSearch = document.getElementById('userSearch');
    const userRole = document.getElementById('userRole');
    
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    if (userRole) {
        userRole.addEventListener('change', filterUsers);
    }
}

// Filter functions
function filterVideos() {
    const searchTerm = document.getElementById('videoSearch').value.toLowerCase();
    const category = document.getElementById('videoCategory').value;
    const videos = db.getVideos();
    
    const filtered = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm) ||
                             video.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || video.category === category;
        return matchesSearch && matchesCategory;
    });
    
    updateVideosTable(filtered);
}

function filterPDFs() {
    const searchTerm = document.getElementById('pdfSearch').value.toLowerCase();
    const category = document.getElementById('pdfCategory').value;
    const pdfs = db.getPDFs();
    
    const filtered = pdfs.filter(pdf => {
        const matchesSearch = pdf.title.toLowerCase().includes(searchTerm) ||
                             pdf.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || pdf.category === category;
        return matchesSearch && matchesCategory;
    });
    
    updatePDFsTable(filtered);
}

function filterBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const category = document.getElementById('bookCategory').value;
    const books = db.getBooks();
    
    const filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                             book.description.toLowerCase().includes(searchTerm) ||
                             book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || book.category === category;
        return matchesSearch && matchesCategory;
    });
    
    updateBooksTable(filtered);
}

function filterCourses() {
    const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
    const category = document.getElementById('courseCategory').value;
    const courses = db.getCourses();
    
    const filtered = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                             course.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || course.category === category;
        return matchesSearch && matchesCategory;
    });
    
    updateCoursesTable(filtered);
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const role = document.getElementById('userRole').value;
    const users = db.getUsers();
    const admins = db.getAdmins();
    const allUsers = [...users, ...admins];
    
    const filtered = allUsers.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm) ||
                             user.lastName.toLowerCase().includes(searchTerm) ||
                             user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !role || user.role === role;
        return matchesSearch && matchesRole;
    });
    
    updateUsersTable(filtered);
}

// Update table functions
function updateVideosTable(videos) {
    const tbody = document.getElementById('videosTableBody');
    tbody.innerHTML = videos.map(video => `
        <tr>
            <td>
                <img src="${video.thumbnail}" alt="${video.title}" class="table-thumbnail">
            </td>
            <td>
                <div>
                    <strong>${video.title}</strong>
                    <br>
                    <small>${video.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>
                <span class="category-badge">${video.category}</span>
            </td>
            <td>${video.duration}</td>
            <td>${video.views.toLocaleString()}</td>
            <td>${new Date(video.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('video', '${video.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('video', '${video.id}', '${video.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updatePDFsTable(pdfs) {
    const tbody = document.getElementById('pdfsTableBody');
    tbody.innerHTML = pdfs.map(pdf => `
        <tr>
            <td>
                <div>
                    <strong>${pdf.title}</strong>
                    <br>
                    <small>${pdf.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>
                <span class="category-badge">${pdf.category}</span>
            </td>
            <td>${pdf.fileSize}</td>
            <td>${pdf.pages}</td>
            <td>${pdf.downloads.toLocaleString()}</td>
            <td>${new Date(pdf.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('pdf', '${pdf.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('pdf', '${pdf.id}', '${pdf.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateBooksTable(books) {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>
                <img src="${book.coverUrl}" alt="${book.title}" class="table-thumbnail">
            </td>
            <td>
                <div>
                    <strong>${book.title}</strong>
                    <br>
                    <small>${book.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>${book.author}</td>
            <td>
                <span class="category-badge">${book.category}</span>
            </td>
            <td>${book.pages}</td>
            <td>${book.downloads.toLocaleString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('book', '${book.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('book', '${book.id}', '${book.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateCoursesTable(courses) {
    const tbody = document.getElementById('coursesTableBody');
    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>
                <img src="${course.imageUrl}" alt="${course.title}" class="table-thumbnail">
            </td>
            <td>
                <div>
                    <strong>${course.title}</strong>
                    <br>
                    <small>${course.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>
                <span class="category-badge">${course.category}</span>
            </td>
            <td>
                <span class="level-badge ${course.level.toLowerCase()}">${course.level}</span>
            </td>
            <td>${course.duration}</td>
            <td>${course.students}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editItem('course', '${course.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('course', '${course.id}', '${course.title}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <strong>${user.firstName} ${user.lastName}</strong>
                        <br>
                        <small>@${user.username || user.email}</small>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge ${user.role}">${user.role}</span>
            </td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editUser('${user.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.role !== 'admin' ? `
                        <button class="delete-btn" onclick="deleteUser('${user.id}', '${user.firstName} ${user.lastName}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal functions
let currentItemType = '';
let currentItemId = '';

function showAddModal(type) {
    currentItemType = type;
    currentItemId = '';
    
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    const dynamicFields = document.getElementById('dynamicFields');
    
    modalTitle.textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    // Clear form
    document.getElementById('addForm').reset();
    
    // Add dynamic fields based on type
    dynamicFields.innerHTML = getDynamicFields(type);
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('addModal').style.display = 'none';
}

function getDynamicFields(type) {
    switch(type) {
        case 'video':
            return `
                <div class="form-group">
                    <label for="videoDuration">Duration *</label>
                    <input type="text" id="videoDuration" name="duration" placeholder="e.g., 45:30" required>
                </div>
                <div class="form-group">
                    <label for="videoInstructor">Instructor *</label>
                    <input type="text" id="videoInstructor" name="instructor" value="Luka Mshvildadze" required>
                </div>
                <div class="form-group">
                    <label for="videoThumbnail">Thumbnail URL *</label>
                    <input type="text" id="videoThumbnail" name="thumbnail" placeholder="Enter thumbnail URL" required>
                </div>
            `;
        case 'pdf':
            return `
                <div class="form-group">
                    <label for="pdfFileSize">File Size *</label>
                    <input type="text" id="pdfFileSize" name="fileSize" placeholder="e.g., 2.5 MB" required>
                </div>
                <div class="form-group">
                    <label for="pdfPages">Pages *</label>
                    <input type="number" id="pdfPages" name="pages" placeholder="Number of pages" required>
                </div>
                <div class="form-group">
                    <label for="pdfInstructor">Instructor *</label>
                    <input type="text" id="pdfInstructor" name="instructor" value="Luka Mshvildadze" required>
                </div>
            `;
        case 'book':
            return `
                <div class="form-group">
                    <label for="bookAuthor">Author *</label>
                    <input type="text" id="bookAuthor" name="author" placeholder="Book author" required>
                </div>
                <div class="form-group">
                    <label for="bookISBN">ISBN</label>
                    <input type="text" id="bookISBN" name="isbn" placeholder="ISBN number">
                </div>
                <div class="form-group">
                    <label for="bookPages">Pages *</label>
                    <input type="number" id="bookPages" name="pages" placeholder="Number of pages" required>
                </div>
                <div class="form-group">
                    <label for="bookFileSize">File Size *</label>
                    <input type="text" id="bookFileSize" name="fileSize" placeholder="e.g., 15.2 MB" required>
                </div>
                <div class="form-group">
                    <label for="bookCoverUrl">Cover URL *</label>
                    <input type="text" id="bookCoverUrl" name="coverUrl" placeholder="Enter cover image URL" required>
                </div>
            `;
        case 'course':
            return `
                <div class="form-group">
                    <label for="courseDuration">Duration *</label>
                    <input type="text" id="courseDuration" name="duration" placeholder="e.g., 12 weeks" required>
                </div>
                <div class="form-group">
                    <label for="courseLevel">Level *</label>
                    <select id="courseLevel" name="level" required>
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="courseInstructor">Instructor *</label>
                    <input type="text" id="courseInstructor" name="instructor" value="Luka Mshvildadze" required>
                </div>
                <div class="form-group">
                    <label for="coursePrice">Price</label>
                    <input type="number" id="coursePrice" name="price" value="0" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label for="courseImageUrl">Image URL *</label>
                    <input type="text" id="courseImageUrl" name="imageUrl" placeholder="Enter course image URL" required>
                </div>
            `;
        default:
            return '';
    }
}

// Set up event listeners
function setupEventListeners() {
    // Add form submission
    document.getElementById('addForm').addEventListener('submit', handleFormSubmit);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('addModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeDeleteModal();
        }
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    let result;
    
    switch(currentItemType) {
        case 'video':
            result = db.addVideo(data);
            break;
        case 'pdf':
            result = db.addPDF(data);
            break;
        case 'book':
            result = db.addBook(data);
            break;
        case 'course':
            result = db.addCourse(data);
            break;
    }
    
    if (result) {
        showNotification(`${currentItemType.charAt(0).toUpperCase() + currentItemType.slice(1)} added successfully!`, 'success');
        closeModal();
        
        // Reload tables
        loadVideosTable();
        loadPDFsTable();
        loadBooksTable();
        loadCoursesTable();
        loadDashboardData();
    }
}

// Edit item
function editItem(type, id) {
    // This would open the modal with pre-filled data
    showNotification('Edit functionality coming soon!', 'info');
}

// Delete item
function deleteItem(type, id, name) {
    currentItemType = type;
    currentItemId = id;
    
    const modal = document.getElementById('deleteModal');
    const deleteItemName = document.getElementById('deleteItemName');
    
    deleteItemName.textContent = name;
    modal.style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

function confirmDelete() {
    let result = false;
    
    switch(currentItemType) {
        case 'video':
            db.deleteVideo(currentItemId);
            result = true;
            break;
        case 'pdf':
            db.deletePDF(currentItemId);
            result = true;
            break;
        case 'book':
            db.deleteBook(currentItemId);
            result = true;
            break;
        case 'course':
            db.deleteCourse(currentItemId);
            result = true;
            break;
    }
    
    if (result) {
        showNotification(`${currentItemType.charAt(0).toUpperCase() + currentItemType.slice(1)} deleted successfully!`, 'success');
        closeDeleteModal();
        
        // Reload tables
        loadVideosTable();
        loadPDFsTable();
        loadBooksTable();
        loadCoursesTable();
        loadDashboardData();
    }
}

// Edit user
function editUser(id) {
    showNotification('User edit functionality coming soon!', 'info');
}

// Delete user
function deleteUser(id, name) {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
        db.deleteUser(id);
        showNotification('User deleted successfully!', 'success');
        loadUsersTable();
        loadDashboardData();
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminData');
    window.location.href = 'login.html';
}

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

// Add CSS for badges
const style = document.createElement('style');
style.textContent = `
    .category-badge {
        background: #e6fffa;
        color: #48bb78;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .level-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .level-badge.beginner {
        background: #e6fffa;
        color: #48bb78;
    }
    
    .level-badge.intermediate {
        background: #fef5e7;
        color: #ed8936;
    }
    
    .level-badge.advanced {
        background: #fed7d7;
        color: #f56565;
    }
    
    .role-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .role-badge.admin {
        background: #e6fffa;
        color: #48bb78;
    }
    
    .role-badge.user {
        background: #e2e8f0;
        color: #4a5568;
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .user-avatar {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.9rem;
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