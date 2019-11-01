export class Note {
    _id: string;

    title: string;

    constructor(_id: string, title: string) {
        this._id = _id;
        this.title = title;
    }
}
