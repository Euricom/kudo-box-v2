import { HttpService, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserMapper } from "src/models/user/api/mapper/user-mapper";
import { UserService } from "src/models/user/service/user.service";
import { ConfigVarNotFoundError } from "src/models/utils/exception/config-var-not-found.error";

interface TokenResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
}

export interface GraphUser {
    id: string;
    displayName: string;
    givenName: string;
    userPrincipalName: string;
}

interface GraphResponse {
    '@odata.nextLink': string;
    value: GraphUser[]
}

@Injectable()
export class GraphClient {
    private tokenUrl!: string;
    private appId!: string;
    private appSecret!: string;
    private graphScope!: string;
    private usersBaseUrl!: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly userService: UserService,
        configService: ConfigService
    ) {
        this.getEnvVars(configService);
    }

    async scheduledNewUserChecks() {
        const token = await this.requestToken();
        const newUsers = (await this.getNewTenantUsers(token, [], undefined)).map(gu => UserMapper.fromGraphUser(gu));
        
        this.userService.addUsers(newUsers);
    }

    private async getNewTenantUsers(token: string, graphUsers: GraphUser[], nextPageUrl?: string): Promise<GraphUser[]> {
        const url = this.generateUrl(nextPageUrl);

        const response = await this.httpService.get<GraphResponse>(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).toPromise()

        const newUsers = graphUsers.concat(response.data.value)

        // Recursive call
        if(response.data["@odata.nextLink"]) return this.getNewTenantUsers(token, newUsers, response.data["@odata.nextLink"])
        return newUsers;
    }

    private generateUrl(nextPageUrl?: string): string {
        if(nextPageUrl) return nextPageUrl;

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1)

        return nextPageUrl ? nextPageUrl : `${this.usersBaseUrl}${yesterday.toISOString()}`
    }

    private async requestToken(): Promise<string> {
        const data = {
            client_id: this.appId,
            scope: this.graphScope,
            client_secret: this.appSecret,
            grant_type: 'client_credentials'
        };

        const tokenResponse = await this.httpService.post<TokenResponse>(this.tokenUrl, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).toPromise();

        return tokenResponse.data.access_token;
    }

    private getEnvVars(configService: ConfigService): void {
        const url = configService.get('AAD_TOKEN_ENDPOINT')
        if(!url) throw new ConfigVarNotFoundError('Config variable AAD_TOKEN_ENDPOINT NOT FOUND');
        this.tokenUrl = url;

        const id = configService.get('AAD_APP_ID');
        if(!id) throw new ConfigVarNotFoundError('Config variable AAD_APP_ID NOT FOUND');
        this.appId = id;

        const secret = configService.get('AAD_APP_SECRET');
        if(!secret) throw new ConfigVarNotFoundError('Config variable AAD_APP_SECRET NOT FOUND');
        this.appSecret = secret;

        const scope = configService.get('AAD_GRAPH_SCOPE');
        if(!scope) throw new ConfigVarNotFoundError('Config variable AAD_GRAPH_SCOPE NOT FOUND')
        this.graphScope = scope;

        const baseUrl = configService.get('AAD_GRAPH_GET_USERS_BASE_URL');
        if(!baseUrl) throw new ConfigVarNotFoundError('Config variable AAD_GRAPH_GET_USERS_BASE_URL NOT FOUND')
        this.usersBaseUrl = baseUrl;
    }
}