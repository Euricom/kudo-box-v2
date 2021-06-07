export interface Event {
    id: string;
    title: string;
    isMainEvent: boolean;
    creationDate: string;
    active: boolean;
    eventImage: string;
    tagName?: string;
}