const { getDatabase, collections } = require('../config');

class Message {
    constructor(messageData) {
        this.senderId = messageData.senderId;
        this.receiverId = messageData.receiverId;
        this.content = messageData.content;
        this.messageType = messageData.messageType || 'text'; // text, image, file, voice
        this.chatType = messageData.chatType || 'private'; // private, group
        this.groupId = messageData.groupId || null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isRead = false;
        this.isDeleted = false;
        this.attachments = messageData.attachments || [];
        this.replyTo = messageData.replyTo || null;
    }

    // Create new message
    static async create(messageData) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const message = new Message(messageData);
            const result = await collection.insertOne(message);
            
            return { ...message, _id: result.insertedId };
        } catch (error) {
            throw error;
        }
    }

    // Get messages between two users
    static async getPrivateMessages(userId1, userId2, limit = 50, skip = 0) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const messages = await collection.find({
                chatType: 'private',
                $or: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 }
                ],
                isDeleted: false
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
            
            return messages.reverse();
        } catch (error) {
            throw error;
        }
    }

    // Get group messages
    static async getGroupMessages(groupId, limit = 50, skip = 0) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const messages = await collection.find({
                chatType: 'group',
                groupId: groupId,
                isDeleted: false
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
            
            return messages.reverse();
        } catch (error) {
            throw error;
        }
    }

    // Get recent conversations for a user
    static async getRecentConversations(userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            // Get private conversations
            const privateConversations = await collection.aggregate([
                {
                    $match: {
                        $or: [
                            { senderId: userId },
                            { receiverId: userId }
                        ],
                        chatType: 'private',
                        isDeleted: false
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ['$senderId', userId] },
                                '$receiverId',
                                '$senderId'
                            ]
                        },
                        lastMessage: { $first: '$$ROOT' }
                    }
                },
                {
                    $sort: { 'lastMessage.createdAt': -1 }
                }
            ]).toArray();

            // Get group conversations
            const groupConversations = await collection.aggregate([
                {
                    $match: {
                        chatType: 'group',
                        isDeleted: false
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: '$groupId',
                        lastMessage: { $first: '$$ROOT' }
                    }
                },
                {
                    $sort: { 'lastMessage.createdAt': -1 }
                }
            ]).toArray();

            return {
                private: privateConversations,
                groups: groupConversations
            };
        } catch (error) {
            throw error;
        }
    }

    // Mark messages as read
    static async markAsRead(messageIds) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const result = await collection.updateMany(
                { _id: { $in: messageIds } },
                { $set: { isRead: true } }
            );
            
            return result.modifiedCount;
        } catch (error) {
            throw error;
        }
    }

    // Mark conversation as read
    static async markConversationAsRead(userId, otherUserId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const result = await collection.updateMany(
                {
                    senderId: otherUserId,
                    receiverId: userId,
                    isRead: false,
                    isDeleted: false
                },
                { $set: { isRead: true } }
            );
            
            return result.modifiedCount;
        } catch (error) {
            throw error;
        }
    }

    // Delete message
    static async deleteMessage(messageId, userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const result = await collection.updateOne(
                { 
                    _id: messageId,
                    senderId: userId // Only sender can delete
                },
                { $set: { isDeleted: true, updatedAt: new Date() } }
            );
            
            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Update message
    static async updateMessage(messageId, userId, content) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const result = await collection.updateOne(
                { 
                    _id: messageId,
                    senderId: userId // Only sender can edit
                },
                { 
                    $set: { 
                        content: content,
                        updatedAt: new Date()
                    }
                }
            );
            
            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get unread message count
    static async getUnreadCount(userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const count = await collection.countDocuments({
                receiverId: userId,
                isRead: false,
                isDeleted: false
            });
            
            return count;
        } catch (error) {
            throw error;
        }
    }

    // Search messages
    static async searchMessages(userId, query) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const regex = new RegExp(query, 'i');
            
            const messages = await collection.find({
                $or: [
                    { senderId: userId },
                    { receiverId: userId }
                ],
                content: regex,
                isDeleted: false
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
            
            return messages;
        } catch (error) {
            throw error;
        }
    }

    // Get message statistics
    static async getMessageStats(userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.MESSAGES);
            
            const stats = await collection.aggregate([
                {
                    $match: {
                        $or: [
                            { senderId: userId },
                            { receiverId: userId }
                        ],
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalMessages: { $sum: 1 },
                        sentMessages: {
                            $sum: {
                                $cond: [{ $eq: ['$senderId', userId] }, 1, 0]
                            }
                        },
                        receivedMessages: {
                            $sum: {
                                $cond: [{ $eq: ['$receiverId', userId] }, 1, 0]
                            }
                        },
                        unreadMessages: {
                            $sum: {
                                $cond: [
                                    { $and: [
                                        { $eq: ['$receiverId', userId] },
                                        { $eq: ['$isRead', false] }
                                    ]},
                                    1, 0
                                ]
                            }
                        }
                    }
                }
            ]).toArray();
            
            return stats[0] || {
                totalMessages: 0,
                sentMessages: 0,
                receivedMessages: 0,
                unreadMessages: 0
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Message; 