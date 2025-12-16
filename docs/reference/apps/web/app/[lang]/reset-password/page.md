# page.tsx

**Path**: `apps\web\app\[lang]\reset-password\page.tsx`

## generateMetadata

**Type**: `FunctionDeclaration`

```typescript
export async function generateMetadata(
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| {
  params,
} | `{ params: Promise<{ lang: Locale; }>; }` | true |

## default

**Type**: `FunctionDeclaration`

```typescript
export default async function ResetPasswordPage(
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| {
  params,
  searchParams,
} | `{ params: Promise<{ lang: Locale; }>; searchParams: Promise<{ token?: string; }>; }` | true |

