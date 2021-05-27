import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ImageClientService } from "../../modules/image/service/image-client.service";
import { ImageEntity } from "./image-entity.entity";
import { KudoRepository } from "../kudo/data-access/kudo.repository";
import { EventRepository } from "../event/data-access/event/event.repository";

export abstract class ImageEntityService<Entity extends ImageEntity> {
    constructor(
        private readonly imageClient: ImageClientService,
        protected readonly repo: Repository<Entity>
    ) { }

    async createImageEntity(entity: Entity, image: Express.Multer.File): Promise<Entity> {
        const imageName = this.generateFileNamePrefix()
        const fileExtension = this.getFileExtensionFromMimeType(image.mimetype)
        if (!imageName || !fileExtension) throw new BadRequestException('Could not create imageName or fileExtension');
        entity.imageUrl = await this.imageClient.saveImage(image, imageName, fileExtension);

        try {
            return this.repo.save({ ...entity } as any);
        } catch (e) {
            await this.imageClient.deleteImage(entity.imageUrl);
            throw new InternalServerErrorException(null, 'Something went wrong saving your kudo');
        }
    }

    async deleteImageEntity(imageUrl: string): Promise<void> {
        await this.imageClient.deleteImage(imageUrl);
    }

    private generateFileNamePrefix(): string | undefined {
        if (this.repo instanceof KudoRepository) return 'kudo';
        if (this.repo instanceof EventRepository) return 'event';
        return;
    }

    private getFileExtensionFromMimeType(mimeType: string): string | undefined {
        if (mimeType && mimeType.match(/^image\//)) return mimeType.replace(/^.*\//, "");
        return;
    }
}