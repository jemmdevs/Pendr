'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Plus, Trash2, Edit, Check, X, Save } from 'lucide-react';

export default function NoteTaking() {
  const { isSignedIn, user } = useUser();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    // Function to load notes from localStorage
    const loadNotes = () => {
      try {
        const userId = isSignedIn && user ? user.id : 'anonymous';
        const savedNotes = localStorage.getItem(`notes-${userId}`);
        
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          setNotes(parsedNotes);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading notes:', error);
        setNotes([]);
        setIsLoaded(true);
      }
    };

    // Only proceed if we have determined the user state (signed in or not)
    if (typeof isSignedIn !== 'undefined') {
      loadNotes();
    }
  }, [isSignedIn, user]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    // Only save if notes have been loaded from localStorage
    if (isLoaded && typeof isSignedIn !== 'undefined') {
      try {
        const userId = isSignedIn && user ? user.id : 'anonymous';
        localStorage.setItem(`notes-${userId}`, JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  }, [notes, isSignedIn, user, isLoaded]);

  // Add a new note
  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: Date.now().toString(),
        content: newNote.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      
      const updatedNotes = [...notes, newNoteObj];
      setNotes(updatedNotes);
      
      // Save immediately to localStorage as well
      try {
        const userId = isSignedIn && user ? user.id : 'anonymous';
        localStorage.setItem(`notes-${userId}`, JSON.stringify(updatedNotes));
      } catch (error) {
        console.error('Error saving new note:', error);
      }
      
      setNewNote('');
    }
  };

  // Delete a note
  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    // Save immediately to localStorage
    try {
      const userId = isSignedIn && user ? user.id : 'anonymous';
      localStorage.setItem(`notes-${userId}`, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving after delete:', error);
    }
    
    // If currently editing this note, cancel editing
    if (editingNote === id) {
      setEditingNote(null);
    }
  };

  // Toggle note completion status
  const handleToggleComplete = (id) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    
    setNotes(updatedNotes);
    
    // Save immediately to localStorage
    try {
      const userId = isSignedIn && user ? user.id : 'anonymous';
      localStorage.setItem(`notes-${userId}`, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving after toggle:', error);
    }
  };

  // Start editing a note
  const handleEditStart = (note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  // Save edited note
  const handleEditSave = () => {
    if (editContent.trim()) {
      const updatedNotes = notes.map(note => 
        note.id === editingNote 
          ? { ...note, content: editContent.trim() } 
          : note
      );
      
      setNotes(updatedNotes);
      
      // Save immediately to localStorage
      try {
        const userId = isSignedIn && user ? user.id : 'anonymous';
        localStorage.setItem(`notes-${userId}`, JSON.stringify(updatedNotes));
      } catch (error) {
        console.error('Error saving after edit:', error);
      }
    }
    setEditingNote(null);
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingNote(null);
  };

  // Filter notes based on current filter
  const filteredNotes = notes.filter(note => {
    if (filter === 'all') return true;
    if (filter === 'active') return !note.completed;
    if (filter === 'completed') return note.completed;
    return true;
  });

  // Get counts for filter tabs
  const counts = {
    all: notes.length,
    active: notes.filter(note => !note.completed).length,
    completed: notes.filter(note => note.completed).length
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Add new note form */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-gray-800 bg-white"
          />
          <button
            onClick={handleAddNote}
            className="bg-[#3B82F6] text-white px-4 py-2 rounded-md hover:bg-[#2563EB] transition-colors flex items-center gap-1"
          >
            <Plus size={18} />
            Add Note
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium ${
            filter === 'all'
              ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All ({counts.all})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 font-medium ${
            filter === 'active'
              ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active ({counts.active})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-medium ${
            filter === 'completed'
              ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed ({counts.completed})
        </button>
      </div>

      {/* Notes list */}
      <div className="space-y-3">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <div 
              key={note.id}
              className={`p-4 rounded-md border ${
                note.completed 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-300'
              }`}
            >
              {editingNote === note.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-gray-800 bg-white"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="px-3 py-1 rounded-md bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors flex items-center gap-1"
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={note.completed}
                      onChange={() => handleToggleComplete(note.id)}
                      className="h-5 w-5 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`mb-1 ${note.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditStart(note)}
                      className="p-1 text-gray-500 hover:text-[#3B82F6] transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No notes found. Add a new note to get started!
          </div>
        )}
      </div>

      {/* Clear completed notes button */}
      {counts.completed > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              const updatedNotes = notes.filter(note => !note.completed);
              setNotes(updatedNotes);
              
              // Save immediately to localStorage
              try {
                const userId = isSignedIn && user ? user.id : 'anonymous';
                localStorage.setItem(`notes-${userId}`, JSON.stringify(updatedNotes));
              } catch (error) {
                console.error('Error saving after clearing completed:', error);
              }
            }}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Clear completed notes
          </button>
        </div>
      )}

      {/* Debug info - only visible during development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 border border-gray-300 rounded text-xs text-gray-500">
          <p>Storage Key: notes-{isSignedIn && user ? user.id : 'anonymous'}</p>
          <p>Notes Count: {notes.length}</p>
          <p>Is Loaded: {isLoaded ? 'Yes' : 'No'}</p>
        </div>
      )}

      {/* User information */}
      <div className="mt-8 text-sm text-gray-500 text-center">
        {isSignedIn ? (
          <p>Notes synced for {user.firstName || 'user'} ({user.primaryEmailAddress?.emailAddress})</p>
        ) : (
          <p>Sign in to sync your notes across devices</p>
        )}
      </div>
    </div>
  );
} 