export class CreateEventDto {
    readonly title: string;
    readonly isMainEvent: boolean;
    readonly eventImage: Express.Multer.File;

    readonly hostId: string;
    readonly eventIds: string[];
    readonly newTagName: string;
}
