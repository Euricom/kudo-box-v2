import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid} from 'uuid';

@Injectable()
export class ImageClientService {
    private containerClient!: ContainerClient;

    constructor(private readonly _configService: ConfigService) {
        this.initContainerClient(_configService);
    }

    async saveImage(image: Express.Multer.File): Promise<string> {
        const blobName = this.generateName();
        const imageB64 = image.buffer.toString('base64');

        const blobClient = this.containerClient.getBlockBlobClient(blobName)
        const uploadResponse = await blobClient.upload(imageB64, imageB64.length);
        if(uploadResponse.errorCode) throw new InternalServerErrorException(null, 'Something went wrong saving your kudo');
        return blobClient.url;
    }

    deleteImage(imageUrl: string): void {
        const blobName = imageUrl.replace(this._configService.get<string>('BLOB_BASE_URL_DEV')!, "");
        const blobClient = this.containerClient.getBlockBlobClient(blobName);
        blobClient.deleteIfExists()
    }

    private initContainerClient(configService: ConfigService): void {
        const blobServiceClient = BlobServiceClient.fromConnectionString(configService.get<string>('BLOB_CONNECTION_STRING')!);
        this.containerClient = blobServiceClient.getContainerClient(configService.get<string>('BLOB_CONTAINER_NAME')!);
    }

    private generateName(): string {
        return `kudo-${uuid()}.webp`
    }
}
