import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty({ message: 'Title is required' })
    @MaxLength(20, { message: 'Title cannot be longer than 20 characters' })
    readonly title: string;
    @ApiProperty({ type: 'string', format: 'binary' })
    readonly eventImage: Express.Multer.File;
    @IsNotEmpty()
    readonly isMainEvent: string;

    @IsNotEmpty({ message: 'hostId is required' })
    @IsUUID(4, { message: 'hostId is not a valid UUID' })
    @ApiProperty({ type: 'uuid' })
    readonly hostId: string;
    @IsNotEmpty({ message: 'Tag is required' })
    @MaxLength(20, { message: 'Tag can not be longer than 20 characters' })
    readonly newTagName: string;
    @ApiProperty({ type: 'uuid' })
    readonly mainEventId?: string;

    constructor(
        title: string, 
        eventImage: Express.Multer.File,
        isMainEvent: string,
        hostId: string, 
        newTagName: string,
        eventIds?: string
    ) {
        this.title = title;
        this.eventImage = eventImage;
        this.isMainEvent = isMainEvent;
        this.hostId = hostId;
        this.newTagName = newTagName;
        this.mainEventId = eventIds;
    }
}
