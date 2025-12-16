# page.tsx

**Path**: `apps\web\app\[lang]\page.tsx`

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
export default async function Home(
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| {
  params,
} | `{ params: Promise<{ lang: Locale; }>; }` | true |

## dynamic

**Type**: `VariableDeclaration`

## revalidate

**Type**: `VariableDeclaration`

