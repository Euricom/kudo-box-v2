import { HttpCode, HttpStatus, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiInternalServerErrorResponse, ApiResponse } from "@nestjs/swagger";

export const CreateKudoApi = () => {
    const interceptorFn = UseInterceptors(FileInterceptor('kudoImage', { limits: { fileSize: parseInt(process.env.IMAGE_MAX_SIZE!) } }));
    const httpCodeFn = HttpCode(HttpStatus.CREATED);

    // Swagger decorators config
    const apiInternalServerErrorFn = ApiInternalServerErrorResponse({ description: 'internal server error' });
    const apiResponseFn = ApiResponse({ status: HttpStatus.CREATED, headers: { Location: { description: 'location to fetch created kudo' } } });
    const apiConsumesFn = ApiConsumes('multipart/form-data');

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        interceptorFn(target, key, descriptor);
        httpCodeFn(target, key, descriptor);

        apiInternalServerErrorFn(target, key, descriptor);
        apiResponseFn(target, key, descriptor);
        apiConsumesFn(target, key, descriptor);
    }
};
