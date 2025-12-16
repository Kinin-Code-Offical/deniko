# email.ts

**Path**: `apps\web\lib\email.ts`

## sendPasswordResetEmail

**Type**: `FunctionDeclaration`

Sends a password reset email to the user.

```typescript
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  lang: string = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |
| token | `string` | true |
| lang | `string` | false |

## sendSupportTicketEmail

**Type**: `FunctionDeclaration`

Sends a support ticket email to the support team.

```typescript
export async function sendSupportTicketEmail(data:
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| data | `{ ticketId: string; type: string; name: string; email: string; message: string; }` | true |

## sendVerificationEmail

**Type**: `FunctionDeclaration`

Sends a verification email to the user.

```typescript
export async function sendVerificationEmail(
  email: string,
  token: string,
  lang: Locale = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |
| token | `string` | true |
| lang | `Locale` | false |

## sendEmailChangeVerificationEmail

**Type**: `FunctionDeclaration`

Sends an email change verification email to the user.

```typescript
export async function sendEmailChangeVerificationEmail(
  email: string,
  token: string,
  lang: Locale = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |
| token | `string` | true |
| lang | `Locale` | false |

