
export class EventDto {
    readonly id: string;
    readonly title: string;
    readonly isMainEvent: boolean;
    readonly creationDate: string;
    readonly eventImage: string;
    readonly tagName?: string;

    constructor(id: string, title: string, isMainEvent: boolean, creationDate: string, eventImage: string, tagName?: string) {
        this.id = id;
        this.title = title;
        this.isMainEvent = isMainEvent;
        this.creationDate = creationDate;
        this.eventImage = eventImage;
        this.tagName = tagName;
    }
}