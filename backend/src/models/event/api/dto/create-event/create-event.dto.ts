export class CreateEventDto {
    readonly title: string;
    readonly isMainEvent: boolean;
    readonly eventImage: Express.Multer.File;

    readonly hostId: string;
    readonly tagIds: string[];
}
