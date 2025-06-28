const { getDatabase, collections } = require('../config');

class Group {
    constructor(groupData) {
        this.name = groupData.name;
        this.description = groupData.description;
        this.creatorId = groupData.creatorId;
        this.category = groupData.category || 'general'; // calculus, algebra, analysis, general
        this.maxMembers = groupData.maxMembers || 100;
        this.isPrivate = groupData.isPrivate || false;
        this.isActive = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.avatar = groupData.avatar || null;
        this.rules = groupData.rules || [];
        this.tags = groupData.tags || [];
        this.members = [{
            userId: groupData.creatorId,
            role: 'admin',
            joinedAt: new Date(),
            isActive: true
        }];
        this.admins = [groupData.creatorId];
        this.moderators = [];
        this.pendingRequests = [];
        this.bannedUsers = [];
    }

    // Create new group
    static async create(groupData) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = new Group(groupData);
            const result = await collection.insertOne(group);
            
            return { ...group, _id: result.insertedId };
        } catch (error) {
            throw error;
        }
    }

    // Get group by ID
    static async findById(groupId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            return await collection.findOne({ _id: groupId, isActive: true });
        } catch (error) {
            throw error;
        }
    }

    // Get all groups
    static async getAllGroups(limit = 20, skip = 0) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            return await collection.find({ isActive: true })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray();
        } catch (error) {
            throw error;
        }
    }

    // Get groups by category
    static async getGroupsByCategory(category, limit = 20, skip = 0) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            return await collection.find({ 
                category: category, 
                isActive: true 
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        } catch (error) {
            throw error;
        }
    }

    // Get user's groups
    static async getUserGroups(userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            return await collection.find({
                'members.userId': userId,
                'members.isActive': true,
                isActive: true
            }).toArray();
        } catch (error) {
            throw error;
        }
    }

    // Join group
    static async joinGroup(groupId, userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Check if user is already a member
            const isMember = group.members.some(member => 
                member.userId === userId && member.isActive
            );
            if (isMember) {
                throw new Error('User is already a member of this group');
            }

            // Check if user is banned
            if (group.bannedUsers.includes(userId)) {
                throw new Error('User is banned from this group');
            }

            // Check if group is full
            if (group.members.length >= group.maxMembers) {
                throw new Error('Group is full');
            }

            // Add user to group
            const result = await collection.updateOne(
                { _id: groupId },
                {
                    $push: {
                        members: {
                            userId: userId,
                            role: 'member',
                            joinedAt: new Date(),
                            isActive: true
                        }
                    }
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Leave group
    static async leaveGroup(groupId, userId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const result = await collection.updateOne(
                { _id: groupId },
                {
                    $set: {
                        'members.$[member].isActive': false
                    }
                },
                {
                    arrayFilters: [{ 'member.userId': userId }]
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Add admin
    static async addAdmin(groupId, userId, adminId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Check if user is admin
            if (!group.admins.includes(adminId)) {
                throw new Error('Only admins can add other admins');
            }

            const result = await collection.updateOne(
                { _id: groupId },
                {
                    $addToSet: { admins: userId },
                    $set: {
                        'members.$[member].role': 'admin'
                    }
                },
                {
                    arrayFilters: [{ 'member.userId': userId }]
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Remove admin
    static async removeAdmin(groupId, userId, adminId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Check if user is admin
            if (!group.admins.includes(adminId)) {
                throw new Error('Only admins can remove other admins');
            }

            // Don't remove the creator
            if (group.creatorId === userId) {
                throw new Error('Cannot remove the group creator from admin role');
            }

            const result = await collection.updateOne(
                { _id: groupId },
                {
                    $pull: { admins: userId },
                    $set: {
                        'members.$[member].role': 'member'
                    }
                },
                {
                    arrayFilters: [{ 'member.userId': userId }]
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Ban user
    static async banUser(groupId, userId, adminId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Check if user is admin
            if (!group.admins.includes(adminId)) {
                throw new Error('Only admins can ban users');
            }

            // Don't ban the creator
            if (group.creatorId === userId) {
                throw new Error('Cannot ban the group creator');
            }

            const result = await collection.updateOne(
                { _id: groupId },
                {
                    $addToSet: { bannedUsers: userId },
                    $set: {
                        'members.$[member].isActive': false
                    }
                },
                {
                    arrayFilters: [{ 'member.userId': userId }]
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Unban user
    static async unbanUser(groupId, userId, adminId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Check if user is admin
            if (!group.admins.includes(adminId)) {
                throw new Error('Only admins can unban users');
            }

            const result = await collection.updateOne(
                { _id: groupId },
                {
                    $pull: { bannedUsers: userId }
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Update group
    static async updateGroup(groupId, updateData, adminId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Check if user is admin
            if (!group.admins.includes(adminId)) {
                throw new Error('Only admins can update group');
            }

            const result = await collection.updateOne(
                { _id: groupId },
                {
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete group
    static async deleteGroup(groupId, adminId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Only creator can delete group
            if (group.creatorId !== adminId) {
                throw new Error('Only the group creator can delete the group');
            }

            const result = await collection.updateOne(
                { _id: groupId },
                { $set: { isActive: false, updatedAt: new Date() } }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Search groups
    static async searchGroups(query, limit = 20) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const regex = new RegExp(query, 'i');
            
            return await collection.find({
                $or: [
                    { name: regex },
                    { description: regex },
                    { tags: regex }
                ],
                isActive: true
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
        } catch (error) {
            throw error;
        }
    }

    // Get group statistics
    static async getGroupStats(groupId) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collections.GROUPS);
            
            const group = await this.findById(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            const activeMembers = group.members.filter(member => member.isActive);
            const admins = group.admins.length;
            const moderators = group.moderators.length;
            const bannedUsers = group.bannedUsers.length;

            return {
                totalMembers: group.members.length,
                activeMembers: activeMembers.length,
                admins: admins,
                moderators: moderators,
                bannedUsers: bannedUsers,
                maxMembers: group.maxMembers,
                memberPercentage: Math.round((activeMembers.length / group.maxMembers) * 100)
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Group; 