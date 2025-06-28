// Database system for Math Study Platform
class Database {
    constructor() {
        this.initializeDatabase();
    }

    // Initialize database with default data
    initializeDatabase() {
        // Initialize admin accounts if they don't exist
        if (!this.getAdmins()) {
            const defaultAdmins = [
                {
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@mathstudy.com',
                    createdAt: new Date().toISOString()
                },
                {
                    username: 'luka',
                    password: 'luka123',
                    role: 'admin',
                    firstName: 'Luka',
                    lastName: 'Mshvildadze',
                    email: 'luka@mathstudy.com',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('admins', JSON.stringify(defaultAdmins));
        }

        // Initialize content if it doesn't exist
        if (!this.getVideos()) {
            this.initializeVideos();
        }
        if (!this.getPDFs()) {
            this.initializePDFs();
        }
        if (!this.getBooks()) {
            this.initializeBooks();
        }
        if (!this.getCourses()) {
            this.initializeCourses();
        }
    }

    // Admin management
    getAdmins() {
        return JSON.parse(localStorage.getItem('admins') || '[]');
    }

    validateAdmin(username, password) {
        const admins = this.getAdmins();
        return admins.find(admin => 
            admin.username === username && admin.password === password
        );
    }

    addAdmin(adminData) {
        const admins = this.getAdmins();
        admins.push({
            ...adminData,
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('admins', JSON.stringify(admins));
    }

    // Video management
    getVideos() {
        return JSON.parse(localStorage.getItem('videos') || '[]');
    }

    addVideo(videoData) {
        const videos = this.getVideos();
        const newVideo = {
            id: this.generateId(),
            ...videoData,
            createdAt: new Date().toISOString(),
            views: 0,
            likes: 0
        };
        videos.push(newVideo);
        localStorage.setItem('videos', JSON.stringify(videos));
        return newVideo;
    }

    updateVideo(id, updates) {
        const videos = this.getVideos();
        const index = videos.findIndex(video => video.id === id);
        if (index !== -1) {
            videos[index] = { ...videos[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('videos', JSON.stringify(videos));
            return videos[index];
        }
        return null;
    }

    deleteVideo(id) {
        const videos = this.getVideos();
        const filteredVideos = videos.filter(video => video.id !== id);
        localStorage.setItem('videos', JSON.stringify(filteredVideos));
    }

    // PDF management
    getPDFs() {
        return JSON.parse(localStorage.getItem('pdfs') || '[]');
    }

    addPDF(pdfData) {
        const pdfs = this.getPDFs();
        const newPDF = {
            id: this.generateId(),
            ...pdfData,
            createdAt: new Date().toISOString(),
            downloads: 0
        };
        pdfs.push(newPDF);
        localStorage.setItem('pdfs', JSON.stringify(pdfs));
        return newPDF;
    }

    updatePDF(id, updates) {
        const pdfs = this.getPDFs();
        const index = pdfs.findIndex(pdf => pdf.id === id);
        if (index !== -1) {
            pdfs[index] = { ...pdfs[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('pdfs', JSON.stringify(pdfs));
            return pdfs[index];
        }
        return null;
    }

    deletePDF(id) {
        const pdfs = this.getPDFs();
        const filteredPDFs = pdfs.filter(pdf => pdf.id !== id);
        localStorage.setItem('pdfs', JSON.stringify(filteredPDFs));
    }

    // Book management
    getBooks() {
        return JSON.parse(localStorage.getItem('books') || '[]');
    }

    addBook(bookData) {
        const books = this.getBooks();
        const newBook = {
            id: this.generateId(),
            ...bookData,
            createdAt: new Date().toISOString(),
            downloads: 0
        };
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
        return newBook;
    }

    updateBook(id, updates) {
        const books = this.getBooks();
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index] = { ...books[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('books', JSON.stringify(books));
            return books[index];
        }
        return null;
    }

    deleteBook(id) {
        const books = this.getBooks();
        const filteredBooks = books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(filteredBooks));
    }

    // Course management
    getCourses() {
        return JSON.parse(localStorage.getItem('courses') || '[]');
    }

    addCourse(courseData) {
        const courses = this.getCourses();
        const newCourse = {
            id: this.generateId(),
            ...courseData,
            createdAt: new Date().toISOString(),
            students: 0
        };
        courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(courses));
        return newCourse;
    }

    updateCourse(id, updates) {
        const courses = this.getCourses();
        const index = courses.findIndex(course => course.id === id);
        if (index !== -1) {
            courses[index] = { ...courses[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('courses', JSON.stringify(courses));
            return courses[index];
        }
        return null;
    }

    deleteCourse(id) {
        const courses = this.getCourses();
        const filteredCourses = courses.filter(course => course.id !== id);
        localStorage.setItem('courses', JSON.stringify(filteredCourses));
    }

    // User management
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.generateId(),
            ...userData,
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('users', JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
    }

    // Initialize default content
    initializeVideos() {
        const defaultVideos = [
            {
                id: 'v1',
                title: 'Introduction to Calculus',
                description: 'Learn the basics of calculus including limits, derivatives, and integrals.',
                category: 'Calculus',
                duration: '45:30',
                instructor: 'Luka Mshvildadze',
                thumbnail: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Calculus',
                videoUrl: '#',
                createdAt: new Date().toISOString(),
                views: 1250,
                likes: 89
            },
            {
                id: 'v2',
                title: 'Linear Algebra Fundamentals',
                description: 'Understanding vectors, matrices, and linear transformations.',
                category: 'Linear Algebra',
                duration: '52:15',
                instructor: 'Luka Mshvildadze',
                thumbnail: 'https://via.placeholder.com/300x200/48bb78/ffffff?text=Algebra',
                videoUrl: '#',
                createdAt: new Date().toISOString(),
                views: 980,
                likes: 67
            },
            {
                id: 'v3',
                title: 'Mathematical Analysis',
                description: 'Deep dive into mathematical analysis and proof techniques.',
                category: 'Analysis',
                duration: '38:45',
                instructor: 'Luka Mshvildadze',
                thumbnail: 'https://via.placeholder.com/300x200/f56565/ffffff?text=Analysis',
                videoUrl: '#',
                createdAt: new Date().toISOString(),
                views: 756,
                likes: 45
            }
        ];
        localStorage.setItem('videos', JSON.stringify(defaultVideos));
    }

    initializePDFs() {
        const defaultPDFs = [
            {
                id: 'pdf1',
                title: 'Calculus Practice Problems',
                description: 'A comprehensive collection of calculus practice problems with solutions.',
                category: 'Calculus',
                instructor: 'Luka Mshvildadze',
                fileUrl: '#',
                fileSize: '2.5 MB',
                pages: 45,
                createdAt: new Date().toISOString(),
                downloads: 234
            },
            {
                id: 'pdf2',
                title: 'Linear Algebra Notes',
                description: 'Complete notes on linear algebra concepts and applications.',
                category: 'Linear Algebra',
                instructor: 'Luka Mshvildadze',
                fileUrl: '#',
                fileSize: '1.8 MB',
                pages: 32,
                createdAt: new Date().toISOString(),
                downloads: 189
            },
            {
                id: 'pdf3',
                title: 'Mathematical Analysis Guide',
                description: 'A guide to mathematical analysis with examples and proofs.',
                category: 'Analysis',
                instructor: 'Luka Mshvildadze',
                fileUrl: '#',
                fileSize: '3.2 MB',
                pages: 58,
                createdAt: new Date().toISOString(),
                downloads: 156
            }
        ];
        localStorage.setItem('pdfs', JSON.stringify(defaultPDFs));
    }

    initializeBooks() {
        const defaultBooks = [
            {
                id: 'book1',
                title: 'Calculus: Early Transcendentals',
                author: 'James Stewart',
                description: 'A comprehensive textbook covering single and multivariable calculus.',
                category: 'Calculus',
                isbn: '978-1305272378',
                coverUrl: 'https://via.placeholder.com/200x300/667eea/ffffff?text=Calculus+Book',
                fileUrl: '#',
                fileSize: '15.2 MB',
                pages: 1200,
                createdAt: new Date().toISOString(),
                downloads: 445
            },
            {
                id: 'book2',
                title: 'Linear Algebra and Its Applications',
                author: 'Gilbert Strang',
                description: 'An excellent introduction to linear algebra with practical applications.',
                category: 'Linear Algebra',
                isbn: '978-0030105678',
                coverUrl: 'https://via.placeholder.com/200x300/48bb78/ffffff?text=Algebra+Book',
                fileUrl: '#',
                fileSize: '8.7 MB',
                pages: 650,
                createdAt: new Date().toISOString(),
                downloads: 312
            },
            {
                id: 'book3',
                title: 'Principles of Mathematical Analysis',
                author: 'Walter Rudin',
                description: 'A rigorous treatment of mathematical analysis for advanced students.',
                category: 'Analysis',
                isbn: '978-0070542358',
                coverUrl: 'https://via.placeholder.com/200x300/f56565/ffffff?text=Analysis+Book',
                fileUrl: '#',
                fileSize: '12.1 MB',
                pages: 850,
                createdAt: new Date().toISOString(),
                downloads: 198
            }
        ];
        localStorage.setItem('books', JSON.stringify(defaultBooks));
    }

    initializeCourses() {
        const defaultCourses = [
            {
                id: 'course1',
                title: 'Calculus I',
                description: 'Introduction to differential calculus with applications.',
                category: 'Calculus',
                instructor: 'Luka Mshvildadze',
                duration: '12 weeks',
                level: 'Beginner',
                students: 45,
                price: 0,
                imageUrl: 'https://via.placeholder.com/400x250/667eea/ffffff?text=Calculus+I',
                createdAt: new Date().toISOString()
            },
            {
                id: 'course2',
                title: 'Linear Algebra',
                description: 'Fundamentals of linear algebra and matrix operations.',
                category: 'Linear Algebra',
                instructor: 'Luka Mshvildadze',
                duration: '10 weeks',
                level: 'Intermediate',
                students: 32,
                price: 0,
                imageUrl: 'https://via.placeholder.com/400x250/48bb78/ffffff?text=Linear+Algebra',
                createdAt: new Date().toISOString()
            },
            {
                id: 'course3',
                title: 'Mathematical Analysis',
                description: 'Advanced mathematical analysis and proof techniques.',
                category: 'Analysis',
                instructor: 'Luka Mshvildadze',
                duration: '14 weeks',
                level: 'Advanced',
                students: 28,
                price: 0,
                imageUrl: 'https://via.placeholder.com/400x250/f56565/ffffff?text=Analysis',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('courses', JSON.stringify(defaultCourses));
    }

    // Utility functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Search functionality
    searchContent(query, type = 'all') {
        query = query.toLowerCase();
        let results = [];

        if (type === 'all' || type === 'videos') {
            const videos = this.getVideos();
            const videoResults = videos.filter(video => 
                video.title.toLowerCase().includes(query) ||
                video.description.toLowerCase().includes(query) ||
                video.category.toLowerCase().includes(query)
            );
            results.push(...videoResults.map(v => ({ ...v, type: 'video' })));
        }

        if (type === 'all' || type === 'pdfs') {
            const pdfs = this.getPDFs();
            const pdfResults = pdfs.filter(pdf => 
                pdf.title.toLowerCase().includes(query) ||
                pdf.description.toLowerCase().includes(query) ||
                pdf.category.toLowerCase().includes(query)
            );
            results.push(...pdfResults.map(p => ({ ...p, type: 'pdf' })));
        }

        if (type === 'all' || type === 'books') {
            const books = this.getBooks();
            const bookResults = books.filter(book => 
                book.title.toLowerCase().includes(query) ||
                book.description.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query)
            );
            results.push(...bookResults.map(b => ({ ...b, type: 'book' })));
        }

        return results;
    }

    // Statistics
    getStatistics() {
        const videos = this.getVideos();
        const pdfs = this.getPDFs();
        const books = this.getBooks();
        const courses = this.getCourses();
        const users = this.getUsers();

        return {
            totalVideos: videos.length,
            totalPDFs: pdfs.length,
            totalBooks: books.length,
            totalCourses: courses.length,
            totalUsers: users.length,
            totalViews: videos.reduce((sum, video) => sum + video.views, 0),
            totalDownloads: pdfs.reduce((sum, pdf) => sum + pdf.downloads, 0) + 
                           books.reduce((sum, book) => sum + book.downloads, 0),
            totalStudents: courses.reduce((sum, course) => sum + course.students, 0)
        };
    }
}

// Export database instance
const db = new Database(); 