class QuickNote {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('quicknotes')) || [];
        this.currentNoteId = null;
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.renderNotesList();
        this.showEmptyState();
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
}

document.addEventListener('DOMContentLoaded', () => {
    new QuickNote();
});