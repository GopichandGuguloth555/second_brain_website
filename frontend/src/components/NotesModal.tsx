import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Pencil, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { viewContent, createContent, updateContent, deleteContent } from '../lib/api';
import type { Content } from '../lib/api';
import { ModalOverlay, DarkCard, btnOutline, btnPrimary, btnDanger, inputDark } from './ui/theme';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NoteForm {
  title: string;
  link: string;
}

export const NotesModal = ({ isOpen, onClose }: NotesModalProps) => {
  const [notes, setNotes] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<NoteForm>({ title: '', link: '' });

  const fetchNotes = useCallback(async () => {
    try {
      const data = await viewContent();
      setNotes(data.content.filter((c) => c.type === 'note'));
    } catch {
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError('');
      setShowForm(false);
      setEditingId(null);
      setDeleteConfirmId(null);
      setForm({ title: '', link: '' });
      fetchNotes();
    }
  }, [isOpen, fetchNotes]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const resetForm = () => {
    setForm({ title: '', link: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createContent(form.title, form.link, 'note');
      resetForm();
      await fetchNotes();
    } catch {
      setError('Failed to create note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError('');
    try {
      await updateContent(editingId, { title: form.title, link: form.link, type: 'note' });
      resetForm();
      await fetchNotes();
    } catch {
      setError('Failed to update note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await deleteContent(deleteConfirmId);
      setNotes((prev) => prev.filter((n) => n._id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch {
      setError('Failed to delete note. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const startEdit = (note: Content) => {
    setEditingId(note._id);
    setShowForm(true);
    setForm({ title: note.title, link: note.link });
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <ModalOverlay onClose={onClose} closeOnBackdrop>
      <DarkCard className="max-w-2xl w-full max-h-[90vh] flex flex-col my-4 sm:my-8">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">My Notes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
              <button onClick={() => setError('')} className="ml-2 text-red-300 hover:text-white">Dismiss</button>
            </div>
          )}

          {showForm && (
            <form onSubmit={editingId ? handleUpdate : handleCreate} className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Note' : 'New Note'}</h3>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputDark}
                  placeholder="Enter note title"
                  required
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Content</label>
                <textarea
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className={`${inputDark} resize-none`}
                  placeholder="Write your note here..."
                  rows={4}
                  required
                  disabled={saving}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={resetForm} disabled={saving} className={`flex-1 ${btnOutline} justify-center py-2.5`}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={`flex-1 ${btnPrimary} justify-center py-2.5 disabled:opacity-50`}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          )}

          {!showForm && (
            <button
              onClick={startCreate}
              className={`w-full mb-4 ${btnPrimary} justify-center py-3`}
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          )}

          {loading ? (
            <div className="text-center py-12 text-zinc-400">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-full mb-3">
                <FileText className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-zinc-400 text-sm">No notes yet. Create your first note above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-violet-500/30 transition-all"
                >
                  {editingId === note._id ? (
                    <form onSubmit={handleUpdate} className="space-y-3">
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className={inputDark}
                        placeholder="Title"
                        required
                        disabled={saving}
                      />
                      <textarea
                        value={form.link}
                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                        className={`${inputDark} resize-none`}
                        placeholder="Write your note here..."
                        rows={3}
                        required
                        disabled={saving}
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={resetForm} disabled={saving} className={`flex-1 ${btnOutline} justify-center py-2`}>
                          Cancel
                        </button>
                        <button type="submit" disabled={saving} className={`flex-1 ${btnPrimary} justify-center py-2 disabled:opacity-50`}>
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-white font-semibold line-clamp-1">{note.title || 'Untitled'}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEdit(note)}
                            className="p-1.5 text-zinc-400 hover:text-violet-400 hover:bg-white/5 rounded-lg transition-all"
                            title="Edit note"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(note._id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-zinc-300 text-sm whitespace-pre-wrap line-clamp-4">{note.link}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <DarkCard className="max-w-sm w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Delete note?</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleting}
                  className={`flex-1 ${btnOutline} justify-center py-2.5 disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`flex-1 ${btnDanger} justify-center py-2.5 bg-red-500/20 border-red-500/40 disabled:opacity-50`}
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </DarkCard>
          </div>
        )}
      </DarkCard>
    </ModalOverlay>
  );
};
