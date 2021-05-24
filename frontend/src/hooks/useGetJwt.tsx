import { InteractionRequiredAuthError, SilentRequest } from "@azure/msal-browser";
import { useAccount, useMsal } from "@azure/msal-react";
import { loginRequest } from "../components/AzureAD";

export const useGetJwt = () => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || null);

    const getJwt = async (): Promise<string | undefined> => {
        try {
            const silentRequest = {...loginRequest, account} as SilentRequest;
            return (await instance.acquireTokenSilent(silentRequest)).accessToken;
        } catch(e) {
            if(e instanceof InteractionRequiredAuthError) return undefined;
        }
    }

    return getJwt;
}