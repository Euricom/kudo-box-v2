export class Tag {
    private _id: string;
    private _name: string;

    private _events: Event[];

    constructor(id?: string, name?: string) {
        this._id = id;
        this._name = name;
    }
}
