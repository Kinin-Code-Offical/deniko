# auth.ts

**Path**: `app\actions\auth.ts`

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

## resendVerificationCode

**Type**: `FunctionDeclaration`

Resends the email verification code to the user.

```typescript
export async function resendVerificationCode(
  email: string,
  lang: string = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |
| lang | `string` | false |

## registerUser

**Type**: `FunctionDeclaration`

Registers a new user.

```typescript
export async function registerUser(
  formData: RegisterFormData,
  lang: string = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| formData | `RegisterFormData` | true |
| lang | `string` | false |

## verifyEmail

**Type**: `FunctionDeclaration`

Verifies a user's email address using a token.

```typescript
export async function verifyEmail(token: string, lang: string = "tr")
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| lang | `string` | false |

## resendVerificationEmailAction

**Type**: `FunctionDeclaration`

Resends the verification email (alternative action).

```typescript
export async function resendVerificationEmailAction(
  email: string,
  lang: string = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| email | `string` | true |
| lang | `string` | false |

## forgotPassword

**Type**: `FunctionDeclaration`

Initiates the password reset flow.

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

Resets the user's password using a token.

```typescript
export async function resetPassword(
  token: string,
  newPassword: string,
  lang: string = "tr"
)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| newPassword | `string` | true |
| lang | `string` | false |

## verifyEmailChangeAction

**Type**: `FunctionDeclaration`

```typescript
export async function verifyEmailChangeAction(token: string, lang: string)
```

### Parameters

| Name | Type | Required |
|------|------|----------|
| token | `string` | true |
| lang | `string` | true |

