# Math Study Website

A modern, responsive website for mathematics education featuring lecturer Luka Mshvildadze and interactive learning tools.

## Features

- **Professional Design**: Modern, responsive layout with beautiful gradients and animations
- **Lecturer Profile**: Detailed description of Luka Mshvildadze with credentials and statistics
- **Interactive Buttons**:
  - Join Zoom Meeting (with modal popup)
  - Messenger (full chat interface)
  - Books & Resources (comprehensive learning materials)
  - Video Lessons (video tutorials and courses)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Animations**: Smooth hover effects, scroll animations, and interactive elements

## Files Structure

```
├── index.html                    # Main HTML file
├── css/
│   ├── styles.css               # Main CSS styling
│   ├── messenger.css            # Messenger page styles
│   ├── books.css                # Books page styles
│   └── videos.css               # Videos page styles
├── js/
│   ├── script.js                # Main JavaScript functionality
│   ├── messenger.js             # Messenger chat functionality
│   ├── books.js                 # Books page functionality
│   └── videos.js                # Videos page functionality
├── pages/
│   ├── messenger.html           # Messenger chat page
│   ├── books.html               # Books and resources page
│   └── videos.html              # Video lessons page
├── images/                      # Image assets folder
├── components/                  # Reusable components folder
└── README.md                    # This file
```

## How to Use

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Join Zoom Meeting**: Click the "Join Zoom Meeting" button to see meeting details
3. **Chat with Luka**: Click "Messenger" to access the interactive chat interface
4. **Access Resources**: Click "Books & Resources" for learning materials
5. **Watch Videos**: Click "Video Lessons" for tutorial videos
6. **Copy Meeting Info**: Use the "Copy Meeting Info" button to copy meeting details to clipboard

## Pages Overview

### Main Page (`index.html`)

- Lecturer profile with detailed information
- Interactive navigation buttons
- Zoom meeting modal with copy functionality
- Course overview and features

### Messenger Page (`pages/messenger.html`)

- Real-time chat interface with Luka
- Typing indicators and message history
- Voice and video call buttons (coming soon)
- File attachment and voice message features

### Books & Resources Page (`pages/books.html`)

- Recommended textbooks with descriptions
- Online learning resources with direct links
- Practice materials and study guides
- Downloadable PDF resources

### Video Lessons Page (`pages/videos.html`)

- Featured video lessons with thumbnails
- Course categories with statistics
- Recent uploads section
- Video player simulation

## Customization

### Update Lecturer Information

Edit the lecturer details in `index.html`:

```html
<h2 class="lecturer-name">Luka Mshvildadze</h2>
<p class="lecturer-title">Senior Mathematics Lecturer</p>
<div class="lecturer-description">
  <!-- Update the description here -->
</div>
```

### Update Zoom Meeting Details

Modify the meeting information in `index.html`:

```html
<p><strong>Meeting ID:</strong> <span id="meetingId">123 456 7890</span></p>
<p><strong>Password:</strong> <span id="meetingPassword">Math2024</span></p>
<p>
  <strong>Time:</strong>
  <span id="meetingTime">Every Monday, Wednesday, Friday at 18:00</span>
</p>
```

### Update Statistics

Change the lecturer statistics in `index.html`:

```html
<div class="stat">
  <span class="stat-number">15+</span>
  <span class="stat-label">Years Experience</span>
</div>
```

### Customize Colors

The website uses a purple-blue gradient theme. To change colors, edit the CSS variables in `css/styles.css`:

```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add Real Content

Update the content in respective page files:

- `pages/messenger.html` - Add real chat functionality
- `pages/books.html` - Add actual book links and downloads
- `pages/videos.html` - Add real video players and content

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Features Included

### Zoom Integration

- Modal popup with meeting details
- Copy to clipboard functionality
- Direct link to Zoom application

### Messenger System

- Interactive chat interface
- Typing indicators
- Message history
- Responsive design

### Resource Management

- Book recommendations
- Online resource links
- Practice materials
- Download functionality

### Video Platform

- Video thumbnails and descriptions
- Course categorization
- Recent uploads
- Video player simulation

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Optimized for all screen sizes

### Interactive Elements

- Hover animations
- Click effects with ripple animation
- Scroll-triggered animations
- Notification system

### Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast design

## Getting Started

1. Download all files to your web server or local directory
2. Open `index.html` in a web browser
3. Navigate through the different pages using the main buttons
4. Customize the content as needed
5. Deploy to your web hosting service

## Development

The website is built with:

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## Support

For any questions or customization needs, please refer to the code comments or modify the files according to your requirements.

## License

This project is open source and available under the MIT License.
