# Math Study Platform Database

This folder contains the MongoDB database implementation for the Math Study Platform.

## Features

- **User Management**: Registration, authentication, profile management
- **Messaging System**: Private and group chat functionality
- **Group Management**: Study groups with admin controls
- **Friend Requests**: Social networking features
- **Content Management**: Books, videos, and course materials

## Database Collections

- `users` - User accounts and profiles
- `messages` - Chat messages and conversations
- `groups` - Study groups and communities
- `friend_requests` - Friend request management
- `courses` - Course materials and content
- `books` - Textbook and resource management
- `videos` - Video lesson management
- `zoom_sessions` - Zoom meeting scheduling

## Setup Instructions

### Prerequisites

1. **MongoDB**: Install MongoDB Community Server

   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud service)

2. **Node.js**: Install Node.js (version 14 or higher)
   - Download from [Node.js Official Website](https://nodejs.org/)

### Installation

1. **Install Dependencies**:

   ```bash
   cd database
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the database folder:

   ```env
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=math_study_platform
   ```

3. **Start MongoDB**:

   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   ```

4. **Seed Database**:
   ```bash
   npm run seed
   ```

## Usage

### Basic Operations

```javascript
const User = require("./models/User");
const Message = require("./models/Message");
const Group = require("./models/Group");

// Create a new user
const user = await User.create({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
  username: "johndoe",
  userType: "student",
});

// Send a message
const message = await Message.create({
  senderId: user._id,
  receiverId: recipientId,
  content: "Hello!",
  chatType: "private",
});

// Create a study group
const group = await Group.create({
  name: "Calculus Study Group",
  description: "Advanced calculus discussions",
  creatorId: user._id,
  category: "calculus",
});
```

### API Integration

The database models are designed to work with REST APIs. Each model provides:

- **CRUD Operations**: Create, Read, Update, Delete
- **Search Functionality**: Find users, messages, groups
- **Authentication**: Secure password hashing and validation
- **Relationships**: User-group memberships, message threads

## Models

### User Model

- User registration and authentication
- Profile management
- Settings and preferences
- Password management

### Message Model

- Private messaging
- Group chat functionality
- Message history and search
- Read receipts and status

### Group Model

- Study group creation and management
- Member management (join, leave, ban)
- Admin controls and permissions
- Group categories and tags

## Security Features

- **Password Hashing**: Using bcryptjs with salt rounds
- **Input Validation**: Data validation and sanitization
- **Access Control**: Role-based permissions
- **Error Handling**: Comprehensive error management

## Performance Optimization

- **Indexing**: Database indexes for common queries
- **Pagination**: Efficient data loading with skip/limit
- **Aggregation**: MongoDB aggregation for complex queries
- **Connection Pooling**: Optimized database connections

## Development

### Running Tests

```bash
npm test
```

### Development Mode

```bash
npm run dev
```

### Database Reset

```bash
npm run seed
```

## Sample Data

The seeder creates sample data including:

- **Users**: Luka (teacher), Maria, Alex, Sarah (students)
- **Groups**: Calculus Study Group, Linear Algebra Club, Mathematical Analysis
- **Messages**: Sample conversations between users

## Troubleshooting

### Common Issues

1. **Connection Error**: Ensure MongoDB is running
2. **Authentication Error**: Check database credentials
3. **Permission Error**: Verify database user permissions

### Logs

Check MongoDB logs for detailed error information:

```bash
# MongoDB logs location
/var/log/mongodb/mongod.log  # Linux
/usr/local/var/log/mongodb/mongo.log  # macOS
C:\Program Files\MongoDB\Server\[version]\log\mongod.log  # Windows
```

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include JSDoc comments
4. Write tests for new features
5. Update documentation

## License

MIT License - see LICENSE file for details
