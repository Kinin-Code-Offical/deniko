# api-response.ts

**Path**: `apps\web\lib\api-response.ts`

/* eslint-disable @typescript-eslint/no-unused-vars */

## assertOkOrRedirect

**Type**: `FunctionDeclaration`

------------------------------------------------------------------
FOR SERVER COMPONENTS & SERVER ACTIONS
Uses next/navigation to throw errors that Next.js catches to render UI.
------------------------------------------------------------------

```typescript
export async function assertOkOrRedirect(res: Response, ctx?: RedirectContext)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| res | `Response` | true |
| ctx | `RedirectContext` | false |

## parseJsonOrRedirect

**Type**: `FunctionDeclaration`

Parses JSON from the response if OK.
- 401/403 -> Redirects to /forbidden
- 404/410 -> Throws notFound()
- Other errors -> Throws Error

```typescript
export async function parseJsonOrRedirect<T>(res: Response, ctx?: RedirectContext): Promise<T>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| res | `Response` | true |
| ctx | `RedirectContext` | false |

## forwardProxyResponseOrRedirect

**Type**: `FunctionDeclaration`

------------------------------------------------------------------
FOR ROUTE HANDLERS (app/api/...)
Returns NextResponse objects to control the HTTP response directly.
------------------------------------------------------------------

```typescript
export async function forwardProxyResponseOrRedirect(
    res: Response,
    req: Request,
    ctx?: RedirectContext &
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| res | `Response` | true |
| req | `Request` | true |
| ctx | `RedirectContext & { returnJsonOn404?: boolean; }` | false |

