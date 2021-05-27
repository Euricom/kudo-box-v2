import { GraphClient, GraphUser, TokenResponse, GraphResponse } from "./graph-client"
import { v4 as uuid } from 'uuid';
import { Test } from "@nestjs/testing";
import { UserService } from "../../../models/user/service/user.service";
import { HttpModule, HttpService } from "@nestjs/common";
import { AxiosResponse } from 'axios';
import { of } from "rxjs";
import { User } from "../../../models/user/entities/user.entity";
import { AppConfigModule } from "../../../config/app-config.module";

describe('GraphClient', () => {
    let graphClient: GraphClient;
    let userService: UserService;
    let httpService: HttpService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [HttpModule, AppConfigModule],
            providers: [
                GraphClient,
                {
                    provide: UserService,
                    useValue: {
                        addUsers: jest.fn()
                    }
                },
                {
                    provide: HttpService,
                    useValue: {
                        post: jest.fn()
                    }
                }
            ]
        }).compile();

        graphClient = module.get<GraphClient>(GraphClient);
        userService = module.get<UserService>(UserService);
        httpService = module.get<HttpService>(HttpService);
    })

    describe('addNewUser', () => {
        it('Correct token requests new users and persists these - valid', () => {
            const graphUser1: GraphUser = {
                id: uuid(),
                displayName: 'Tim François',
                givenName: 'Tim',
                userPrincipalName: 'tim@euri.com'
            }

            const graphUser2: GraphUser = {
                id: uuid(),
                displayName: 'Lennert Moorthamer',
                givenName: 'Lennert',
                userPrincipalName: 'lennert@euri.com'
            }

            jest.spyOn(httpService, 'post').mockImplementationOnce(() => {
                const requestTokenRes: AxiosResponse<any> = {
                    data: {
                        access_token: 'valid_token',
                        expires_in: 100000,
                        token_type: 'Bearer'
                    } as TokenResponse,
                    headers: {},
                    status: 200,
                    statusText: 'OK',
                    config: {}
                }

                return of(requestTokenRes)
            })

            jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
                const requestNewUsersRes: AxiosResponse<any> = {
                    data: {
                        '@odata.nextLink': undefined,
                        value: [graphUser1, graphUser2]
                    },
                    headers: {},
                    status: 200,
                    statusText: 'OK',
                    config: {}
                }

                return of(requestNewUsersRes);
            })

            jest.spyOn(userService, 'addUsers').mockImplementation((newUsers: User[]): Promise<User[]> => {
                expect(newUsers.length).toBe(2);

                expect(newUsers[0].id).toBe(graphUser1.id);
                expect(newUsers[0].firstname).toBe(graphUser1.givenName);
                expect(newUsers[0].lastname).toBe('François');
                expect(newUsers[0].email).toBe(graphUser1.userPrincipalName);

                expect(newUsers[1].id).toBe(graphUser2.id);
                expect(newUsers[1].firstname).toBe(graphUser2.givenName);
                expect(newUsers[1].lastname).toBe('Moorthamer');
                expect(newUsers[1].email).toBe(graphUser2.userPrincipalName);

                return Promise.resolve(newUsers);
            })

            graphClient.addNewUsers();

        })
    })
})