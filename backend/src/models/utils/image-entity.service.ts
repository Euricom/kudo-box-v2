import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ImageClientService } from "../kudo/service/image-client.service";
import { ImageEntity } from "./image-entity.entity";

export abstract class ImageEntityService<Entity extends ImageEntity> {
    constructor(
        private readonly imageClient: ImageClientService,
        private readonly repo: Repository<Entity>
    ) {}

    async create(entity: Entity, image: Express.Multer.File): Promise<Entity> {
        entity.imageUrl = await this.imageClient.saveImage(image);

        try {
            return this.repo.save(entity as any);
        } catch(e) {
            await this.imageClient.deleteImage(entity.imageUrl);
            throw new InternalServerErrorException(null, 'Something went wrong saving your kudo');
        }
    }
}