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
}
