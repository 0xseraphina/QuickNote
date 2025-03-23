# QuickNote

A feature-rich, fast note-taking app that runs locally in your browser.

## Features

### Core Features
- ✍️ **Create, edit and delete notes** - Simple note management
- 🔍 **Advanced search** - Search through note titles, content, and tags  
- 💾 **Auto-save functionality** - Notes save automatically with visual indicator
- 📱 **Responsive design** - Works on desktop and mobile devices

### Organization & Filtering
- 🏷️ **Tags system** - Organize notes with custom tags
- 📂 **Tag filtering** - Filter notes by specific tags
- 📊 **Multiple sorting options** - Sort by date (created/updated) or title (A-Z/Z-A)

### Data Management
- 📤 **Export notes** - Backup as JSON or readable TXT format
- 📥 **Import notes** - Restore from JSON or TXT files
- 🌓 **Dark mode** - Toggle between light and dark themes

### User Experience
- ⚡ **Real-time save status** - Visual indicators for saved/unsaved/saving states
- ⌨️ **Keyboard shortcuts** - Quick actions via keyboard
- 🎨 **Clean, modern UI** - Intuitive interface design

## Usage

1. Open `index.html` in your browser
2. Click "New Note" to create your first note
3. Add tags by typing them in the tags field (comma-separated)
4. Use the search bar to find specific notes
5. Filter notes by clicking on tags
6. Export your notes for backup using the Export dropdown

## Keyboard Shortcuts

- `Ctrl+S` - Save current note immediately
- Double-click on note item - Delete note (with confirmation)
- Enter/Blur in tags field - Add tags to current note

## Data Storage

All notes are stored locally in your browser's localStorage. Your data never leaves your device, ensuring complete privacy.

## Import/Export

- **JSON Export**: Full data with metadata, perfect for backup
- **TXT Export**: Human-readable format for sharing or printing
- **Import**: Supports both JSON and TXT formats

## Browser Compatibility

Works in all modern browsers that support localStorage and ES6+ features.