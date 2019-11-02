import { injectable } from 'inversify';
import * as Nedb from 'nedb';
import { Dal } from '../interfaces/Dal';
import { Note } from '../constants/models/Note';

const database: Nedb = new Nedb({
    filename: './store.db',
    autoload: true,
});

type Reject = (reason?: {}) => void;

type Resolve<T> = (value?: T | PromiseLike<T>) => void;

@injectable()
export class DalImpl implements Dal {
    public getNoteById(id: string): Promise<Note> {
        return new Promise<Note>(
            (resolve: Resolve<Note>, reject: Reject): void => {
                database.findOne({ _id: id }, (err: Error, note: Note) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(note);
                });
            },
        );
    }

    public getNotes(query: unknown = {}): Promise<Note[]> {
        return new Promise<Note[]>(
            (resolve: Resolve<Note[]>, reject: Reject): void => {
                database.find(query, (err: Error, note: Note[]) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(note);
                });
            },
        );
    }

    private createNote(note: Note): Promise<void> {
        return new Promise<void>(
            (resolve: Resolve<void>, reject: Reject): void => {
                database.insert(note, (err: Error, returnedNote: Note) => {
                    if (err || !returnedNote) {
                        reject(err);
                    }

                    resolve();
                });
            },
        );
    }

    private updateNote(note: Note): Promise<void> {
        return new Promise<void>(
            (resolve: Resolve<void>, reject: Reject): void => {
                database.update(
                    // eslint-disable-next-line no-underscore-dangle
                    { _id: note._id },
                    {
                        $set: {
                            title: note.title,
                            description: note.description,
                            importance: note.importance,
                            dueDate: note.dueDate,
                            finished: note.finished,
                            modifiedDate: new Date(),
                        },
                    },
                    {},
                    (err: Error, numberOfUpdated: number, upsert: boolean) => {
                        if (err || numberOfUpdated !== 1 || upsert) {
                            reject(err);
                        }

                        resolve();
                    },
                );
            },
        );
    }

    public async createOrUpdateNote(note: Note): Promise<void> {
        // eslint-disable-next-line no-underscore-dangle
        if (!note._id) {
            await this.createNote(note);
        } else {
            await this.updateNote(note);
        }
    }
}
