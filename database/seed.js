const { connectToDatabase, closeDatabase, collections } = require('./config');
const User = require('./models/User');
const Group = require('./models/Group');
const Message = require('./models/Message');

// Sample data for seeding
const sampleUsers = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mathstudy.com',
        password: 'admin123',
        username: 'admin',
        userType: 'admin',
        profile: {
            bio: 'System Administrator for Math Study Platform',
            phone: '+995 551 580 960',
            location: 'Tbilisi, Georgia',
            education: 'M.S. in Computer Science',
            interests: ['System Administration', 'Mathematics', 'Education Technology']
        }
    },
    {
        firstName: 'Luka',
        lastName: 'Mshvildadze',
        email: 'luka@mathstudy.com',
        password: 'password123',
        username: 'luka_teacher',
        userType: 'teacher',
        profile: {
            bio: 'Senior Mathematics Lecturer with 15+ years of experience',
            phone: '+995 551 580 960',
            location: 'Tbilisi, Georgia',
            education: 'Ph.D. in Mathematics, Tbilisi State University',
            interests: ['Calculus', 'Linear Algebra', 'Mathematical Analysis']
        }
    },
    {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria@example.com',
        password: 'password123',
        username: 'maria_student',
        userType: 'student',
        profile: {
            bio: 'Mathematics student passionate about calculus',
            phone: '+1 555 123 4567',
            location: 'New York, USA',
            education: 'Bachelor in Mathematics',
            interests: ['Calculus', 'Differential Equations']
        }
    },
    {
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@example.com',
        password: 'password123',
        username: 'alex_math',
        userType: 'student',
        profile: {
            bio: 'Learning linear algebra and its applications',
            phone: '+1 555 987 6543',
            location: 'Boston, USA',
            education: 'Computer Science Student',
            interests: ['Linear Algebra', 'Computer Science']
        }
    },
    {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        username: 'sarah_learner',
        userType: 'student',
        profile: {
            bio: 'Excited to learn advanced mathematics',
            phone: '+1 555 456 7890',
            location: 'Chicago, USA',
            education: 'High School Senior',
            interests: ['Calculus', 'Statistics']
        }
    }
];

const sampleGroups = [
    {
        name: 'Calculus Study Group',
        description: 'A group for students studying calculus and its applications',
        creatorId: null, // Will be set to Luka's ID
        category: 'calculus',
        maxMembers: 50,
        isPrivate: false,
        rules: [
            'Be respectful to all members',
            'Ask questions and help others',
            'Share relevant resources and materials'
        ],
        tags: ['calculus', 'derivatives', 'integrals', 'limits']
    },
    {
        name: 'Linear Algebra Club',
        description: 'Advanced linear algebra concepts and problem solving',
        creatorId: null, // Will be set to Luka's ID
        category: 'algebra',
        maxMembers: 30,
        isPrivate: false,
        rules: [
            'Focus on linear algebra topics',
            'Share interesting problems',
            'Collaborate on solutions'
        ],
        tags: ['linear algebra', 'matrices', 'vectors', 'eigenvalues']
    },
    {
        name: 'Mathematical Analysis',
        description: 'Deep dive into mathematical analysis and proofs',
        creatorId: null, // Will be set to Luka's ID
        category: 'analysis',
        maxMembers: 25,
        isPrivate: true,
        rules: [
            'Advanced topics only',
            'Proof-based discussions',
            'Rigorous mathematical approach'
        ],
        tags: ['analysis', 'proofs', 'sequences', 'series']
    }
];

const sampleMessages = [
    {
        senderId: null, // Will be set to Luka's ID
        receiverId: null, // Will be set to Maria's ID
        content: 'Hello! Welcome to our mathematics study program. I\'m Luka Mshvildadze, your mathematics instructor.',
        messageType: 'text',
        chatType: 'private'
    },
    {
        senderId: null, // Will be set to Maria's ID
        receiverId: null, // Will be set to Luka's ID
        content: 'Thank you! I\'m excited to learn mathematics with you.',
        messageType: 'text',
        chatType: 'private'
    },
    {
        senderId: null, // Will be set to Luka's ID
        receiverId: null, // Will be set to Maria's ID
        content: 'Great! We\'ll be covering calculus, linear algebra, and mathematical analysis. Do you have any specific topics you\'d like to focus on?',
        messageType: 'text',
        chatType: 'private'
    },
    {
        senderId: null, // Will be set to Maria's ID
        receiverId: null, // Will be set to Luka's ID
        content: 'I\'m particularly interested in calculus and its applications.',
        messageType: 'text',
        chatType: 'private'
    },
    {
        senderId: null, // Will be set to Luka's ID
        receiverId: null, // Will be set to Maria's ID
        content: 'Excellent choice! Calculus is fundamental to many fields. We\'ll start with limits and derivatives, then move to integrals and applications.',
        messageType: 'text',
        chatType: 'private'
    }
];

async function seedDatabase() {
    let client;
    try {
        console.log('Starting database seeding...');
        
        // Connect to database
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        // Clear existing data
        console.log('Clearing existing data...');
        await db.collection(collections.USERS).deleteMany({});
        await db.collection(collections.GROUPS).deleteMany({});
        await db.collection(collections.MESSAGES).deleteMany({});
        await db.collection(collections.FRIEND_REQUESTS).deleteMany({});
        
        // Create users
        console.log('Creating users...');
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = await User.create(userData);
            createdUsers.push(user);
            console.log(`Created user: ${user.firstName} ${user.lastName}`);
        }
        
        // Get Luka's ID for groups and messages
        const luka = createdUsers.find(user => user.email === 'luka@mathstudy.com');
        const maria = createdUsers.find(user => user.email === 'maria@example.com');
        
        // Create groups
        console.log('Creating groups...');
        const createdGroups = [];
        for (const groupData of sampleGroups) {
            groupData.creatorId = luka._id;
            const group = await Group.create(groupData);
            createdGroups.push(group);
            console.log(`Created group: ${group.name}`);
        }
        
        // Create messages
        console.log('Creating messages...');
        for (const messageData of sampleMessages) {
            messageData.senderId = luka._id;
            messageData.receiverId = maria._id;
            const message = await Message.create(messageData);
            console.log(`Created message: ${message.content.substring(0, 50)}...`);
        }
        
        // Add some users to groups
        console.log('Adding users to groups...');
        const calculusGroup = createdGroups.find(group => group.category === 'calculus');
        const algebraGroup = createdGroups.find(group => group.category === 'algebra');
        
        await Group.joinGroup(calculusGroup._id, maria._id);
        await Group.joinGroup(calculusGroup._id, createdUsers[2]._id); // Alex
        await Group.joinGroup(algebraGroup._id, createdUsers[2]._id); // Alex
        await Group.joinGroup(algebraGroup._id, createdUsers[3]._id); // Sarah
        
        console.log('Database seeding completed successfully!');
        
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        if (client) {
            await closeDatabase(client);
        }
    }
}

// Run seeder if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('Seeding completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase }; 