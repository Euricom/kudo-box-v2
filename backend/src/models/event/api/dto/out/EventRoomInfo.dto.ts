export class EventRoomInfoDto {
    title: string;
    tagName: string;
    firstnameHost: string;
    lastnameHost:string;

    constructor(title: string, tagName: string, firstnameHost: string, lastnameHost: string) {
        this.title = title;
        this.tagName = tagName;
        this.firstnameHost = firstnameHost;
        this.lastnameHost = lastnameHost;
    }
}