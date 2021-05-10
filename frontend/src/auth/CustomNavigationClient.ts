import { NavigationClient } from "@azure/msal-browser";
import { NextRouter } from "next/router";

export class CustomNavigationClient extends NavigationClient {
    private router: NextRouter;

    constructor(router: NextRouter) {
        super();
        this.router = router;
    }

    // TYPE OF OPTIONS???
    async navigateInternal(url: string, options: any) {
        const relativePath = url.replace(window.location.origin, '');
        if(options.noHistory) this.router.replace(relativePath);
        else this.router.push(relativePath);

        return false;
    }
}