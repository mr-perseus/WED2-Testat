export class Note {
    _id: string;

    title: string;

    description: string;

    importance: number;

    dueDate: Date;

    finished: boolean;

    constructor(
        _id: string,
        title: string,
        descrption: string,
        importance: number,
        dueDate: Date,
        finished: boolean,
    ) {
        // eslint-disable-next-line no-underscore-dangle
        this._id = _id;
        this.title = title;
        this.description = descrption;
        this.importance = importance;
        this.dueDate = dueDate;
        this.finished = finished;
    }
}
