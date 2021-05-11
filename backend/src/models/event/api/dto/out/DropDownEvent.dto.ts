import { ApiProperty } from "@nestjs/swagger";

export class DropDownEventDto {
    readonly id: string;
    readonly title: string;

    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }
}