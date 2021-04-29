import { BlobServiceClient, BlockBlobUploadResponse, ContainerClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid} from 'uuid';

@Injectable()
export class ImageClientService {
    private containerClient: ContainerClient;

    constructor(configService: ConfigService) {
        this.initContainerClient(configService);
    }

    async saveImage(image: Express.Multer.File): Promise<string> {
        const blobName = this.generateName();
        const imageB64 = image.buffer.toString('base64');

        const blobClient = this.containerClient.getBlockBlobClient(blobName)
        return blobClient.upload(imageB64, imageB64.length)
            .then((_) => blobClient.url);
    }

    async deleteImage(imageUrl: string): Promise<void> {
        const blobName = imageUrl.replace(process.env.BLOB_BASE_URL_DEV, "");
        const blobClient = this.containerClient.getBlockBlobClient(blobName);
        blobClient.deleteIfExists()
    }

    private initContainerClient(configService: ConfigService): void {
        const blobServiceClient = BlobServiceClient.fromConnectionString(configService.get<string>('BLOB_CONNECTION_STRING'));
        this.containerClient = blobServiceClient.getContainerClient(configService.get<string>('BLOB_CONTAINER_NAME'));
    }

    private generateName(): string {
        return `kudo-${uuid()}.webp`
    }
}
