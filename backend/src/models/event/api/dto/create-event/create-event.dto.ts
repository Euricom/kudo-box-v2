export class CreateEventDto {
    constructor(
        readonly title: string,
        readonly isMainEvent: boolean,
        readonly eventImage: Express.Multer.File,

        readonly hostId: string,
        readonly newTagName: string,
        readonly eventIds?: string[],
    ) { }
}
