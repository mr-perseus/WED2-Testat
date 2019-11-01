import { Note } from '../constants/models/Note';

export interface Dal {
    getNoteById(id: string): Promise<Note>;
    getNotes(query?: unknown): Promise<Note[]>;
    createOrUpdateNote(note: Note): Promise<void>;
}
