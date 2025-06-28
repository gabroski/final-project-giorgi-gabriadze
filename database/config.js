const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const config = {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: 'math_study_platform',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    }
};

// Database collections
const collections = {
    USERS: 'users',
    MESSAGES: 'messages',
    GROUPS: 'groups',
    FRIEND_REQUESTS: 'friend_requests',
    COURSES: 'courses',
    BOOKS: 'books',
    VIDEOS: 'videos',
    ZOOM_SESSIONS: 'zoom_sessions'
};

// Connect to MongoDB
async function connectToDatabase() {
    try {
        const client = new MongoClient(config.url, config.options);
        await client.connect();
        console.log('Connected to MongoDB successfully');
        
        const db = client.db(config.dbName);
        return { client, db };
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

// Get database instance
async function getDatabase() {
    const { db } = await connectToDatabase();
    return db;
}

// Close database connection
async function closeDatabase(client) {
    if (client) {
        await client.close();
        console.log('Database connection closed');
    }
}

module.exports = {
    config,
    collections,
    connectToDatabase,
    getDatabase,
    closeDatabase
}; 