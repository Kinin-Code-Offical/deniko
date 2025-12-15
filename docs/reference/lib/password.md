# password.ts

**Path**: `lib\password.ts`

## hashPassword

**Type**: `FunctionDeclaration`

Hashes a password using bcryptjs.

```typescript
export async function hashPassword(password: string): Promise<string>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| password | `string` | true |

## verifyPassword

**Type**: `FunctionDeclaration`

Verifies a password against a hash.

```typescript
export async function verifyPassword(password: string, hash: string): Promise<boolean>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| password | `string` | true |
| hash | `string` | true |

