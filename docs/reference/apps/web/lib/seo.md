# seo.ts

**Path**: `apps\web\lib\seo.ts`

## generateI18nAlternates

**Type**: `FunctionDeclaration`

Generates the 'alternates' metadata for SEO, including canonical and hreflang tags.

```typescript
export function generateI18nAlternates(
  route: string,
  currentLocale: string
): Metadata["alternates"]
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| route | `string` | true |
| currentLocale | `string` | true |

