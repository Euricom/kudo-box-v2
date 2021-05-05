import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty({ message: 'Title is required' })
    @MaxLength(20, { message: 'Title cannot be longer than 20 characters' })
    readonly title: string;
    @IsNotEmpty({ message: 'isMainEvent is required' })
    readonly isMainEvent: boolean;
    // @IsNotEmpty({ message: 'eventImage is required' })
    @ApiProperty({ type: 'string', format: 'binary' })
    readonly eventImage: Express.Multer.File;

    @IsNotEmpty({ message: 'hostId is required' })
    @IsUUID(4, { message: 'hostId is not a valid UUID' })
    @ApiProperty({ type: 'uuid' })
    readonly hostId: string;
    @IsNotEmpty({ message: 'Tag is required' })
    @MaxLength(20, { message: 'Tag can not be longer than 20 characters' })
    readonly newTagName: string;
    readonly eventIds?: string[];

    constructor(
        title: string, 
        isMainEvent: boolean, 
        eventImage: Express.Multer.File, 
        hostId: string, 
        newTagName: string,
        eventIds?: string[]
    ) {
        this.title = title;
        this.isMainEvent = isMainEvent;
        this.eventImage = eventImage;
        this.hostId = hostId;
        this.newTagName = newTagName;
        this.eventIds = eventIds;
    }
}
