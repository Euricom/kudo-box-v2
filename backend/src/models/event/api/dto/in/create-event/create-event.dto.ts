import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty({ message: 'Title is required' })
    @MaxLength(20, { message: 'Title cannot be longer than 20 characters' })
    readonly title: string;
    @ApiProperty({ type: 'string', format: 'binary' })
    readonly eventImage: Express.Multer.File;
    @IsNotEmpty()
    readonly isMainEvent: string;

    @IsNotEmpty({ message: 'Tag is required' })
    @MaxLength(20, { message: 'Tag can not be longer than 20 characters' })
    readonly newTagName: string;
    @ApiProperty({ type: 'uuid' })
    readonly mainEventId?: string;

    constructor(
        title: string, 
        eventImage: Express.Multer.File,
        isMainEvent: string,
        newTagName: string,
        eventIds?: string
    ) {
        this.title = title;
        this.eventImage = eventImage;
        this.isMainEvent = isMainEvent;
        this.newTagName = newTagName;
        this.mainEventId = eventIds;
    }
}
