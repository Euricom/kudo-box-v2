import { InteractionRequiredAuthError, SilentRequest } from "@azure/msal-browser";
import { useAccount, useMsal } from "@azure/msal-react";
import { loginRequest } from "../components/AzureAD";

export const useGetAccessToken = () => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || null);

    const getAccessToken = async (): Promise<string | void> => {
        const accountJwtRequest = {...loginRequest, account} as SilentRequest;
        try {
            return (await instance.acquireTokenSilent(accountJwtRequest)).accessToken;
        } catch(e) {
            if(e instanceof InteractionRequiredAuthError) return instance.acquireTokenRedirect(accountJwtRequest);
        }
    }

    return {
        getAccessToken
    };
}