import { Configuration } from "@azure/msal-browser"

export const msalConfig = {
    auth: {
        clientId: '520f1246-722b-41f7-8159-e052d24378dd',
        authority: 'https://login.microsoftonline.com/0b53d2c1-bc55-4ab3-a161-927d289257f2',
        postLogoutRedirectUri: '/'
    }
} as Configuration

export const loginRequest = {
    scopes: ['User.Read']
}
