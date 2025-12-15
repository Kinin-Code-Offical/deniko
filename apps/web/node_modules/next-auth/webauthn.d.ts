import type { ProviderId } from "@auth/core/providers";
import type { SignInAuthorizationParams, SignInOptions, SignInResponse } from "./lib/client.js";
/**
 * Initiate a WebAuthn signin flow.
 * @see https://authjs.dev/getting-started/authentication/webauthn
 */
export declare function signIn(provider?: ProviderId, options?: SignInOptions<true>, authorizationParams?: SignInAuthorizationParams): Promise<void>;
export declare function signIn(provider?: ProviderId, options?: SignInOptions<false>, authorizationParams?: SignInAuthorizationParams): Promise<SignInResponse>;
//# sourceMappingURL=webauthn.d.ts.map