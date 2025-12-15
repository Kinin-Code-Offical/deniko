/**
 *
 * NextAuth.js is the official integration of Auth.js for Next.js applications. It supports both
 * [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components) and the
 * [Pages Router](https://nextjs.org/docs/pages). It includes methods for signing in, signing out, hooks, and a React
 * Context provider to wrap your application and make session data available anywhere.
 *
 * For use in [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions), check out [these methods](https://authjs.dev/guides/upgrade-to-v5#methods)
 *
 * @module react
 */
import * as React from "react";
import type { ProviderId } from "@auth/core/providers";
import type { Session } from "@auth/core/types";
import type { AuthClientConfig, ClientSafeProvider, SessionProviderProps, SignInAuthorizationParams, SignInOptions, SignInResponse, SignOutParams, SignOutResponse, UseSessionOptions } from "./lib/client.js";
export type { SignInOptions, SignInAuthorizationParams, SignOutParams, SignInResponse, };
export { SessionProviderProps };
export declare const __NEXTAUTH: AuthClientConfig;
/** @todo Document */
export type UpdateSession = (data?: any) => Promise<Session | null>;
/**
 * useSession() returns an object containing three things: a method called {@link UpdateSession|update}, `data` and `status`.
 */
export type SessionContextValue<R extends boolean = false> = R extends true ? {
    update: UpdateSession;
    data: Session;
    status: "authenticated";
} | {
    update: UpdateSession;
    data: null;
    status: "loading";
} : {
    update: UpdateSession;
    data: Session;
    status: "authenticated";
} | {
    update: UpdateSession;
    data: null;
    status: "unauthenticated" | "loading";
};
export declare const SessionContext: React.Context<{
    update: UpdateSession;
    data: Session;
    status: "authenticated";
} | {
    update: UpdateSession;
    data: null;
    status: "unauthenticated" | "loading";
} | undefined>;
/**
 * React Hook that gives you access to the logged in user's session data and lets you modify it.
 *
 * :::info
 * `useSession` is for client-side use only and when using [Next.js App Router (`app/`)](https://nextjs.org/blog/next-13-4#nextjs-app-router) you should prefer the `auth()` export.
 * :::
 */
export declare function useSession<R extends boolean>(options?: UseSessionOptions<R>): SessionContextValue<R>;
export interface GetSessionParams {
    event?: "storage" | "timer" | "hidden" | string;
    triggerEvent?: boolean;
    broadcast?: boolean;
}
export declare function getSession(params?: GetSessionParams): Promise<Session | null>;
/**
 * Returns the current Cross-Site Request Forgery Token (CSRF Token)
 * required to make requests that changes state. (e.g. signing in or out, or updating the session).
 *
 * [CSRF Prevention: Double Submit Cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)
 */
export declare function getCsrfToken(): Promise<string>;
export declare function getProviders(): Promise<Record<ProviderId, ClientSafeProvider> | null>;
/**
 * Initiates a signin flow or sends the user to the signin page listing all possible providers.
 * Handles CSRF protection.
 *
 * @note This method can only be used from Client Components ("use client" or Pages Router).
 * For Server Actions, use the `signIn` method imported from the `auth` config.
 */
export declare function signIn(provider?: ProviderId, options?: SignInOptions<true>, authorizationParams?: SignInAuthorizationParams): Promise<void>;
export declare function signIn(provider?: ProviderId, options?: SignInOptions<false>, authorizationParams?: SignInAuthorizationParams): Promise<SignInResponse>;
/**
 * Initiate a signout, by destroying the current session.
 * Handles CSRF protection.
 *
 * @note This method can only be used from Client Components ("use client" or Pages Router).
 * For Server Actions, use the `signOut` method imported from the `auth` config.
 */
export declare function signOut(options?: SignOutParams<true>): Promise<void>;
export declare function signOut(options?: SignOutParams<false>): Promise<SignOutResponse>;
/**
 * [React Context](https://react.dev/learn/passing-data-deeply-with-context) provider to wrap the app (`pages/`) to make session data available anywhere.
 *
 * When used, the session state is automatically synchronized across all open tabs/windows and they are all updated whenever they gain or lose focus
 * or the state changes (e.g. a user signs in or out) when {@link SessionProviderProps.refetchOnWindowFocus} is `true`.
 *
 * :::info
 * `SessionProvider` is for client-side use only and when using [Next.js App Router (`app/`)](https://nextjs.org/blog/next-13-4#nextjs-app-router) you should prefer the `auth()` export.
 * :::
 */
export declare function SessionProvider(props: SessionProviderProps): JSX.Element;
//# sourceMappingURL=react.d.ts.map