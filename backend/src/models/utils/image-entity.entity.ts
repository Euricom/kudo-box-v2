import { Column } from "typeorm";

export abstract class ImageEntity {
    @Column({name: 'imageUrl', nullable: true})
    imageUrl?: string

    constructor(imageUrl?: string) {
        this.imageUrl = imageUrl;
    }
}