
export class EventDto {
    readonly id: string;
    readonly title: string;
    readonly isMainEvent: boolean;
    readonly creationDate: string;
    readonly tagName?: string;

    constructor(id: string, title: string, isMainEvent: boolean, creationDate: string, tagName?: string) {
        this.id = id;
        this.title = title;
        this.isMainEvent = isMainEvent;
        this.creationDate = creationDate;
        this.tagName = tagName;
    }
}