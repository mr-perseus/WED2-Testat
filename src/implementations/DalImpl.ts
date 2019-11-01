import { injectable } from 'inversify';
import * as Nedb from 'nedb';
import { Dal } from '../interfaces/Dal';
import { Note } from '../constants/models/Note';

type Reject = (reason?: {}) => void;

type Resolve<T> = (value?: T | PromiseLike<T>) => void;

@injectable()
export class DalImpl implements Dal {
    private readonly database: Nedb;

    constructor() {
        this.database = new Nedb({
            filename: 'store.db',
            autoload: true,
        });
    }

    public getNoteById(id: string): Promise<Note> {
        return new Promise<Note>(
            (resolve: Resolve<Note>, reject: Reject): void => {
                this.database.findOne({ _id: id }, (err: Error, note: Note) => {
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
                this.database.find(query, (err: Error, note: Note[]) => {
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
                this.database.insert(note, (err: Error, returnedNote: Note) => {
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
                this.database.update(
                    // eslint-disable-next-line no-underscore-dangle
                    { _id: note._id },
                    {
                        $set: {
                            title: note.title,
                            description: note.description,
                            priority: note.importance,
                            dueDate: note.dueDate,
                            isFinished: note.finished,
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
