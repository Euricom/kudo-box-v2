import { Column } from "typeorm";

export abstract class ImageEntity {
    @Column({name: 'imageUrl', nullable: true})
    private _imageUrl?: string

    constructor(imageUrl?: string) {
        this._imageUrl = imageUrl;
    }

    get imageUrl() {
        return this._imageUrl;
    }

    set imageUrl(url) {
        this._imageUrl = url;
    }
}