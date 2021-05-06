import { InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Event } from "../event/entities/event.entity";
import { Kudo } from "../kudo/entities/kudo.entity";
import { ImageClientService } from "../../modules/image/service/image-client.service";
import { ImageEntity } from "./image-entity.entity";

export abstract class ImageEntityService<Entity extends ImageEntity> {
    constructor(
        private readonly imageClient: ImageClientService,
        private readonly repo: Repository<Entity>
    ) {}

    async createImageEntity(entity: Entity, image: Express.Multer.File): Promise<Entity> {
        entity.imageUrl = await this.imageClient.saveImage(image, this.generateFileNamePrefix(), this.getFileExtensionFromMimeType(image.mimetype));

        try {
            return this.repo.save({...entity} as any);
        } catch(e) {
            await this.imageClient.deleteImage(entity.imageUrl);
            throw new InternalServerErrorException(null, 'Something went wrong saving your kudo');
        }
    }

    private generateFileNamePrefix() {
        if(this.repo.target === Kudo) return 'kudo';
        if(this.repo.target === Event) return 'event';
        return '';
    }

    private getFileExtensionFromMimeType(mimeType: string) {
        return mimeType.replace(/^.*\//, "");
    }
}