
export class EventDto {
    readonly id: string;
    readonly title: string;
    readonly isMainEvent: boolean;
    readonly creationDate: string;
    readonly active: boolean;
    readonly eventImage: string;
    readonly tagName?: string;

    constructor(id: string, title: string, isMainEvent: boolean, creationDate: string, active: boolean, eventImage: string, tagName?: string) {
        this.id = id;
        this.title = title;
        this.isMainEvent = isMainEvent;
        this.creationDate = creationDate;
        this.active = active;
        this.eventImage = eventImage;
        this.tagName = tagName;
    }
}