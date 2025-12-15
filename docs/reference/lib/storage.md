# storage.ts

**Path**: `lib\storage.ts`

## uploadObject

**Type**: `FunctionDeclaration`

```typescript
export async function uploadObject(
  key: string,
  data: Buffer | Uint8Array | string,
  options:
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| key | `string` | true |
| data | `string | Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>` | true |
| options | `{ contentType: string; cacheControl?: string | undefined; }` | true |

## getObjectStream

**Type**: `FunctionDeclaration`

```typescript
export async function getObjectStream(key: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| key | `string` | true |

## getSignedUrlForKey

**Type**: `FunctionDeclaration`

```typescript
export async function getSignedUrlForKey(
  key: string,
  opts?:
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| key | `string` | true |
| opts | `{ expiresInSeconds?: number | undefined; } | undefined` | false |

## deleteObject

**Type**: `FunctionDeclaration`

```typescript
export async function deleteObject(key: string): Promise<boolean>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| key | `string` | true |

## uploadFile

**Type**: `FunctionDeclaration`

```typescript
export async function uploadFile(file: File, folder: "avatars" | "files" | "uploads" = "uploads"): Promise<string>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| file | `File` | true |
| folder | `"avatars" | "files" | "uploads"` | false |

## deleteFile

**Type**: `VariableDeclaration`

## getSignedUrl

**Type**: `VariableDeclaration`

