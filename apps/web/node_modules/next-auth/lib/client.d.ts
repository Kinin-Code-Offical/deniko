import * as React from "react";
import type { ProviderId, ProviderType } from "@auth/core/providers";
import type { Session } from "@auth/core/types";
import { AuthError } from "@auth/core/errors";
/** @todo */
export declare class ClientSessionError extends AuthError {
}
export interface AuthClientConfig {
    baseUrl: string;
    basePath: string;
    baseUrlServer: string;
    basePathServer: string;
    /** Stores last session response */
    _session?: Session | null | undefined;
    /** Used for timestamp since last sycned (in seconds) */
    _lastSync: number;
    /**
     * Stores the `SessionProvider`'s session update method to be able to
     * trigger session updates from places like `signIn` or `signOut`
     */
    _getSession: (...args: any[]) => any;
}
export interface UseSessionOptions<R extends boolean> {
    required: R;
    /** Defaults to `signIn` */
    onUnauthenticated?: () => void;
}
export interface ClientSafeProvider {
    id: ProviderId;
    name: string;
    type: ProviderType;
    signinUrl: string;
    callbackUrl: string;
    redirectTo: string;
}
export interface SignInOptions<Redirect extends boolean = true> extends Record<string, unknown> {
    /** @deprecated Use `redirectTo` instead. */
    callbackUrl?: string;
    /**
     * Specify where the user should be redirected to after a successful signin.
     *
     * By default, it is the page the sign-in was initiated from.
     */
    redirectTo?: string;
    /**
     * You might want to deal with the signin response on the same page, instead of redirecting to another page.
     * For example, if an error occurs (like wrong credentials given by the user), you might want to show an inline error message on the input field.
     *
     * For this purpose, you can set this to option `redirect: false`.
     */
    redirect?: Redirect;
}
export interface SignInResponse {
    error: string | undefined;
    code: string | undefined;
    status: number;
    ok: boolean;
    url: string | null;
}
/** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1) */
export interface SignOutResponse {
    url: string;
}
export interface SignOutParams<Redirect extends boolean = true> {
    /** @deprecated Use `redirectTo` instead. */
    callbackUrl?: string;
    /**
     * If you pass `redirect: false`, the page will not reload.
     * The session will be deleted, and `useSession` is notified, so any indication about the user will be shown as logged out automatically.
     * It can give a very nice experience for the user.
     */
    redirectTo?: string;
    /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
    redirect?: Redirect;
}
/**
 
 * If you have session expiry times of 30 days (the default) or more, then you probably don't need to change any of the default options.
 *
 * However, if you need to customize the session behavior and/or are using short session expiry times, you can pass options to the provider to customize the behavior of the {@link useSession} hook.
 */
export interface SessionProviderProps {
    children: React.ReactNode;
    session?: Session | null;
    baseUrl?: string;
    basePath?: string;
    /**
     * A time interval (in seconds) after which the session will be re-fetched.
     * If set to `0` (default), the session is not polled.
     */
    refetchInterval?: number;
    /**
     * `SessionProvider` automatically refetches the session when the user switches between windows.
     * This option activates this behaviour if set to `true` (default).
     */
    refetchOnWindowFocus?: boolean;
    /**
     * Set to `false` to stop polling when the device has no internet access offline (determined by `navigator.onLine`)
     *
     * [`navigator.onLine` documentation](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine)
     */
    refetchWhenOffline?: false;
}
//# sourceMappingURL=client.d.ts.map