# auth.ts

**Path**: `apps\web\app\actions\auth.ts`

## logout

**Type**: `FunctionDeclaration`

Logs out the current user and redirects to the login page.

```typescript
export async function logout()
```

## googleSignIn

**Type**: `FunctionDeclaration`

Initiates the Google OAuth sign-in flow.

```typescript
export async function googleSignIn()
```

## login

**Type**: `FunctionDeclaration`

Authenticates a user with email and password.

```typescript
export async function login(formData: LoginFormData, lang: string = "tr")
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| formData | `LoginFormData` | true |
| lang | `string` | false |

## register

**Type**: `FunctionDeclaration`

```typescript
export async function register(formData: RegisterFormData, lang: string = "tr")
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| formData | `RegisterFormData` | true |
| lang | `string` | false |

## verifyEmail

**Type**: `FunctionDeclaration`

```typescript
export async function verifyEmail(token: string, lang: string = "tr")
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| lang | `string` | false |

## resendVerificationEmail

**Type**: `FunctionDeclaration`

```typescript
export async function resendVerificationEmail(email: string, lang: string = "tr")
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |
| lang | `string` | false |

## forgotPassword

**Type**: `FunctionDeclaration`

```typescript
export async function forgotPassword(email: string, lang: string = "tr")
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |
| lang | `string` | false |

## resetPassword

**Type**: `FunctionDeclaration`

```typescript
export async function resetPassword(
  token: string,
  password: string,
  lang: string = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| password | `string` | true |
| lang | `string` | false |

## verifyEmailChange

**Type**: `FunctionDeclaration`

```typescript
export async function verifyEmailChange(token: string, lang: string = "tr")
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| lang | `string` | false |

## verifyEmailChangeAction

**Type**: `VariableDeclaration`

## registerUser

**Type**: `VariableDeclaration`

## resendVerificationCode

**Type**: `VariableDeclaration`

## resendVerificationEmailAction

**Type**: `VariableDeclaration`

