import { HttpCode, HttpStatus, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiResponse } from "@nestjs/swagger";

export const CreateEventApi = (): MethodDecorator => {
    const interceptorFn = UseInterceptors(FileInterceptor('eventImage', {limits: {fileSize: parseInt(process.env.IMAGE_MAX_SIZE)}}));
    const httpCodeFn = HttpCode(HttpStatus.CREATED);

    const apiResponseFn = ApiResponse({ status: HttpStatus.CREATED, headers: {Location: {description: 'location to fetch created event'}}});
    const apiConsumesFn = ApiConsumes('multipart/form-data');

    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        interceptorFn(target, key, descriptor);
        httpCodeFn(target, key, descriptor);

        apiResponseFn(target, key, descriptor);
        apiConsumesFn(target, key, descriptor);
    }
};
