const { getDatabase, collections } = require('../config');
const bcrypt = require('bcryptjs');

class User {
    constructor(userData) {
        this.email = userData.email;
        this.password = userData.password;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.username = userData.username;
        this.userType = userData.userType;
        this.createdAt = new Date();
        this.lastLogin = null;
        this.isActive = true;
        this.profile = {
            avatar: null,
            bio: '',
            phone: '',
            location: '',
            education: '',
            interests: []
        };
        this.settings = {
            notifications: true,
            emailUpdates: true,
            privacy: 'public'
        };
    }

    // Create new user
    static async create(userData) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            
            // Check if user already exists
            const existingUser = await collection.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            
            const user = new User({
                ...userData,
                password: hashedPassword
            });

            const result = await collection.insertOne(user);
            return { ...user, _id: result.insertedId };
        } catch (error) {
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            return await collection.findOne({ email: email });
        } catch (error) {
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            return await collection.findOne({ _id: id });
        } catch (error) {
            throw error;
        }
    }

    // Authenticate user
    static async authenticate(email, password) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }

            // Update last login
            await this.updateLastLogin(user._id);

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Update last login
    static async updateLastLogin(userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            await collection.updateOne(
                { _id: userId },
                { $set: { lastLogin: new Date() } }
            );
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    static async updateProfile(userId, profileData) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            
            const result = await collection.updateOne(
                { _id: userId },
                { $set: { profile: profileData } }
            );
            
            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Update user settings
    static async updateSettings(userId, settings) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            
            const result = await collection.updateOne(
                { _id: userId },
                { $set: { settings: settings } }
            );
            
            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Change password
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            
            const user = await collection.findOne({ _id: userId });
            if (!user) {
                throw new Error('User not found');
            }

            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                throw new Error('Current password is incorrect');
            }

            const saltRounds = 12;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
            
            const result = await collection.updateOne(
                { _id: userId },
                { $set: { password: hashedNewPassword } }
            );
            
            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get all users (for admin)
    static async getAllUsers() {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            return await collection.find({}, { password: 0 }).toArray();
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    static async deleteUser(userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            
            const result = await collection.deleteOne({ _id: userId });
            return result.deletedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Search users
    static async searchUsers(query) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.USERS);
            
            const regex = new RegExp(query, 'i');
            return await collection.find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { username: regex },
                    { email: regex }
                ]
            }, { password: 0 }).toArray();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User; 