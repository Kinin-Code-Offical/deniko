# utils.ts

**Path**: `lib\utils.ts`

## cn

**Type**: `FunctionDeclaration`

Merges Tailwind CSS classes with clsx.

```typescript
export function cn(...inputs: ClassValue[])
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| inputs | `import("C:/BASE/DENIKO-PROJECT/deniko/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/clsx").ClassValue[]` | false |

## formatPhoneNumber

**Type**: `FunctionDeclaration`

```typescript
export function formatPhoneNumber(value: string | null | undefined)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| value | `string | null | undefined` | true |

## isDicebearUrl

**Type**: `FunctionDeclaration`

```typescript
export function isDicebearUrl(url: string): boolean
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| url | `string` | true |

## getAvatarUrl

**Type**: `FunctionDeclaration`

```typescript
export function getAvatarUrl(image: string | null | undefined, userId: string, version?: number)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| image | `string | null | undefined` | true |
| userId | `string` | true |
| version | `number | undefined` | false |

## getRadianAngle

**Type**: `FunctionDeclaration`

```typescript
export function getRadianAngle(degreeValue: number)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| degreeValue | `number` | true |

## rotateSize

**Type**: `FunctionDeclaration`

Returns the new bounding area of a rotated rectangle.

```typescript
export function rotateSize(width: number, height: number, rotation: number)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| width | `number` | true |
| height | `number` | true |
| rotation | `number` | true |

## getCroppedImg

**Type**: `FunctionDeclaration`

```typescript
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop:
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| imageSrc | `string` | true |
| pixelCrop | `{ x: number; y: number; width: number; height: number; }` | true |
| rotation | `number` | false |
| flip | `{ horizontal: boolean; vertical: boolean; }` | false |

## createImage

**Type**: `VariableDeclaration`

