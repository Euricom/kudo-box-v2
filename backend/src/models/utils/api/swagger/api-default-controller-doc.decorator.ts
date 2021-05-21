import { ApiHeader, ApiTags } from "@nestjs/swagger"

export const ApiDefaultControllerDoc = (tag: string) => {
    const apiTagFn = ApiTags(tag);
    const apiAuthorizationHeaderFn = ApiHeader({ name: 'Authorization', description: 'Azure AD JWT token' })

    return function(target: any) {
        apiTagFn(target);
        apiAuthorizationHeaderFn(target);
    }
}