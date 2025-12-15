# layout.tsx

**Path**: `app\[lang]\layout.tsx`

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
} | `{ params: Promise<{ lang: "tr" | "en"; }>; }` | true |

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
} | `{ children: React.ReactNode; params: Promise<{ lang: "tr" | "en"; }>; }` | true |

