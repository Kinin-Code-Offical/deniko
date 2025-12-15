# json-ld.ts

**Path**: `lib\json-ld.ts`

## generatePersonSchema

**Type**: `FunctionDeclaration`

```typescript
export function generatePersonSchema(
  name: string,
  url: string,
  image?: string | null
): WithContext<Person>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| name | `string` | true |
| url | `string` | true |
| image | `string | null | undefined` | false |

## generateOrganizationSchema

**Type**: `FunctionDeclaration`

```typescript
export function generateOrganizationSchema(): WithContext<Organization>
```

## generateWebSiteSchema

**Type**: `FunctionDeclaration`

```typescript
export function generateWebSiteSchema(): WithContext<WebSite>
```

## generateBreadcrumbSchema

**Type**: `FunctionDeclaration`

```typescript
export function generateBreadcrumbSchema(
  items:
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| items | `{ name: string; item: string; }[]` | true |

