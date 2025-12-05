import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import logger from '@/lib/logger'
import { env } from '@/lib/env'

const isProd = env.NODE_ENV === 'production'
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 120
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>()

const attachSecurityHeaders = (response: NextResponse) => {
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    if (isProd) {
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    }

    return response
}

const syncLocaleCookie = (response: NextResponse, locale: string) => {
    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
        secure: isProd,
    })
}

const getClientIp = (request: NextRequest) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((request as any).ip as string | undefined) ?? request.headers.get('x-forwarded-for') ?? 'unknown'

const isRateLimited = (ip: string) => {
    const now = Date.now()
    const bucket = rateLimitBuckets.get(ip)

    if (!bucket || bucket.resetAt < now) {
        rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
        return false
    }

    bucket.count += 1

    if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
        return true
    }

    rateLimitBuckets.set(ip, bucket)
    return false
}

function getLocale(request: NextRequest): string | undefined {
    // 1. Check cookie
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
        return cookieLocale
    }

    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    // @ts-expect-error locales are readonly
    const locales: string[] = i18n.locales
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

    try {
        return matchLocale(languages, locales, i18n.defaultLocale)
    } catch {
        return i18n.defaultLocale
    }
}

export default function proxy(request: NextRequest) {
    const { nextUrl, method, headers, cookies, url } = request
    const { pathname, search } = nextUrl
    const requestId = crypto.randomUUID()
    const clientIp = getClientIp(request)

    if (isRateLimited(clientIp)) {
        const limitedResponse = attachSecurityHeaders(
            NextResponse.json(
                {
                    error: 'too_many_requests',
                    message: 'Rate limit exceeded. Please slow down.',
                },
                { status: 429 }
            )
        )

        limitedResponse.headers.set('x-request-id', requestId)
        limitedResponse.headers.set(
            'Retry-After',
            String(RATE_LIMIT_WINDOW_MS / 1000)
        )
        return limitedResponse
    }

    // Log Request
    logger.info({
        msg: 'Incoming Request',
        requestId,
        method,
        url: pathname,
        ip: clientIp,
        userAgent: headers.get('user-agent'),
    })

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request)

        // e.g. incoming request is /products
        // The new URL is now /en-US/products
        const newUrl = new URL(
            `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
            url
        )

        // Preserve query parameters
        newUrl.search = search

        const response = attachSecurityHeaders(NextResponse.redirect(newUrl))

        response.headers.set('x-request-id', requestId)

        if (locale && cookies.get('NEXT_LOCALE')?.value !== locale) {
            syncLocaleCookie(response, locale)
        }

        return response
    } else {
        // If locale is present in path, ensure cookie matches
        const localeInPath = i18n.locales.find(
            (locale) =>
                pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        )

        if (localeInPath) {
            const response = attachSecurityHeaders(NextResponse.next())

            response.headers.set('x-request-id', requestId)

            if (cookies.get('NEXT_LOCALE')?.value !== localeInPath) {
                syncLocaleCookie(response, localeInPath)
            }

            return response
        }
    }

    const fallbackResponse = attachSecurityHeaders(NextResponse.next())
    fallbackResponse.headers.set('x-request-id', requestId)
    return fallbackResponse
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
