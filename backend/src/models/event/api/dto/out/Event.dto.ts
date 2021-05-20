
export class EventDto {
    readonly id: string;
    readonly title: string;
    readonly isMainEvent: boolean;
    readonly tagName?: string;

    constructor(id: string, title: string, isMainEvent: boolean, tagName?: string) {
        this.id = id;
        this.title = title;
        this.isMainEvent = isMainEvent;
        this.tagName = tagName;
    }
}