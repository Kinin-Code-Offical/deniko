# layout.tsx

**Path**: `apps\web\app\[lang]\layout.tsx`

## generateStaticParams

**Type**: `FunctionDeclaration`

```typescript
export async function generateStaticParams()
```

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
export default async function LangLayout(
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| {
  children,
  params,
} | `{ children: React.ReactNode; params: Promise<{ lang: Locale; }>; }` | true |

