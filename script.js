class QuickNote {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('quicknotes')) || [];
        this.currentNoteId = null;
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.renderNotesList();
        this.showEmptyState();
        this.applyTheme();
    }

    bindEvents() {
        document.getElementById('new-note-btn').addEventListener('click', () => {
            this.createNewNote();
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveCurrentNote();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.cancelEditing();
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterNotes(e.target.value);
        });

        document.getElementById('export-json').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportNotes('json');
        });

        document.getElementById('export-txt').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportNotes('txt');
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importNotes(e.target.files[0]);
            e.target.value = '';
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                if (this.currentNoteId !== null) {
                    this.saveCurrentNote();
                }
            }
        });
    }

    createNewNote() {
        const newNote = {
            id: Date.now().toString(),
            title: '',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(newNote);
        this.currentNoteId = newNote.id;
        this.showEditor();
        this.renderNotesList();
        
        document.getElementById('note-title').focus();
    }

    saveCurrentNote() {
        if (this.currentNoteId === null) return;

        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();

        if (!title && !content) {
            this.deleteNote(this.currentNoteId);
            this.hideEditor();
            return;
        }

        const noteIndex = this.notes.findIndex(note => note.id === this.currentNoteId);
        if (noteIndex !== -1) {
            this.notes[noteIndex].title = title || 'Untitled';
            this.notes[noteIndex].content = content;
            this.notes[noteIndex].updatedAt = new Date().toISOString();
        }

        this.saveToLocalStorage();
        this.renderNotesList();
        this.hideEditor();
    }

    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.currentNoteId = noteId;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        this.showEditor();
        this.updateActiveNote(noteId);
    }

    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.saveToLocalStorage();
        
        if (this.currentNoteId === noteId) {
            this.currentNoteId = null;
            this.hideEditor();
        }
        
        this.renderNotesList();
    }

    filterNotes(searchTerm) {
        const filtered = this.notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderNotesList(filtered);
    }

    renderNotesList(notesToShow = this.notes) {
        const notesList = document.getElementById('notes-list');
        
        if (notesToShow.length === 0) {
            notesList.innerHTML = '<div class="empty-state"><h3>No notes yet</h3><p>Click "New Note" to get started</p></div>';
            return;
        }

        const notesHTML = notesToShow.map(note => {
            const date = new Date(note.updatedAt).toLocaleDateString();
            const preview = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');
            
            return `
                <div class="note-item ${note.id === this.currentNoteId ? 'active' : ''}" data-id="${note.id}">
                    <div class="note-title">${note.title || 'Untitled'}</div>
                    <div class="note-preview">${preview}</div>
                    <div class="note-date">${date}</div>
                </div>
            `;
        }).join('');

        notesList.innerHTML = notesHTML;
        this.bindNoteItemEvents();
    }

    bindNoteItemEvents() {
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => {
                const noteId = item.dataset.id;
                this.editNote(noteId);
            });

            item.addEventListener('dblclick', () => {
                const noteId = item.dataset.id;
                if (confirm('Delete this note?')) {
                    this.deleteNote(noteId);
                }
            });
        });
    }

    updateActiveNote(noteId) {
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-id="${noteId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    showEditor() {
        document.getElementById('note-editor').style.display = 'flex';
    }

    hideEditor() {
        document.getElementById('note-editor').style.display = 'none';
        this.currentNoteId = null;
        this.updateActiveNote(null);
        
        if (this.notes.length === 0) {
            this.showEmptyState();
        }
    }

    showEmptyState() {
        if (this.notes.length === 0) {
            this.renderNotesList();
        }
    }

    cancelEditing() {
        if (this.currentNoteId) {
            const note = this.notes.find(n => n.id === this.currentNoteId);
            if (note && !note.title && !note.content) {
                this.deleteNote(this.currentNoteId);
            }
        }
        this.hideEditor();
    }

    saveToLocalStorage() {
        localStorage.setItem('quicknotes', JSON.stringify(this.notes));
    }

    exportNotes(format) {
        if (this.notes.length === 0) {
            alert('No notes to export!');
            return;
        }

        const timestamp = new Date().toISOString().split('T')[0];
        let content, filename, mimeType;

        if (format === 'json') {
            content = JSON.stringify({
                exportedAt: new Date().toISOString(),
                notesCount: this.notes.length,
                notes: this.notes
            }, null, 2);
            filename = `quicknotes-${timestamp}.json`;
            mimeType = 'application/json';
        } else {
            content = this.notes.map(note => {
                const date = new Date(note.updatedAt).toLocaleDateString();
                return `${note.title || 'Untitled'}\n${'='.repeat((note.title || 'Untitled').length)}\nDate: ${date}\n\n${note.content}\n\n${'─'.repeat(50)}\n\n`;
            }).join('');
            filename = `quicknotes-${timestamp}.txt`;
            mimeType = 'text/plain';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importNotes(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let importedNotes = [];
                
                if (file.type === 'application/json' || file.name.endsWith('.json')) {
                    const data = JSON.parse(e.target.result);
                    importedNotes = data.notes || data;
                } else {
                    const content = e.target.result;
                    const sections = content.split('─'.repeat(50));
                    
                    importedNotes = sections.map((section, index) => {
                        const lines = section.trim().split('\n');
                        if (lines.length < 2) return null;
                        
                        const title = lines[0].trim();
                        const contentStart = lines.findIndex(line => line.startsWith('Date:')) + 2;
                        const noteContent = lines.slice(contentStart).join('\n').trim();
                        
                        return {
                            id: (Date.now() + index).toString(),
                            title: title || 'Untitled',
                            content: noteContent,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                    }).filter(note => note && (note.title || note.content));
                }

                if (!Array.isArray(importedNotes) || importedNotes.length === 0) {
                    alert('No valid notes found in the file!');
                    return;
                }

                const validNotes = importedNotes.filter(note => 
                    note && typeof note === 'object' && (note.title || note.content)
                );

                if (validNotes.length === 0) {
                    alert('No valid notes found in the file!');
                    return;
                }

                const existingIds = new Set(this.notes.map(note => note.id));
                const newNotes = validNotes.filter(note => !existingIds.has(note.id));
                
                this.notes = [...newNotes, ...this.notes];
                this.saveToLocalStorage();
                this.renderNotesList();
                
                alert(`Successfully imported ${newNotes.length} notes!`);
            } catch (error) {
                alert('Error importing file. Please check the format and try again.');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    applyTheme() {
        const themeButton = document.getElementById('theme-toggle');
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            themeButton.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeButton.textContent = '🌙';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuickNote();
});