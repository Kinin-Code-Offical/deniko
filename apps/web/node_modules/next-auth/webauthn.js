import { apiBaseUrl } from "./lib/client.js";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { getCsrfToken, getProviders, __NEXTAUTH } from "./react.js";
const logger = {
    debug: console.debug,
    error: console.error,
    warn: console.warn,
};
/**
 * Fetch webauthn options from server and prompt user for authentication or registration.
 * Returns either the completed WebAuthn response or an error request.
 */
async function webAuthnOptions(providerID, nextAuthConfig, options) {
    const baseUrl = apiBaseUrl(nextAuthConfig);
    // @ts-expect-error
    const params = new URLSearchParams(options);
    const optionsResp = await fetch(`${baseUrl}/webauthn-options/${providerID}?${params}`);
    if (!optionsResp.ok) {
        return { error: optionsResp };
    }
    const optionsData = await optionsResp.json();
    if (optionsData.action === "authenticate") {
        const webAuthnResponse = await startAuthentication(optionsData.options);
        return { data: webAuthnResponse, action: "authenticate" };
    }
    else {
        const webAuthnResponse = await startRegistration(optionsData.options);
        return { data: webAuthnResponse, action: "register" };
    }
}
export async function signIn(provider, options, authorizationParams) {
    const { callbackUrl, ...rest } = options ?? {};
    const { redirectTo = callbackUrl ?? window.location.href, redirect = true, ...signInParams } = rest;
    const baseUrl = apiBaseUrl(__NEXTAUTH);
    const providers = await getProviders();
    if (!providers) {
        window.location.href = `${baseUrl}/error`;
        return; // TODO: Return error if `redirect: false`
    }
    if (!provider ||
        !providers[provider] ||
        providers[provider].type !== "webauthn") {
        // TODO: Add docs link with explanation
        throw new TypeError([
            `Provider id "${provider}" does not refer to a WebAuthn provider.`,
            'Please use `import { signIn } from "next-auth/react"` instead.',
        ].join("\n"));
    }
    const webAuthnBody = {};
    const webAuthnResponse = await webAuthnOptions(provider, __NEXTAUTH, signInParams);
    if (webAuthnResponse.error) {
        logger.error(new Error(await webAuthnResponse.error.text()));
        return;
    }
    webAuthnBody.data = JSON.stringify(webAuthnResponse.data);
    webAuthnBody.action = webAuthnResponse.action;
    const signInUrl = `${baseUrl}/callback/${provider}?${new URLSearchParams(authorizationParams)}`;
    const res = await fetch(signInUrl, {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Auth-Return-Redirect": "1",
        },
        body: new URLSearchParams({
            ...signInParams,
            ...webAuthnBody,
            csrfToken: await getCsrfToken(),
            callbackUrl: redirectTo,
        }),
    });
    const data = await res.json();
    if (redirect) {
        const url = data.url ?? callbackUrl;
        window.location.href = url;
        // If url contains a hash, the browser does not reload the page. We reload manually
        if (url.includes("#"))
            window.location.reload();
        return;
    }
    const error = new URL(data.url).searchParams.get("error");
    const code = new URL(data.url).searchParams.get("code");
    if (res.ok) {
        await __NEXTAUTH._getSession({ event: "storage" });
    }
    return {
        error,
        code,
        status: res.status,
        ok: res.ok,
        url: error ? null : data.url,
    };
}
