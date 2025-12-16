# user-api.ts

**Path**: `apps\web\lib\user-api.ts`

## getUserByEmail

**Type**: `FunctionDeclaration`

```typescript
export async function getUserByEmail(email: string): Promise<User | null>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |

## getUserById

**Type**: `FunctionDeclaration`

```typescript
export async function getUserById(id: string): Promise<User | null>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| id | `string` | true |

## getUserByUsername

**Type**: `FunctionDeclaration`

```typescript
export async function getUserByUsername(username: string): Promise<User | null>
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| username | `string` | true |

## Role

**Type**: `EnumDeclaration`

## User

**Type**: `InterfaceDeclaration`

### Properties

| Name | Type |
|------|------|
| id | `string` |
| name | `string` |
| email | `string` |
| emailVerified | `Date` |
| image | `string` |
| password | `string` |
| role | `import("C:/BASE/DENIKO-PROJECT/deniko/apps/web/lib/user-api").Role` |
| isActive | `boolean` |
| isOnboardingCompleted | `boolean` |
| username | `string` |
| avatarVersion | `number` |

