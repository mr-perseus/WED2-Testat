import { Note } from '../constants/models/Note';

export interface Dal {
    getNoteById(id: string): Promise<Note>;
}
