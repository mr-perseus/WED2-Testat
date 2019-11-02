import * as moment from 'moment';
import boolean from 'boolean';

export interface NoteJson {
    _id: string | undefined;
    title: string;
    description: string;
    importance: string;
    dueDate: string;
    finished: string;
}

export class Note {
    _id: string | undefined;

    title: string;

    description: string;

    importance: number;

    dueDate: Date;

    createdDate: Date;

    modifiedDate: Date;

    finished: boolean;

    constructor(note: NoteJson) {
        Note.validateNote(note);

        // eslint-disable-next-line no-underscore-dangle
        this._id = note._id || undefined;
        this.title = note.title;
        this.description = note.description;
        this.importance = Number(note.importance);
        const date = moment(note.dueDate);
        this.dueDate = new Date(date.year(), date.month(), date.date());
        this.createdDate = new Date();
        this.modifiedDate = new Date();
        this.finished = boolean(note.finished);
    }

    private static validateNote(note: NoteJson): void {
        if (!note.title) {
            throw new Error('Title missing');
        }

        const importanceNumber = Number(note.importance);
        if (
            Number.isNaN(importanceNumber) ||
            importanceNumber < 1 ||
            importanceNumber > 5
        ) {
            throw new Error('importance is not between 1 and 5.');
        }

        if (!moment(note.dueDate).isValid()) {
            throw new Error('Date invalid');
        }
    }
}
