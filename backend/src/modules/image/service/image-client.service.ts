import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageClientService {
    private containerClient!: ContainerClient;

    constructor(private readonly _configService: ConfigService) {
        this.initContainerClient(_configService);
    }

    async saveImage(image: Express.Multer.File, fileNamePrefix: string, fileExtension: string): Promise<string> {
        const blobName = this.generateName(fileNamePrefix, fileExtension);
        const imageB64 = image.buffer.toString('base64');
        console.log(image.buffer.toString('utf8'))
        const blobClient = this.containerClient.getBlockBlobClient(blobName)
        const uploadResponse = await blobClient.upload(imageB64, imageB64.length);
        if (uploadResponse.errorCode) throw new InternalServerErrorException(null, 'Something went wrong saving your kudo');
        return blobClient.url;
    }

    deleteImage(imageUrl: string): void {
        const blobName = imageUrl.replace(this._configService.get<string>('BLOB_BASE_URL_DEV')!, "");
        const blobClient = this.containerClient.getBlockBlobClient(blobName);
        blobClient.deleteIfExists()
    }

    async getImage(imageUrl: string): Promise<string> {
        const blobName = imageUrl.replace(this._configService.get<string>('BLOB_BASE_URL_DEV')!, "");
        const blobClient = this.containerClient.getBlockBlobClient(blobName);
        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) throw new InternalServerErrorException(null, 'Something went wrong getting your from blob kudo');
        return (await this.streamToString(downloadBlockBlobResponse.readableStreamBody)).toString();
    }

    private initContainerClient(configService: ConfigService): void {
        const blobServiceClient = BlobServiceClient.fromConnectionString(configService.get<string>('BLOB_CONNECTION_STRING')!);
        this.containerClient = blobServiceClient.getContainerClient(configService.get<string>('BLOB_CONTAINER_NAME')!);
    }

    private generateName(fileNamePrefix: string, fileExtension: string): string {
        return `${fileNamePrefix}-${uuid()}.${fileExtension}`
    }

    private async streamToString(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            readableStream.on("data", (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on("end", () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on("error", reject);
        });
    }
}

