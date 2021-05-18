export class EventTagDto {
    readonly eventId: string;
    readonly eventTitle: string;
    readonly tagName: string;

    constructor(eventId: string, eventTitle: string, tagName: string) {
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.tagName = tagName;
    }
}